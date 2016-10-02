/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray".ts" />

namespace samchon.protocol.parallel
{
	/**
	 * Mediator of Parallel Processing System.
	 * 
	 * The {@link ParallelSystemArrayMediator} class be a **master** for its slave systems, and be a **slave** to its
	 * master system at the same time. This {@link ParallelSystemArrayMediator} be a **master **system, containing and
	 * managing {@link ParallelSystem} objects, which represent parallel slave systems, by extending
	 * {@link ParallelSystemArray} class. Also, be a **slave** system through {@link getMediator mediator} object, which is
	 * derived from the {@link SlavSystem} class.
	 * 
	 * As a **master**, you can specify this {@link ParallelSystemArrayMediator} class to be <i>a master server accepting 
	 * slave clients<i> or <i>a master client to connecting slave servers</i>. Even both of them is possible. Extends one
	 * of them below and overrides abstract factory method(s) creating the child {@link ParallelSystem} object.
	 *
	 * - {@link ParallelClientArrayMediator}: A server accepting {@link ParallelSystem parallel clients}.
	 * - {@link ParallelServerArrayMediator}: A client connecting to {@link ParallelServer parallel servers}.
	 * - {@link ParallelServerClientArrayMediator}: Both of them. Accepts {@link ParallelSystem parallel clients} and 
	 *                                              connects to {@link ParallelServer parallel servers} at the same time.
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
	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		/**
		 * @hidden
		 */
		private mediator_: MediatorSystem;

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
		 * You know what? this {@link ParallelSystemArrayMediator} class be a **master** for its slave systems, and be a 
		 * **slave** to its master system at the same time. The {@link MediatorSystem} object makes it possible; be a 
		 * **slave** system. This {@link createMediator} determines specific type of the {@link MediatorSystem}.
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
		 *   - {@link MediatorSharedWorkerServer}
		 * 
		 * @return A newly created {@link MediatorSystem} object.
		 */
		protected abstract createMediator(): MediatorSystem;

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
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get {@link MediatorSystem} object.
		 * 
		 * When you need to send an {@link Invoke} message to the master system of this 
		 * {@link ParallelSystemArrayMediator}, then send to the {@link MediatorSystem} through this {@link getMediator}.
		 * 
		 * ```typescript
		 * this.getMediator().sendData(...);
		 * ```
		 */
		public getMediator(): MediatorSystem
		{
			return this.mediator_;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Complete_history(history: PRInvokeHistory): boolean
		{
			let ret: boolean = super._Complete_history(history);
			if (ret == true)
				this.mediator_["complete_history"](history.getUID());

			return ret;
		}
	}
}