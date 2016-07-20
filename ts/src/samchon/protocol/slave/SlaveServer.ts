/// <reference path="../../API.ts" />

/// <reference path="SlaveSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveServer
		extends SlaveSystem
		implements IServer
	{
		private server_base: IServerBase;

		/* =========================================================
			CONSTRUCTORS
				- MEMBER
				- FACTORY METHOD FOR CHILDREN
		============================================================
			MEMBER 
		--------------------------------------------------------- */
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
			this.communicator = driver;
			driver.listen(this);
		}

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