/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	export interface IExternalServerClientArray
		extends IExternalServerArray, IExternalClientArray
	{
	}

	export abstract class ExternalServerClientArray
		extends ExternalSystemArray
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
					(this.at(i) as IExternalServer).connect();
		}
	}
}