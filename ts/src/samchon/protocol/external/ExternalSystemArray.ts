/// <reference path="../../API.ts" />

/// <reference path="../EntityCollection.ts" />

namespace samchon.protocol.external
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
		
		protected abstract createServer(): IExtServer;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		protected createChild(xml: library.XML): ExternalSystem
		{
			return this.createExternalServer(xml) as ExternalSystem;
		}

		protected abstract createExternalClient(driver: IClientDriver): ExternalSystem;
		protected abstract createExternalServer(xml: library.XML): IExternalServer;

		protected addClient(driver: IClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
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

		/* ---------------------------------------------------------
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