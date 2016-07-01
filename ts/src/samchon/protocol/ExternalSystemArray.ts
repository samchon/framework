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
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		public abstract createChild(xml: library.XML): ExternalSystem;

		protected abstract createExternalClient(driver: ClientDriver): ExternalSystem;

		protected abstract createServer(): Server;

		protected addClient(driver: ClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			system["communicator"] = driver;
			driver.listen(system);

			this.push_back(system);
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