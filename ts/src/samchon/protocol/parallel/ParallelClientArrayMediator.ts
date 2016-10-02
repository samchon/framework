/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArrayMediator.ts" />

namespace samchon.protocol.parallel
{
	/**
	 * Mediator of Parallel Processing System, a server accepting slave clients.
	 * 
	 * The {@link ParallelClientArrayMediator} is an abstract class, derived from the {@link ParallelSystemArrayMedidator} 
	 * class, opening a server accepting {@link ParallelSystem parallel clients} as a **master**.
	 *
	 * Extends this {@link ParallelClientArrayMediator}, overrides {@link createServerBase createServerBase()} to 
	 * determine which protocol to follow and {@link createExternalClient createExternalClient()} creating child 
	 * {@link ParallelSystem} object. After the extending and overridings, open this server using the 
	 * {@lionk open open()} method.
	 * 
	 * #### [Inherited] {@link ParallelSystemArrayMediator}
	 * The {@link ParallelSystemArrayMediator} class be a **master** for its slave systems, and be a **slave** to its
	 * master system at the same time. This {@link ParallelSystemArrayMediator} be a **master **system, containing and
	 * managing {@link ParallelSystem} objects, which represent parallel slave systems, by extending
	 * {@link ParallelSystemArray} class. Also, be a **slave** system through {@link getMediator mediator} object, which is
	 * derived from the {@link SlavSystem} class.
	 *
	 * As a **slave**, you can specify this {@link ParallelSystemArrayMediator} to be <i>a client slave connecting to 
	 * master server</i> or <i>a server slave accepting master client</i> by overriding the {@link createMediator} method.
	 * Overrides the {@link createMediator createMediator()} method and return one of them:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * #### [Inherited] {@link ParallelSystemArray}
	 * The {@link ParallelSystemArray} is an abstract class containing and managing remote parallel slave system drivers,
	 * {@link ParallelSystem} objects. Within framework of network, {@link ParallelSystemArray} represents your system,
	 * a *Master* of *Parallel Processing System* that requesting *parallel process* to slave systems and the children
	 * {@link ParallelSystem} objects represent the remote slave systems, who is being requested the *parallel processes*.
	 *
	 * When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	 * When the **parallel process** has completed, {@link ParallelSystemArray} estimates each {@link ParallelSystem}'s
	 * {@link ParallelSystem.getPerformance performance index} basis on their execution time. Those performance indices
	 * will be reflected to the next **parallel process**, how much pieces to allocate to each {@link ParallelSystem}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * #### Proxy Pattern
	 * This class {@link ParallelSystemArray} is derived from the {@link ExternalSystemArray} class. Thus, you can take
	 * advantage of the *Proxy Pattern* in the {@link ParallelSystemArray} class. If a process to request is not the
	 * *parallel process* (to be distrubted to all slaves), but the **exclusive process** handled in a system, then it
	 * may better to utilizing the *Proxy Pattern*:
	 *
	 * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
	 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is *which can be done*.
	 *
	 * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
	 *
	 * <ul>
	 *	<li>
	 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called *Proxy Pattern*. </li>
	 * </ul>
	 *
	 * @handbook [Protocol - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ParallelClientArrayMediator
		extends ParallelSystemArrayMediator
		implements external.IExternalClientArray
	{
		/**
		 * @hidden
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
		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link IClientDriver remote client} connects to this *master server of parallel processing system*, 
		 * then this {@link ParallelClientArray<ediator} creates a child {@link ParallelSystem parallel client} object 
		 * through the {@link createExternalClient createExternalClient()} method and {@link insert inserts} it.
		 * 
		 * @param driver A communicator for parallel client.
		 */
		public addClient(driver: IClientDriver): void
		{
			let system: ParallelSystem = this.createExternalClient(driver);
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
		public createChild(xml: library.XML): ParallelSystem { return null; }

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
		 * constructed and {@link insert inserted} into this {@link ParallelClientArray} object.
		 * 
		 * @param driver A communicator with the parallel client.
		 * @return A newly created {@link ParallelSystem} object.
		 */
		protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;

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