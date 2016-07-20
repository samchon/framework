/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArrayMediator.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelClientArrayMediator
		extends ParallelSystemArrayMediator
		implements external.IExternalClientArray
	{
		private server_base: IServerBase;

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

		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public addClient(driver: IClientDriver): void
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
}