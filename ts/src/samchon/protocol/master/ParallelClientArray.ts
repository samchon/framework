/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelClientArray
		extends ParallelSystemArray
		implements external.IExternalClientArray
	{
		/**
		 * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
		 */
		private server_base: IServerBase;

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
		}

		/**
		 * <p> Factory method creating {@link IServerBase} object. </p>
		 * 
		 * <p> This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
		 * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who 
		 * may connect to {@link ExternalClientArray this server} must follow the specified protocol. </p>
		 * 
		 * <p> Creates and returns one of them: </p>
		 * <ul>
		 *	<li> {@link NormalServerBase} </li>
		 *	<li> {@link WebServerBase} </li>
		 *	<li> {@link SharedWorkerServerBase} </li>
		 * </ul>
		 * 
		 * @return A new {@link IServerBase} object.
		 */
		protected abstract createServerBase(): IServerBase;

		/* ---------------------------------------------------------
			FACTORY METHOD FOR CHILDREN
		--------------------------------------------------------- */
		public addClient(driver: IClientDriver): void
		{
			let system: ParallelSystem = this.createExternalClient(driver);
			if (system == null)
				return;

			if (system["communicator"] == null)
			{
				system["communicator"] = driver;
				driver.listen(system);
			}
			this.push_back(system);
		}

		protected createChild(xml: library.XML): ParallelSystem { return null; }
		protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;

		/* ---------------------------------------------------------
			SERVER's METHOD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server_base = this.createServerBase();
			if (this.server_base == null)
				return;

			this.server_base.open(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.server_base != null)
				this.server_base.close();
		}
	}
}