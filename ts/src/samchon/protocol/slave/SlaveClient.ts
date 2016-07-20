/// <reference path="../../API.ts" />

/// <reference path="SlaveSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveClient
		extends SlaveSystem
		implements external.IExternalServer
	{
		protected ip: string;
		protected port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.ip = "";
			this.port = 0;
		}

		protected abstract createServerConnector(): IServerConnector;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getIP(): string
		{
			return this.ip;
		}
		public getPort(): number
		{
			return this.port;
		}

		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		public connect(): void
		{
			if (this.communicator == null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as IServerConnector).connect(this.ip, this.port);
		}
	}
}