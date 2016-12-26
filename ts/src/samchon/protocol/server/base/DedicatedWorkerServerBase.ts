/// <reference path="../../../API.ts" />

/// <reference path="../DedicatedWorkerServer.ts" />

namespace samchon.protocol
{
	/**
	 * A substitute {@link DedicatedWorkerServer}.
	 * 
	 * The {@link DedicatedWorkerServerBase} is a substitute class who subrogates {@link DedicatedWorkerServer}'s
	 * responsibility.
	 * 
	 * #### [Inherited] {@link IServerBase}
	 * @copydoc IServerBase
	 */
	export class DedicatedWorkerServerBase
		extends DedicatedWorkerServer
		implements IServerBase
	{
		/**
		 * @hidden
		 */
		private hooker_: IServer;

        /* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		/**
		 * Construct from a *hooker*.
		 * 
		 * @param hooker A hooker throwing responsibility of server's role.
		 */
		public constructor(hooker: IServer)
		{
			super();
			this.hooker_ = hooker;
		}

		/**
		 * @inheritdoc
		 */
		public addClient(driver: IClientDriver): void
		{
			this.hooker_.addClient(driver);
		}
	}
}