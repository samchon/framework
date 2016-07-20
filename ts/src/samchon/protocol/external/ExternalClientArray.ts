/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	export interface IExternalClientArray
		extends ExternalSystemArray,
				IServer
	{
		open(port: number): void;
		close(): void;
	}

	export abstract class ExternalClientArray
		extends ExternalSystemArray
		implements IExternalClientArray
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

			this.server_base = null;
		}

		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public addClient(driver: IClientDriver): void
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
			METHOD OF SERVER
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