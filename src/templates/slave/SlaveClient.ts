/// <reference path="../../API.ts" />

/// <reference path="SlaveSystem.ts" />

namespace samchon.templates.slave
{
	export interface ISlaveClient
		extends SlaveSystem
	{
		connect(ip: string, port: number): void;
	}

	export abstract class SlaveClient
		extends SlaveSystem
		implements ISlaveClient
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
		protected abstract createServerConnector(): protocol.IServerConnector;
		
		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(ip: string, port: number): void
		{
			if (this.communicator_ != null)
				return;

			this.communicator_ = this.createServerConnector();
			(this.communicator_ as protocol.IServerConnector).connect(ip, port);
		}
	}
}