/// <reference path="../../API.ts" />

/// <reference path="SlaveSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveClient
		extends SlaveSystem
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
		 * @inheritdoc
		 */
		protected abstract createServerConnector(): IServerConnector;
		
		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		public connect(ip: string, port: number): void
		{
			if (this.communicator_ != null)
				return;

			this.communicator_ = this.createServerConnector();
			(this.communicator_ as IServerConnector).connect(ip, port);
		}
	}
}