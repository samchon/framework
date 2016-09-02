/// <reference path="../../API.ts" />

/// <reference path="SlaveSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveServer
		extends SlaveSystem
		implements IServer
	{
		private server_base_: IServerBase;

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

			this.server_base_ = null;
		}

		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			SERVER's METHOD
		--------------------------------------------------------- */
		public open(port: number): void
		{
			this.server_base_ = this.createServerBase();
			if (this.server_base_ == null)
				return;

			this.server_base_.open(port);
		}

		public close(): void
		{
			if (this.server_base_ != null)
				this.server_base_.close();
		}

		/* ---------------------------------------------------------
			OVERRIDINGS
		--------------------------------------------------------- */
		public addClient(driver: IClientDriver): void
		{
			this.communicator_ = driver;
			driver.listen(this);
		}
	}
}