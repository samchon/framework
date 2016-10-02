/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArrayMediator.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedClientArrayMediator
		extends DistributedSystemArrayMediator
		implements external.IExternalClientArray
	{
		/**
		 * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
		 */
		private server_base_: IServerBase;

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

		/**
		 * Factory method creating {@link IServerBase} object.
		 * 
		 * This method {@link createServerBase createServerBase()} determines which protocol is used in this 
		 * {@link DistributedClientArrayMediator} object as a **master**. If the protocol is determined, then 
		 * {@link ParallelSystem parallel clients} who may connect to {@link DistributedClientArrayMediator this server} 
		 * must follow the specified protocol.
		 * 
		 * Overrides the {@link createServerBase createServerBase()} method to create and return one of them:
		 * 
		 * - {@link ServerBase}
		 * - {@link WebServerBase}
		 * - {@link SharedWorkerServerBase}
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link IClientDriver remote client} connects to this *master server of parallel processing system*, 
		 * then this {@link ParallelClientArray} creates a child {@link ParallelSystem parallel client} object through 
		 * the {@link createExternalClient createExternalClient()} method.
		 * 
		 * @param driver A communicator for external client.
		 */
		public addClient(driver: IClientDriver): void
		{
			let system: DistributedSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			this.push_back(system);
		}

		public createChild(xml: library.XML): DistributedSystem { return null; }
		protected abstract createExternalClient(driver: IClientDriver): DistributedSystem;

		/* ---------------------------------------------------------
			SERVER's METHOD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server_base_ = this.createServerBase();
			if (this.server_base_ == null)
				return;

			this.server_base_.open(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.server_base_ == null)
				return;

			this.server_base_.close();
			this.clear();
		}
	}
}