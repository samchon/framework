/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray.ts" />

namespace samchon.templates.parallel
{
	/**
	 * Master of Parallel Processing System, a client connecting to slave servers.
	 * 
	 * The {@link ParallelServerArray} is an abstract class, derived from the {@link ParallelSystemArray} class, 
	 * connecting to {@link IParallelServer parallel servers}.
	 * 
	 * Extends this {@link ParallelServerArray} and overrides {@link createChild createChild()} method creating child 
	 * {@link IParallelServer} object. After the extending and overriding, construct children {@link IParallelServer}
	 * objects and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link ParallelSystemArray}
	 * The {@link ParallelSystemArray} is an abstract class containing and managing remote parallel **slave** system
	 * drivers, {@link ParallelSystem} objects. Within framework of network, {@link ParallelSystemArray} represents your
	 * system, a **Master** of *Parallel Processing System* that requesting *parallel process* to slave systems and the
	 * children {@link ParallelSystem} objects represent the remote slave systems, who is being requested the
	 * *parallel processes*.
	 *
	 * When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	 * When the **parallel process** has completed, {@link ParallelSystemArray} estimates each {@link ParallelSystem}'s
	 * {@link ParallelSystem.getPerformance performance index} basis on their execution time. Those performance indices
	 * will be reflected to the next **parallel process**, how much pieces to allocate to each {@link ParallelSystem}.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
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
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ParallelServerArray
		extends ParallelSystemArray
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
				let system: IParallelServer = this.at(i) as IParallelServer;
				if (system.connect == undefined)
					continue;

				system.connect();
			}
		}
	}
}