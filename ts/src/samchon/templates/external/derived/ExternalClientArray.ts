/// <reference path="../ExternalSystemArray.ts" />

namespace samchon.templates.external
{
	/**
	 * An array and manager of {@link ExternalSystem external clients} as a server.
	 * 
	 * The {@link ExternalClientArray} is an abstract class, derived from the {@link ExternalSystemArray} class, opening
	 * a server accepting {@link ExternalSystem external clients}.
	 *
	 * Extends this {@link ExternalClientArray}, overrides {@link createServerBase createServerBase()} to determine which
	 * protocol to follow and {@link createExternalClient createExternalClient()} creating child {@link ExternalSystem}
	 * object. After the extending and overridings, open this server using the {@link open open()} method.
	 * 
	 * #### [Inherited] {@link ExternalSystemArray}
	 * @copydoc ExternalSystemArray
	 */
	export abstract class ExternalClientArray<T extends ExternalSystem>
		extends ExternalSystemArray<T>
		implements IExternalClientArray<T>
	{
		/**
		 * @hidden
		 */
		private server_base_: protocol.IServerBase;

		/* =========================================================
			CONSTRUCTORS
				- MEMBER
				- FACTORY METHOD FOR CHILDREN
		============================================================
			MEMBER 
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.server_base_ = null;
		}

		/**
		 * Factory method creating {@link IServerBase} object.
		 * 
		 * This method {@link createServerBase createServerBase()} determines which templates is used in this server,
		 * {@link ExternalClientArray}. If the templates is determined, then {@link ExternalSystem external clients} who 
		 * may connect to {@link ExternalClientArray this server} must follow the specified templates.
		 * 
		 * Creates and returns one of them:
		 * 
		 * - {@link ServerBase}
		 * - {@link WebServerBase}
		 * - {@link SharedWorkerServerBase}
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): protocol.IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link IClientDriver remote client} connects to this *server* {@link ExternalClientArray} object, 
		 * then this {@link ExternalClientArray} creates a child {@link ExternalSystem external client} object through 
		 * the {@link createExternalClient createExternalClient()} method and {@link insert inserts} it.
		 * 
		 * @param driver A communicator for external client.
		 */
		public addClient(driver: protocol.IClientDriver): void
		{
			let system: T = this.createExternalClient(driver);
			if (system == null)
				return;

			this.push_back(system);
		}

		/**
		 * (Deprecated) Factory method creating child object.
		 * 
		 * The method {@link createChild createChild()} is deprecated. Don't use and override this. 
		 * 
		 * Note that, the {@link ExternalClientArray} is a server accepting {@link ExternalSystem external clients}.
		 * There's no way to creating the {@link ExternalSystem external clients} in advance before opening the server.
		 * 
		 * @param xml An {@link XML} object represents the child {@link ExternalSystem} object.
		 * @return null
		 */
		public createChild(xml: library.XML): T { return null; }

		/**
		 * Factory method creating a child {@link ExternalSystem} object.
		 * 
		 * @param driver A communicator with connected client.
		 * @return A newly created {@link ExternalSystem} object.
		 */
		protected abstract createExternalClient(driver: protocol.IClientDriver): T;

		/* ---------------------------------------------------------
			METHOD OF SERVER
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server_base_ = this.createServerBase();
			if (this.server_base_ == null)
				return;

			this.server_base_.open(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.server_base_ == null)
				return;

			this.server_base_.close();
		}
	}
}