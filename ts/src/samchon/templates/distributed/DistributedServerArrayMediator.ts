/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArrayMediator.ts" />

namespace samchon.templates.distributed
{
	/**
	 * Mediator of Distributed Processing System, a client connecting to slave servers.
	 *
	 * The {@link DistributedServerArrayMediator} is an abstract class, derived from {@link DistributedSystemArrayMediator}
	 * class, connecting to {@link IDistributedServer distributed servers}.
	 *
	 * Extends this {@link DistributedServerArrayMediator} and overrides {@link createChild createChild()} method creating
	 * child {@link IDistributedServer} object. After the extending and overriding, construct children
	 * {@link IDistributedServer} objects and call the {@lionk connect connect()} method.
	 * 
	 * #### [Inherited] {@link DistributedSystemArrayMediator}
	 * The {@link DistributedSystemArrayMediator} class be a master for its slave systems, and be a slave to its master
	 * system at the same time. This {@link DistributedSystemArrayMediator} be a master system, containing and managing
	 * {@link DistributedSystem} objects, which represent distributed slave systems, by extending
	 * {@link DistributedSystemArray} class. Also, be a slave system through {@link getMediator mediator} object, which is
	 * derived from the {@link SlavSystem} class.
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
	 * - {@link hasRole}
	 * - {@link getRole}
	 * - {@link insertRole}
	 * - {@link eraseRole}
	 * - {@link getRoleMap}
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
	 * When the **parallel process** has completed, {@link DistributedSystemArray} estimates each
	 * {@link DistributedSystem}'s {@link DistributedSystem.getPerformance performance index} basis on their execution
	 * time. Those performance indices will be reflected to the next **parallel process**, how much pieces to allocate to
	 * each {@link DistributedSystem}.
	 *
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DistributedServerArrayMediator
		extends DistributedSystemArrayMediator
		implements external.IExternalServerArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		/* ---------------------------------------------------------
			CONNECTOR's METHOD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: external.ExternalSystem = this.at(i);
				if ((system as external.IExternalServer).connect == undefined)
					continue;

				(system as external.IExternalServer).connect();
			}
		}
	}
}