/// <reference path="../DistributedSystemArray.ts" />

namespace samchon.templates.distributed
{
	/**
	 * Master of Distributed Processing System, a server accepting slave clients.
	 *
	 * The {@link DistributedClientArray} is an abstract class, derived from the {@link DistributedSystemArray} class, 
	 * opening a server accepting {@link DistributedSystem distributed clients}.
	 *
	 * Extends this {@link DistributedClientArray}, overrides {@link createServerBase createServerBase()} to determine 
	 * which protocol to follow and {@link createExternalClient createExternalClient()} creating child 
	 * {@link DistributedSystem} object. After the extending and overridings, open this server using the 
	 * {@link open open()} method.
	 * 
	 * #### [Inherited] {@link DistributedSystemArray}
	 * @copydoc DistributedSystemArray
	 */
	export abstract class DistributedClientArray<System extends DistributedSystem>
		extends DistributedSystemArray<System>
		implements external.IExternalClientArray<System>
	{
		/**
		 * @hidden
		 */
		private server_base_: protocol.IServerBase;

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
		 * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
		 * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who 
		 * may connect to {@link ExternalClientArray this server} must follow the specified protocol.
		 * 
		 * Overrides the {@link createServerBase createServerBase()} method to create and return one of them:
		 * 
		 * - {@link ServerBase}
		 * - {@link WebServerBase}
		 * - {@link SharedWorkerServerBase}
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): protocol.IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link IClientDriver remote client} connects to this *master server of parallel processing system*, 
		 * then this {@link ParallelClientArray} creates a child {@link ParallelSystem parallel client} object through 
		 * the {@link createExternalClient createExternalClient()} method and {@link insert inserts} it.
		 * 
		 * @param driver A communicator for external client.
		 */
		public addClient(driver: protocol.IClientDriver): void
		{
			let system: System = this.createExternalClient(driver);
			if (system == null)
				return;

			this.push_back(system);
		}

		/**
		 * (Deprecated) Factory method creating child object.
		 * 
		 * The method {@link createChild createChild()} is deprecated. Don't use and override this. 
		 * 
		 * Note that, the {@link ParallelClientArray} is a server accepting {@link ParallelSystem parallel clients}. 
		 * There's no way to creating the {@link ParallelSystem parallel clients} in advance before opening the server.
		 * 
		 * @param xml An {@link XML} object represents the child {@link ParallelSystem} object.
		 * @return ```null```
		 */
		public createChild(xml: library.XML): System { return null; }

		/**
		 * Factory method creating {@link DistributedSystem} object.
		 * 
		 * The method {@link createExternalClient createExternalClient()} is a factory method creating a child 
		 * {@link ParallelSystem} object, that is called whenever a parallel client has connected, by 
		 * {@link addClient addClient()}.
		 * 
		 * Overrides this {@link createExternalClient} method and creates a type of {@link DistributedSystem} object with
		 * the *driver* that communicates with the parallel client. After the creation, returns the object. Then whenever 
		 * a parallel client has connected, matched {@link DistributedSystem} object will be constructed and 
		 * {@link insert inserted} into this {@link DistributedSystemArray} object.
		 * 
		 * @param driver A communicator with the parallel client.
		 * @return A newly created {@link ParallelSystem} object.
		 */
		protected abstract createExternalClient(driver: protocol.IClientDriver): System;

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