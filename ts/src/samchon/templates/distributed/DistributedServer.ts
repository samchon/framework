/// <reference path="../../API.ts" />

/// <reference path="DistributedSystem.ts" />

namespace samchon.templates.distributed
{
	/**
	 * An interface for a distributed slave server driver.
	 * 
	 * The easiest way to defining a driver for distributed **slave** server is extending {@link DistributedServer} class. 
	 * However, if you've to interact with a prallel **slave** system who can be both server and client, them make a class 
	 * (let's name it **BaseSystem**) extending the {@link DistributedServer} class. At next, make a new class (now, I name 
	 * it **BaseServer**) extending the **BaseSystem** and implements this interface {@link IParallelServer}. Define the 
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
	export interface IDistributedServer
		extends DistributedSystem
	{
		/**
		 * Connect to external server.
		 */
		connect(): void;
	}

	/**
	 * A driver for distributed slave server.
	 *
	 * The {@link DistributedServer} is an abstract class, derived from the {@link DistributedSystem} class, connecting to
	 * remote, distributed **slave** server. Extends this {@link DistributedServer} class and overrides the
	 * {@link createServerConnector createServerConnector()} method following which protocol the **slave** server uses.
	 * 
	 * #### [Inheritdoc] {@link DistributedSystem}
	 * The {@link DistributedSystem} is an abstract class represents a **slave** system in *Distributed Processing System*,
	 * connected with this **master** system. This {@link DistributedSystem} takes full charge of network communication
	 * with the remote, distributed **slave** system has connected.
	 *
	 * This {@link DistributedSystem} has a {@link getPerformance performance index} that indicates how much the **slave**
	 * system is fast. The {@link getPerformance performance index} is referenced and revaluated whenever those methods
	 * are called:
	 *
	 * - Requesting a *parallel process*
	 *   - {@link DistributedSystemArray.sendSegmentData}
	 *   - {@link DistributedSystemArray.sendPieceData}
	 * - Requesting a *distributed process*: {@link DistributedProcess.sendData}
	 *
	 * Note that, this {@link DistributedSystem} class derived from the {@link ExternalSystem} class. Thus, this
	 * {@link DistributedSystem} can also have children {@link ExternalSystemRole} objects exclusively. However, the
	 * children {@link ExternalSystemRole roles} objects are different with the {@link DistributedProcess}. The
	 * domestic {@link ExternalSystemRole roles} are belonged to only a specific {@link DistributedSystem} object.
	 * Otherwise, the {@link DistributedProcess} objects are belonged to a {@link DistributedSystemArray} object.
	 * Furthermore, the relationship between this {@link DistributedSystem} and {@link DistributedProcess} classes are
	 * **M: N Associative**.
	 *
	 * Articles     | {@link DistributedProcess}     | {@link ExternalSystemRole}
	 * -------------|--------------------------------|----------------------------
	 * Belonged to  | {@link DistributedSystemArray} | {@link DistributedSystem}
	 * Relationship | M: N Associative               | 1: N Composite
	 * Ownership    | References                     | Exclusive possession
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DistributedServer
		extends DistributedSystem
		implements external.IExternalServer
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
		 * Construct from parent {@link DistributedSystemArray}.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArray} object.
		 */
		public constructor(systemArray: DistributedSystemArray<DistributedSystem>)
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
		 * - {@link DedicatedWorkerServerConnector}
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