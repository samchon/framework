/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	export interface IExternalClientArray
		extends ExternalSystemArray
	{
		open(port: number): void;

		close(): void;
	}

	export abstract class ExternalClientArray
		extends ExternalSystemArray
		implements IExternalClientArray
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

		protected createChild(xml: library.XML): ExternalSystem { return null; }
		protected abstract createExternalClient(driver: IClientDriver): ExternalSystem;

		/* ---------------------------------------------------------
			SERVER's METHOD
		--------------------------------------------------------- */
		public open(port: number): void
		{
			this.server = this.createServer();
			if (this.server == null)
				return;

			this.server.open(port);
		}
		public close(): void
		{
			if (this.server != null)
				this.server.close();
		}
	}
}