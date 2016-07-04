/// <reference path="../API.ts" />

/// <reference path="EntityCollection.ts" />

namespace samchon.protocol
{
	export abstract class ExternalSystemArray
		extends EntityArrayCollection<ExternalSystem>
		implements IProtocol
	{
		private server: IExtServer;

		/* ---------------------------------------------------------
			CONSTRUCTORS
				- DEFAULT
				- FACTORY METHOD FOR SERVER
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}
		
		protected abstract createServer(): IExtServer;

		protected abstract createClient(driver: ClientDriver): ExternalSystem;

		protected addClient(driver: ClientDriver): void
		{
			let system: ExternalSystem = this.createClient(driver);
			if (system == null)
				return;

			system["communicator"] = driver;
			driver.listen(system);

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
			this.server.open(port);
		}

		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).connect();
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