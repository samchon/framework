/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.protocol.parallel
{
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		/**
		 * @hidden
		 */
		private system_array_: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator;
		
		/**
		 * @hidden
		 */
		private progress_list_: std.HashMap<number, InvokeHistory>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator)
		{
			super();

			this.system_array_ = systemArray;
			this.progress_list_ = new std.HashMap<number, InvokeHistory>();
		}

		public abstract start(): void;
		
		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		public getSystemArray(): ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator
		{
			return this.system_array_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private complete_history(uid: number): void
		{
			// NO SUCH HISTORY; THE PROCESS HAD DONE ONLY IN THIS MEDIATOR LEVEL.
			if (this.progress_list_.has(uid) == false)
				return;

			// COMPLETE THE HISTORY
			let history: InvokeHistory = this.progress_list_.get(uid);
			let start_time: Date = null;
			let end_time: Date = null;

			// DETERMINE WHEN STARTED AND COMPLETED TIME
			for (let i: number = 0; i < this.system_array_.size(); i++)
			{
				let system: ParallelSystem = this.system_array_.at(i);
				
				let it: std.MapIterator<number, InvokeHistory> = system["history_list_"].find(uid);
				if (it.equal_to(system["history_list_"].end()) == true)
					continue;
				
				let my_history: InvokeHistory = it.second;
				if (start_time == null || my_history.getStartTime() < start_time)
					start_time = my_history.getStartTime();
				if (end_time == null || my_history.getEndTime() > end_time)
					end_time = my_history.getEndTime();
			}
			history["start_time_"] = start_time;
			history["end_time_"] = end_time;
			
			// ERASE THE HISTORY ON PROGRESS LIST
			this.progress_list_.erase(uid);
			
			// REPORT THE HISTORY TO MASTER
			this.sendData(history.toInvoke());
		}

		/**
		 * @hidden
		 */
		protected _replyData(invoke: Invoke): void
		{
			if (invoke.has("_History_uid") == true)
			{
				// INIT HISTORY OBJECT
				let history: InvokeHistory = new InvokeHistory(invoke);

				if (this.system_array_.empty() == true)
				{
					// NO BELONGED SLAVE, THEN SEND BACK
					this.sendData(new Invoke("_Send_back_history", history.getUID()));
					return;
				}

				// REGISTER THIS PROCESS ON HISTORY LIST
				this.progress_list_.insert([history.getUID(), history]);

				if (invoke.has("_Piece_first") == true)
				{
					// PARALLEL PROCESS
					let first: number = invoke.get("_Piece_first").getValue();
					let last: number = invoke.get("_Piece_last").getValue();

					invoke.erase(invoke.end().advance(-2), invoke.end());
					this.system_array_.sendPieceData(invoke, first, last);
				}
				else if (this.system_array_ instanceof distributed.DistributedSystemArrayMediator
					&& invoke.has("_Role_name") == true)
				{
					// DISTRIBUTED PROCESS
					let ds_system_array: distributed.DistributedSystemArrayMediator 
						= this.system_array_ as distributed.DistributedSystemArrayMediator;

					// FIND THE MATCHED ROLE
					let role_name: string = invoke.get("_Role_name").getValue();
					if (ds_system_array.hasRole(role_name) == false)
						return;

					// SEND DATA VIA THE ROLE
					let role: distributed.DistributedSystemRole = ds_system_array.getRole(role_name);
					role.sendData(invoke);
				}
			}
			else
				this.replyData(invoke);
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			this.system_array_.sendData(invoke);
		}
	}
}

namespace samchon.protocol.parallel
{
	export class MediatorServer
		extends MediatorSystem
		implements slave.ISlaveServer
	{
		/**
		 * @hidden
		 */
		private server_base_: IServerBase;
		
		/**
		 * @hidden
		 */
		private port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArrayMediator, port: number)
		{
			super(systemArray);
			this.port = port;
		}

		protected createServerBase(): IServerBase
		{
			return new ServerBase(this);
		}

		public addClient(driver: IClientDriver): void
		{
			this.communicator_ = driver;
			driver.listen(this);
		}

		/* ---------------------------------------------------------
			SERVER's METHOD
		--------------------------------------------------------- */
		public start(): void
		{
			this.open(this.port);
		}

		public open(port: number): void
		{
			this.server_base_ = this.createServerBase();
			if (this.server_base_ == null)
				return;

			this.server_base_.open(port);
		}

		public close(): void
		{
			if (this.server_base_ != null)
				this.server_base_.close();
		}
	}

	export class MediatorWebServer extends MediatorServer
	{
		/**
		 * @inheritdoc
		 */
		protected createServerBase(): IServerBase
		{
			return new WebServerBase(this);
		}
	}

	export class MediatorSharedWorkerServer extends MediatorServer
	{
		/**
		 * @inheritdoc
		 */
		protected createServerBase(): IServerBase
		{
			return new SharedWorkerServerBase(this);
		}
	}
}

namespace samchon.protocol.parallel
{
	export class MediatorClient
		extends MediatorSystem
		implements slave.ISlaveClient
	{
		/**
		 * @hidden
		 */
		private ip: string;
		
		/**
		 * @hidden
		 */
		private port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArrayMediator, ip: string, port: number)
		{
			super(systemArray);

			this.ip = ip;
			this.port = port;
		}

		protected createServerConnector(): IServerConnector
		{
			return new ServerConnector(this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getIP(): string
		{
			return this.ip;
		}
		public getPort(): number
		{
			return this.port;
		}

		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		public start(): void
		{
			this.connect();
		}

		public connect(): void
		{
			if (this.communicator_ != null)
				return;

			this.communicator_ = this.createServerConnector();
			(this.communicator_ as IServerConnector).connect(this.ip, this.port);
		}
	}

	export class MediatorWebClient
		extends MediatorClient
	{
		/**
		 * @inheritdoc
		 */
		protected createServerConnector(): IServerConnector
		{
			return new WebServerConnector(this);
		}
	}

	export class MediatorSharedWorkerClient
		extends MediatorClient
	{
		/**
		 * @inheritdoc
		 */
		protected createServerConnector(): IServerConnector
		{
			return new SharedWorkerServerConnector(this);
		}
	}
}