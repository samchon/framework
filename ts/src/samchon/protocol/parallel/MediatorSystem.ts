/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.protocol.parallel
{
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		private system_array_mediator_: ParallelSystemArrayMediator;
		private progress_list_: std.HashMap<number, InvokeHistory>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArrayMediator)
		{
			super();

			this.system_array_mediator_ = systemArray;
			this.progress_list_ = new std.HashMap<number, InvokeHistory>();
		}

		public abstract start(): void;
		
		/**
		 * @hidden
		 */
		public createChild(xml: library.XML): external.ExternalSystemRole
		{
			return null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getSystemArray(): ParallelSystemArrayMediator
		{
			return this.system_array_mediator_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		private notify_end(uid: number): void
		{
			if (this.progress_list_.has(uid) == false)
				return;

			let history: InvokeHistory = this.progress_list_.get(uid);
			this.progress_list_.erase(uid);

			this.sendData(history.toInvoke());
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == true)
				return;
			else if (invoke.has("invoke_history_uid") == true)
			{
				let first: number = invoke.get("piece_first").getValue();
				let last: number = invoke.get("piece_last").getValue();

				invoke.erase(invoke.end().advance(-2), invoke.end());
				this.system_array_mediator_.sendPieceData(invoke, first, last);
			}
			else
				this.system_array_mediator_.sendData(invoke);
		}
	}
}

namespace samchon.protocol.parallel
{
	export class MediatorServer
		extends MediatorSystem
		implements IServer
	{
		private server_base: IServerBase;
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
			this.communicator = driver;
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
			this.server_base = this.createServerBase();
			if (this.server_base == null)
				return;

			this.server_base.open(port);
		}

		public close(): void
		{
			if (this.server_base != null)
				this.server_base.close();
		}
	}

	export class MediatorWebServer extends MediatorServer
	{
		protected createServerBase(): IServerBase
		{
			return new WebServerBase(this);
		}
	}

	export class MediatorSharedWorkerServer extends MediatorServer
	{
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
		implements external.IExternalServer
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
			if (this.communicator != null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as IServerConnector).connect(this.ip, this.port);
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