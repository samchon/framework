/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelServerClientArray
		extends ParallelSystemArray
		implements external.IExternalServerClientArray
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
		protected createChild(xml: library.XML): ParallelSystem
		{
			return this.createExternalServer(xml);
		}

		protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;
		protected abstract createExternalServer(xml: library.XML): IParallelServer;

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

		/* ---------------------------------------------------------
			METHOD OF SERVER AND CLIENT
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

		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as external.ExternalServer).connect();
		}
	}
}