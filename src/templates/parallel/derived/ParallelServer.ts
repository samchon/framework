/// <reference path="../ParallelSystem.ts" />

namespace samchon.templates.parallel
{
	/**
	 * A driver for parallel slave server.
	 * 
	 * The {@link ParallelServer} is an abstract class, derived from the {@link ParallelSystem} class, connecting to 
	 * remote, parallel **slave** server. Extends this {@link ParallelServer} class and overrides the 
	 * {@link createServerConnector createServerConnector()} method following which protocol the **slave** server uses.
	 * 
	 * #### [Inherited] {@link ParallelSystem}
	 * @copydoc ParallelSystem
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
		public constructor(systemArray: ParallelSystemArray<IParallelServer>)
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