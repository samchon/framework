/// <reference path="../ExternalSystem.ts" />

namespace samchon.templates.external
{
	/**
	 * An external server driver.
	 *
	 * The {@link ExternalServer} is an abstract class, derived from the {@link ExternalSystem} class, connecting to
	 * remote, external server. Extends this {@link ExternalServer} class and overrides the
	 * {@link createServerConnector createServerConnector()} method following which protocol the external server uses.
	 * 
	 * #### [Inherited] {@link ExternalSystem}
	 * @copydoc ExternalSystem
	 */
	export abstract class ExternalServer 
		extends ExternalSystem
		implements IExternalServer
	{
		/**
		 * IP address of target external system to connect.
		 */
		protected ip: string;

		/**
		 * Port number of target external system to connect.
		 */
		protected port: number;

        /* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ExternalSystemArray}.
		 * 
		 * @param systemArray The parent {@link ExternalSystemArray} object.
		 */
		public constructor(systemArray: ExternalSystemArray<IExternalServer>)
		{
			super(systemArray);

			this.ip = "";
			this.port = 0;
		}

		/**
		 * Factory method creating {@link IServerConnector} object.
		 * 
		 * The {@link createServerConnector createServerConnector()} is an abstract method creating 
		 * {@link IServerConnector} object. Overrides and returns one of them, considering which templates the external
		 * system follows:
		 * 
		 * - {@link ServerConnector}
		 * - {@link WebServerConnector}
		 * - {@link DedicatedWorkerServerConnector}
		 * - {@link SharedWorkerServerConnector}
		 * 
		 * @return A newly created {@link IServerConnector} object.
		 */
		protected abstract createServerConnector(): protocol.IServerConnector;

        /* ---------------------------------------------------------
			PROCEDURES
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			this.communicator = this.createServerConnector();
			(this.communicator as protocol.IServerConnector).connect(this.ip, this.port);
		}
	}
}