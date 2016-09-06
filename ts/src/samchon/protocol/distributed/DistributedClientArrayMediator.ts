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
		 * <p> Factory method creating {@link IServerBase} object. </p>
		 * 
		 * <p> This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
		 * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who 
		 * may connect to {@link ExternalClientArray this server} must follow the specified protocol. </p>
		 * 
		 * <p> Creates and returns one of them: </p>
		 * <ul>
		 *	<li> {@link ServerBase} </li>
		 *	<li> {@link WebServerBase} </li>
		 *	<li> {@link SharedWorkerServerBase} </li>
		 * </ul>
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public addClient(driver: IClientDriver): void
		{
			let system: DistributedSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			if (system["communicator"] == null)
				system["communicator"] = driver;

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