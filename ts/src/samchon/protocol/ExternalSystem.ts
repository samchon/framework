/// <reference path="../API.ts" />

/// <reference path="EntityCollection.ts" />
/// <reference path="Entity.ts" />
/// <reference path="Server.ts" />

/// <reference path="NormalCommunicator.ts" />
/// <reference path="WebCommunicator.ts" />
/// <reference path="SharedWorker.ts" />

namespace samchon.protocol
{
	export abstract class ExternalSystemArray
		extends EntityArrayCollection<ExternalSystem>
		implements IProtocol
	{
		private server: IExtServer;

		/* =========================================================
			CONSTRUCTORS
				- MEMBER
				- FACTORY METHOD FOR CHILDREN
		============================================================
			MEMBER 
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}
		
		protected abstract createServer(): ExtNormalServerBase | ExtWebServerBase | ExtSharedWorkerServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public createChild(xml: library.XML): ExternalSystem
		{
			return this.createExternalServer(xml) as ExternalSystem;
		}

		protected abstract createExternalClient(driver: ClientDriver): IExternalClient;
		protected abstract createExternalServer(xml: library.XML): IExternalServer;

		protected addClient(driver: ClientDriver): void
		{
			let system: IExternalClient = this.createExternalClient(driver);
			if (system == null)
				return;
			
			if (system["communicator"] == null)
			{
				system["communicator"] = driver;
				driver.listen(system);
			}
			this.push_back(system);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public hasRole(key: string): boolean
		{
			for (let i: number = 0; i < this.size(); i++)
				for (let j: number = 0; j < this.at(i).size(); j++)
					if (this.at(i).at(j).key() == key)
						return true;

			return false;
		}
		
		public getRole(key: string): ExternalSystemRole
		{
			for (let i: number = 0; i < this.size(); i++)
				for (let j: number = 0; j < this.at(i).size(); j++)
					if (this.at(i).at(j).key() == key)
						return this.at(i).at(j);

			throw new std.OutOfRange("No role with such name.");
		}

		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		public open(port: number): void
		{
			this.server = this.createServer();
			if (this.server == null)
				return;

			this.server.open(port);
		}

		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}

		public sendData(invoke: Invoke): void
		{
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).sendData(invoke);
		}

		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);
		}

		/* --------------------------------
		-------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "systemArray";
		}
		public CHILD_TAG(): string
		{
			return "system";
		}
	}
}

namespace samchon.protocol
{
	export abstract class ExternalSystem
		extends EntityArrayCollection<ExternalSystemRole>
		implements IProtocol
	{
		protected communicator: Communicator;
		
		protected name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
			
			this.name = "";
			this.communicator = null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key(): string
		{
			return this.name;
		}
		
		public getName(): string
		{
			return this.name;
		}

		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: Invoke): void
		{
			this.communicator.sendData(invoke);
		}
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);

			for (let i: number = 0; i < this.size(); i++)
				this.at(i).replyData(invoke);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "system";
		}
		public CHILD_TAG(): string
		{
			return "role";
		}
	}

	export interface IExternalClient extends ExternalSystem
	{
	}

	export interface IExternalServer extends ExternalSystem
	{
		connect(): void;

		getIP(): string;
		getPort(): number;
	}
}

namespace samchon.protocol
{
	export abstract class ExternalSystemRole
		extends Entity
		implements IProtocol
	{
		private system: ExternalSystem;
		private name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(system: ExternalSystem)
		{
			super();
			this.system = system;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key(): string
		{
			return this.name;
		}

		public getSystem(): ExternalSystem
		{
			return this.system;
		}
		public getName(): string
		{
			return this.name;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: Invoke): void
		{
			this.system.sendData(invoke);
		}
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "role";
		}
	}
}

namespace samchon.protocol
{
	export interface IExtServer extends Server
	{
	}

	export class ExtNormalServerBase
		extends NormalServer
		implements IExtServer
	{
		private system_array: ExternalSystemArray;

		public constructor(system_array: ExternalSystemArray)
		{
			super();
			this.system_array = system_array;
		}

		protected addClient(driver: ClientDriver): void
		{
			this.system_array["addClient"](driver);
		}
	}

	export class ExtWebServerBase
		extends WebServer
		implements IExtServer
	{
		private system_array: ExternalSystemArray;

		public constructor(system_array: ExternalSystemArray)
		{
			super();
			this.system_array = system_array;
		}

		protected addClient(driver: ClientDriver): void
		{
			this.system_array["addClient"](driver);
		}
	}

	export class ExtSharedWorkerServerBase
		extends SharedWorkerServer
		implements IExtServer
	{
		private system_array: ExternalSystemArray;

		public constructor(system_array: ExternalSystemArray)
		{
			super();
			this.system_array = system_array;
		}

		protected addClient(driver: ClientDriver): void
		{
			this.system_array["addClient"](driver);
		}
	}
}