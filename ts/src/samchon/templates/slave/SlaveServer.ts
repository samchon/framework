/// <reference path="../../API.ts" />

/// <reference path="SlaveSystem.ts" />

namespace samchon.templates.slave
{
	export interface ISlaveServer
		extends SlaveSystem, protocol.IServer
	{
	}

	export abstract class SlaveServer
		extends SlaveSystem
		implements ISlaveServer
	{
		private server_base_: protocol.IServerBase;

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

		protected abstract createServerBase(): protocol.IServerBase;

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
		public addClient(driver: protocol.IClientDriver): void
		{
			this.communicator_ = driver;
			driver.listen(this);
		}
	}
}