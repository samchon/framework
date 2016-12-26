/// <reference path="../DistributedSystemArrayMediator.ts" />

namespace samchon.templates.distributed
{
	/**
	 * Mediator of Distributed Processing System, a server accepting slave clients.
	 *
	 * The {@link DistributedClientArrayMediator} is an abstract class, derived from {@link DistributedSystemArrayMediator}
	 * class, opening a server accepting {@link DistributedSystem distributed clients} as a **master**.
	 *
	 * Extends this {@link DistributedClientArrayMediator}, overrides {@link createServerBase createServerBase()} to
	 * determine which protocol to follow and {@link createExternalClient createExternalClient()} creating child
	 * {@link DistributedSystem} object. After the extending and overridings, open this server using the
	 * {@link open open()} method.
	 * 
	 * #### [Inherited] {@link DistributedSystemArrayMediator}
	 * @copydoc DistributedSystemArrayMediator
	 */
	export abstract class DistributedClientArrayMediator<System extends DistributedSystem>
		extends DistributedSystemArrayMediator<System>
		implements external.IExternalClientArray<System>
	{
		/**
		 * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
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
		 * This method {@link createServerBase createServerBase()} determines which protocol is used in this 
		 * {@link DistributedClientArrayMediator} object as a **master**. If the protocol is determined, then 
		 * {@link DistributedSystem distributed clients} who may connect to {@link DistributedClientArrayMediator this 
		 * server} must follow the specified protocol.
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
		 * When a {@link IClientDriver remote client} connects to this *master server of distributed processing system*, 
		 * then this {@link DistributedClientArrayMediator} creates a child {@link Distributed distributed client} object 
		 * through the {@link createExternalClient createExternalClient()} method.
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
		 * Note that, the {@link DistributedClientArrayMediator} is a server accepting {@link DistributedSystem distributed
		 * clients} as a master. There's no way to creating the {@link DistributedSystem distributed clients} in advance 
		 * before opening the server.
		 * 
		 * @param xml An {@link XML} object represents the child {@link DistributedSystem} object.
		 * @return null
		 */
		public createChild(xml: library.XML): System { return null; }
		
		/**
		 * Factory method creating {@link DistributedSystem} object.
		 * 
		 * The method {@link createExternalClient createExternalClient()} is a factory method creating a child 
		 * {@link DistributedSystem} object, that is called whenever a distributed client has connected, by
		 * {@link addClient addClient()}.
		 * 
		 * Overrides this {@link createExternalClient} method and creates a type of {@link DistributedSystem} object with
		 * the *driver* that communicates with the distributed client. After the creation, returns the object. Then whenever
		 * a distributed client has connected, matched {@link DistributedSystem} object will be constructed and 
		 * {@link insert inserted} into this {@link DistributedClientArrayMediator} object.
		 * 
		 * @param driver A communicator with the distributed client.
		 * @return A newly created {@link DistributedSystem} object.
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