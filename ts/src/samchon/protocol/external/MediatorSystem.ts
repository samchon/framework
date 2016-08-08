/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.protocol.external
{
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		private system_array: ExternalSystemArray;
		private progress_list: std.HashMap<number, InvokeHistory>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ExternalSystemArray)
		{
			super();

			this.system_array = systemArray;
			this.progress_list = new std.HashMap<number, InvokeHistory>();
		}

		public abstract start(): void;
		
		protected createChild(xml: library.XML): ExternalSystemRole
		{
			return null;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		private notify_end(uid: number): void
		{
			if (this.progress_list.has(uid) == false)
				return;

			let history: InvokeHistory = this.progress_list.get(uid);
			this.progress_list.erase(uid);

			this.sendData(history.toInvoke());
		}

		public replyData(invoke: protocol.Invoke): void
		{
			this.system_array.sendData(invoke);
		}
	}
}

namespace samchon.protocol.external
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
		public constructor(systemArray: ExternalSystemArray, port: number)
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

namespace samchon.protocol.external
{
	export class MediatorClient
		extends MediatorSystem
		implements IExternalServer
	{
		protected ip: string;
		protected port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ExternalSystemArray, ip: string, port: number)
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
		protected createServerConnector(): IServerConnector
		{
			return new WebServerConnector(this);
		}
	}

	//export class MediatorSharedWorkerClient
	//	extends MediatorClient
	//{
	//	protected createServerConnector(): IServerConnector
	//	{
	//		return new SharedWorkerServerConnector(this);
	//	}
	//}
}