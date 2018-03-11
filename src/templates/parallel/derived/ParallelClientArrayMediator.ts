/// <reference path="../ParallelSystemArrayMediator.ts" />

namespace samchon.templates.parallel
{
	/**
	 * Mediator of Parallel Processing System, a server accepting slave clients.
	 * 
	 * The {@link ParallelClientArrayMediator} is an abstract class, derived from the {@link ParallelSystemArrayMediator} 
	 * class, opening a server accepting {@link ParallelSystem parallel clients} as a **master**.
	 *
	 * Extends this {@link ParallelClientArrayMediator}, overrides {@link createServerBase createServerBase()} to 
	 * determine which protocol to follow and {@link createExternalClient createExternalClient()} creating child 
	 * {@link ParallelSystem} object. After the extending and overridings, open this server using the 
	 * {@link open open()} method.
	 * 
	 * #### [Inherited] {@link ParallelSystemArrayMediator}
	 * @copydoc ParallelSystemArrayMediator
	 */
	export abstract class ParallelClientArrayMediator<System extends ParallelSystem>
		extends ParallelSystemArrayMediator<System>
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
		 * {@link ParallelClientArrayMediator}. If the protocol is determined, then 
		 * {@link ParallelSystem parallel clients} who may connect to {@link ParallelClientArrayMediator this server} 
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
		protected abstract createServerBase(): protocol.IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link IClientDriver remote client} connects to this *master server of parallel processing system*, 
		 * then this {@link ParallelClientArrayMediator} creates a child {@link ParallelSystem parallel client} object 
		 * through the {@link createExternalClient createExternalClient()} method and {@link insert inserts} it.
		 * 
		 * @param driver A communicator for parallel client.
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
		 * Note that, the {@link ParallelClientArrayMediator} is a server accepting {@link ParallelSystem parallel 
		 * clients} as a master. There's no way to creating the {@link ParallelSystem parallel clients} in advance before 
		 * opening the server.
		 * 
		 * @param xml An {@link XML} object represents the child {@link ParallelSystem} object.
		 * @return null
		 */
		public createChild(xml: library.XML): System { return null; }

		/**
		 * Factory method creating {@link ParallelSystem} object.
		 * 
		 * The method {@link createExternalClient createExternalClient()} is a factory method creating a child 
		 * {@link ParallelSystem} object, that is called whenever a parallel client has connected, by 
		 * {@link addClient addClient()}.
		 * 
		 * Overrides this {@link createExternalClient} method and creates a type of {@link ParallelSystem} object with 
		 * the *driver* that communicates with the parallel client. After the creation, returns the {@link ParallelSystem}
		 * object. Then whenever a parallel client has connected, matched {@link ParallelSystem} object will be 
		 * constructed and {@link insert inserted} into this {@link ParallelClientArrayMediator} object.
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
			this.startMediator();
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