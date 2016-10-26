/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArray.ts" />

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
	 * The {@link DistributedSystemArray} is an abstract class containing and managing remote distributed **slave** system
	 * drivers, {@link DistributedSystem} objects. Within framework of network, {@link DistributedSystemArray} represents
	 * your system, a **Master** of *Distributed Processing System* that requesting *distributed process* to **slave**
	 * systems and the children {@link DistributedSystem} objects represent the remote **slave** systems, who is being
	 * requested the *distributed processes*.
	 *
	 * The {@link DistributedSystemArray} contains {@link DistributedProcess} objects directly. You can request a
	 * **distributed process** through the {@link DistributedProcess} object. You can access the
	 * {@link DistributedProcess} object(s) with those methods:
	 *
	 * - {@link hasProcess}
	 * - {@link getProcess}
	 * - {@link insertProcess}
	 * - {@link eraseProcess}
	 * - {@link getProcessMap}
	 *
	 * When you need the **distributed process**, call the {@link DistributedProcess.sendData} method. Then the
	 * {@link DistributedProcess} will find the most idle {@link DistributedSystem} object who represents a distributed
	 * **slave **system. The {@link Invoke} message will be sent to the most idle {@link DistributedSystem} object. When
	 * the **distributed process** has completed, then {@link DistributedSystem.getPerformance performance index} and
	 * {@link DistributedProcess.getResource resource index} of related objects will be revaluated.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * #### Parallel Process
	 * This {@link DistributedSystemArray} class is derived from the {@link ParallelSystemArray} class, so you can request
	 * a **parallel process**, too.
	 *
	 * When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	 * When the **parallel process** has completed, {@link ParallelSystemArray} estimates each {@link ParallelSystem}'s
	 * {@link ParallelSystem.getPerformance performance index} basis on their execution time. Those performance indices will
	 * be reflected to the next **parallel process**, how much pieces to allocate to each {@link ParallelSystem}.
	 *
	 * #### Proxy Pattern
	 * This class {@link DistributedSystemArray} is derived from the {@link ExternalSystemArray} class. Thus, you can take
	 * advantage of the *Proxy Pattern* in the {@link DistributedSystemArray} class. If a process to request is not the
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
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
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