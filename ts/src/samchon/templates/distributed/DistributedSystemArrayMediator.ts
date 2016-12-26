/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArray.ts" />

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
	 * @copydoc DistributedSystemArray
	 */
	export abstract class DistributedSystemArrayMediator<System extends DistributedSystem>
		extends DistributedSystemArray<System>
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
		protected _Complete_history(history: slave.InvokeHistory): boolean
		{
			let ret: boolean = super._Complete_history(history);
			if (ret == true)
				this.mediator_["_Complete_history"](history.getUID());

			return ret;
		}
	}
}