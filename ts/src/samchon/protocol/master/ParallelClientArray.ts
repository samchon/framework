/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelClientArray
		extends ParallelSystemArray
		implements external.IExternalClientArray
	{
		private server: external.IExtServer;

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

		protected abstract createServer(): external.IExtServer;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		protected addClient(driver: IClientDriver): void
		{
			let system: ParallelSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			if (system["communicator"] == null)
			{
				system["communicator"] = driver;
				driver.listen(system);
			}
			this.push_back(system);
		}

		protected createChild(xml: library.XML): ParallelSystem { return null; }
		protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;

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