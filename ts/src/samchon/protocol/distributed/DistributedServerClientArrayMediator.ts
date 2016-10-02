/// <reference path="../../API.ts" />

/// <reference path="DistributedClientArrayMediator.ts" />

namespace samchon.protocol.distributed
{
	/**
	 * Mediator of Distributed Processing System, be a server and client at the same time as a **master**.
	 *
	 * The {@link DistributedServerClientArrayMediator} is an abstract class, derived from the
	 * {@link DistributedSystemArrayMediator} class, opening a server accepting {@link DistributedSystem distributed 
	 * clients} and being a client connecting to {@link IDistributedServer distributed servers} at the same time.
	 *
	 * Extends this {@link DistributedServerClientArrayMediator} and overrides below methods. After the overridings, open
	 * server with {@link open open()} method and connect to {@link IDistributedServer distributed servers} through the
	 * {@link connect connect()} method.
	 *
	 * - {@link createServerBase createServerBase()}
	 * - {@link createExternalClient createExternalClient()}
	 * - {@link createExternalServer createExternalServer()}
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
	 * The {@link DistributedSystemArray} contains {@link DistributedSystemRole} objects directly. You can request a
	 * **distributed process** through the {@link DistributedSystemRole} object. You can access the
	 * {@link DistributedSystemRole} object(s) with those methods:
	 *
	 * - {@link hasRole}
	 * - {@link getRole}
	 * - {@link insertRole}
	 * - {@link eraseRole}
	 * - {@link getRoleMap}
	 *
	 * When you need the **distributed process**, call the {@link DistributedSystemRole.sendData} method. Then the
	 * {@link DistributedSystemRole} will find the most idle {@link DistributedSystem} object who represents a distributed
	 * **slave **system. The {@link Invoke} message will be sent to the most idle {@link DistributedSystem} object. When
	 * the **distributed process** has completed, then {@link DistributedSystem.getPerformance performance index} and
	 * {@link DistributedSystemRole.getResource resource index} of related objects will be revaluated.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_distributed_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_distributed_system.png"
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
	 * @handbook [Protocol - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DistributedServerClientArrayMediator
		extends DistributedClientArrayMediator
		implements external.IExternalServerClientArray
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

			/**
		 * Factory method of a child Entity.
		 *
		 * This method is migrated to {@link createExternalServer}. Override the {@link createExternalServer} method.
		 *
		 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
		 * @return A new child Entity via {@link createExternalServer createExternalServer()}.
		 */
		public createChild(xml: library.XML): DistributedSystem
		{
			return this.createExternalServer(xml);
		}

		/**
		 * Factory method creating an {@link IDistributedServer} object.
		 *
		 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
		 * @return A newly created {@link IDistributedServer} object.
		 */
		protected abstract createExternalServer(xml: library.XML): IDistributedServer;

		/* ---------------------------------------------------------
			METHOD OF CLIENT
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