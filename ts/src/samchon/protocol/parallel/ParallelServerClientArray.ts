/// <reference path="../../API.ts" />

/// <reference path="ParallelClientArray.ts" />

namespace samchon.protocol.parallel
{
	/**
	 * Master of Parallel Processing System, be a server and client at the same time.
	 *
	 * The {@link ParallelServerClientArray} is an abstract class, derived from the {@link ParallelSystemArray} class, 
	 * opening a server accepting {@link ParallelSystem parallel clients} and being a client connecting to 
	 * {@link IParallelServer parallel servers} at the same time.
	 *
	 * Extends this {@link ParallelServerClientArray} and overrides below methods. After the overridings, open server 
	 * with {@link open open()} method and connect to {@link IParallelServer parallel servers} through the 
	 * {@link connect connect()} method.
	 * 
	 * - {@link createServerBase createServerBase()}
	 * - {@link createExternalClient createExternalClient()}
	 * - {@link createExternalServer createExternalServer()}
	 * 
	 * #### [Inherited] {@link ParallelSystemArray}
	 * The {@link ParallelSystemArray} is an abstract class containing and managing remote parallel system drivers,
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
	export abstract class ParallelServerClientArray
		extends ParallelClientArray
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
		public createChild(xml: library.XML): IParallelServer
		{
			return this.createExternalServer(xml);
		}

		/**
		 * Factory method creating an {@link IParallelServer} object.
		 *
		 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
		 * @return A newly created {@link IParallelServer} object.
		 */
		protected abstract createExternalServer(xml: library.XML): IParallelServer;

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