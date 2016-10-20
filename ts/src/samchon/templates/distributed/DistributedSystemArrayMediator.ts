/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArray".ts" />

namespace samchon.templates.distributed
{
	/**
	 * Mediator of Distributed Processing System.
	 * 
	 * The {@link DistributedSystemArrayMediator} class be a master for its slave systems, and be a slave to its master
	 * system at the same time. This {@link DistributedSystemArrayMediator} be a master system, containing and managing
	 * {@link DistributedSystem} objects, which represent distributed slave systems, by extending 
	 * {@link DistributedSystemArray} class. Also, be a slave system through {@link getMediator mediator} object, which is 
	 * derived from the {@link SlaveSystem} class.
	 *
	 * As a master, you can specify this {@link DistributedSystemArrayMediator} class to be <i>a master server accepting
	 * slave clients<i> or <i>a master client to connecting slave servers</i>. Even both of them is possible. Extends one
	 * of them below and overrides abstract factory method(s) creating the child {@link DistributedSystem} object.
	 *
	 * - {@link DistributedClientArrayMediator}: A server accepting {@link DistributedSystem distributed clients}.
	 * - {@link DistributedServerArrayMediator}: A client connecting to {@link DistributedServer distributed servers}.
	 * - {@link DistributedServerClientArrayMediator}: Both of them. Accepts {@link DistributedSystem distributed clients} and
	 *   connects to {@link DistributedServer distributed servers} at the same time.
	 *
	 * As a slave, you can specify this {@link DistributedSystemArrayMediator} to be <i>a client slave connecting to master
	 * server</i> or <i>a server slave accepting master client</i> by overriding the {@link createMediator} method.
	 * Overrides the {@link createMediator createMediator()} method and return one of them:
	 * 
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorDedicatedWorkerServer}
	 *   - {@link MediatorSharedWorkerServer}
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
	export abstract class DistributedSystemArrayMediator<T extends DistributedSystem>
		extends DistributedSystemArray<T>
	{
		/**
		 * @hidden
		 */
		private mediator_: parallel.MediatorSystem;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.mediator_ = null;
		}

		/**
		 * Factory method creating a {@link MediatorSystem} object.
		 * 
		 * The {@link createMediator createMediator()} is an abstract method creating the {@link MediatorSystem} object. 
		 * 
		 * You know what? this {@link DistributedSystemArrayMediator} class be a master for its slave systems, and be a 
		 * slave to its master system at the same time. The {@link MediatorSystem} object makes it possible; be a slave 
		 * system. This {@link createMediator} determines specific type of the {@link MediatorSystem}.
		 * 
		 * Overrides the {@link createMediator createMediator()} method to create and return one of them following which
		 * protocol and which type of remote connection (server or client) will be used: 
		 * 
		 * - A client slave connecting to master server:
		 *   - {@link MediatorClient}
		 *   - {@link MediatorWebClient}
		 *   - {@link MediatorSharedWorkerClient}
		 * - A server slave accepting master client:
		 *   - {@link MediatorServer}
		 *   - {@link MediatorWebServer}
		 *   - {@link MediatorDedicatedWorkerServer}
		 *   - {@link MediatorSharedWorkerServer}
		 * 
		 * @return A newly created {@link MediatorSystem} object.
		 */
		protected abstract createMediator(): parallel.MediatorSystem;

		/**
		 * Start mediator.
		 * 
		 * If the {@link getMediator mediator} is a type of server, then opens the server accepting master client. 
		 * Otherwise, the {@link getMediator mediator} is a type of client, then connects the master server.
		 */
		protected startMediator(): void
		{
			if (this.mediator_ != null)
				return;

			this.mediator_ = this.createMediator();
			this.mediator_.start();
		}

		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		/**
		 * Get {@link MediatorSystem} object.
		 * 
		 * When you need to send an {@link Invoke} message to the master system of this 
		 * {@link DistributedSystemArrayMediator}, then send to the {@link MediatorSystem} through this 
		 * {@link getMediator}.
		 * 
		 * ```typescript
		 * this.getMediator().sendData(...);
		 * ```
		 * 
		 * @return The {@link MediatorSystem} object.
		 */
		public getMediator(): parallel.MediatorSystem
		{
			return this.mediator_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Complete_history(history: parallel.PRInvokeHistory): boolean
		{
			let ret: boolean = super._Complete_history(history);
			if (ret == true)
				this.mediator_["complete_history"](history.getUID());

			return ret;
		}
	}
}