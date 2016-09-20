/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.protocol.parallel
{
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		private system_array_: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator;
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
		private complete_history(uid: number): void
		{
			if (this.progress_list_.has(uid) == false)
				return; // NO SUCH HISTORY; THE PROCESS HAD DONE ONLY IN THIS MEDIATOR LEVEL.

			// COMPLETE THE HISTORY
			let history: InvokeHistory = this.progress_list_.get(uid);
			history.complete();
			
			// ERASE THE HISTORY ON PROGRESS LIST
			this.progress_list_.erase(uid);
			
			// REPORT THE HISTORY TO MASTER
			this.sendData(history.toInvoke());
		}

		protected _replyData(invoke: Invoke): void
		{
			if (invoke.has("_History_uid") == true)
			{
				// REGISTER THIS PROCESS ON HISTORY LIST
				let history: InvokeHistory = new InvokeHistory(invoke);
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
					let ds_mediator: distributed.DistributedSystemArrayMediator 
						= this.system_array_ as distributed.DistributedSystemArrayMediator;

					// FIND THE MATCHED ROLE
					let role_name: string = invoke.get("_Role_name").getValue();
					if (ds_mediator.hasRole(role_name) == false)
						return;

					// SEND DATA VIA THE ROLE
					let role: distributed.DistributedSystemRole = ds_mediator.getRole(role_name);
					role.sendData(invoke);
				}
			}
			else
				this.replyData(invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == true)
				return;
			else
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
		private server_base_: IServerBase;
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
		protected ip: string;
		protected port: number;

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