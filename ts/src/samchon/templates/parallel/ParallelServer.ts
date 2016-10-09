/// <reference path="../../API.ts" />

/// <reference path="ParallelSystem.ts" />

namespace samchon.templates.parallel
{
	/**
	 * An interface for a parallel slave server driver.
	 * 
	 * The easiest way to defining a driver for parallel **slave** server is extending {@link ParallelServer} class. 
	 * However, if you've to interact with a prallel **slave** system who can be both server and client, them make a class 
	 * (let's name it **BaseSystem**) extending the {@link ParallelSystem} class. At next, make a new class (now, I name it 
	 * **BaseServer**) extending the **BaseSystem** and implements this interface {@link IParallelServer}. Define the 
	 * **BaseServer** following those codes on below:
	 * 
	 * <ul>
	 *	<li> {@link ExternalServer}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/external/ExternalServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link ParallelServer}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 *	<li> {@link DistributedServer}:
	 *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServer.ts"
	 *		   target="_blank"> View source code on GitHub </a>
	 *	</li>
	 * </ul>
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IParallelServer
		extends ParallelSystem
	{
		/**
		 * Connect to slave server.
		 */
		connect(): void;
	}

	/**
	 * A driver for parallel slave server.
	 * 
	 * The {@link ParallelServer} is an abstract class, derived from the {@link ParallelSystem} class, connecting to 
	 * remote, parallel **slave** server. Extends this {@link ParallelServer} class and overrides the 
	 * {@link createServerConnector createServerConnector()} method following which protocol the **slave** server uses.
	 * 
	 * #### [Inherited] {@link ParallelSystem}
	 * The {@link ParallelSystem} is an abstract class represents a **slave** system in *Parallel Processing System*,
	 * connected with this **master** system. This {@link ParallelSystem} takes full charge of network communication with 
	 * the remote, parallel **slave** system has connected.
	 *
	 * When a *parallel process* is requested (by {@link ParallelSystemArray.sendSegmentData} or
	 * {@link ParallelSystemArray.sendPieceData}), the number of pieces to be allocated to a {@link ParallelSystem} is
	 * turn on its {@link getPerformance performance index}. Higher {@link getPerformance performance index}, then
	 * more pieces are requested. The {@link getPerformance performance index} is revaluated whenever a *parallel process*
	 * has completed, basic on the execution time and number of pieces. You can sugguest or enforce the
	 * {@link getPerformance performance index} with {@link setPerformance} or {@link enforcePerformance}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * #### Bridge & Proxy Pattern
	 * This class {@link ParallelSystem} is derived from the {@link ExternalSystem} class. Thus, you can take advantage
	 * of the *Bridge & Proxy Pattern* in this {@link ParallelSystem} class. If a process to request is not the
	 * *parallel process* (to be distrubted to all slaves), but the **exclusive process** handled in a system, then it
	 * may better to utilizing the *Bridge & Proxy Pattern*:
	 *
	 * The {@link ExternalSystem} class can be a *bridge* for *logical proxy*. In framework within user,
	 * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
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
	 *	<li> Those strategy is called *Bridge Pattern* and *Proxy Pattern*. </li>
	 * </ul>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ParallelServer
		extends ParallelSystem
		implements IParallelServer
	{
		/**
		 * IP address of target external system to connect.
		 */
		protected ip: string;
		
		/**
		 * Port number of target external system to connect.
		 */
		protected port: number;

		/**
		 * Construct from parent {@link ParallelSystemArray}.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArray} object.
		 */
		public constructor(systemArray: ParallelSystemArray)
		{
			super(systemArray);

			this.ip = "";
			this.port = 0;
		}

		/**
		 * Factory method creating {@link IServerConnector} object.
		 * 
		 * The {@link createServerConnector createServerConnector()} is an abstract method creating 
		 * {@link IServerConnector} object. Overrides and returns one of them, considering which protocol the slave server 
		 * follows:
		 * 
		 * - {@link ServerConnector}
		 * - {@link WebServerConnector}
		 * - {@link SharedWorkerServerConnector}
		 * 
		 * @return A newly created {@link IServerConnector} object.
		 */
		protected abstract createServerConnector(): protocol.IServerConnector;

		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			if (this.communicator != null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as protocol.IServerConnector).connect(this.ip, this.port);
		}
	}
}