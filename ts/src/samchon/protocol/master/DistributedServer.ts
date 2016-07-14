/// <referece path="../../API.ts" />

/// <reference path="DistributedSystem.ts" />

namespace samchon.protocol.master
{
	export interface IDistributedServer
		extends external.IExternalServer, DistributedSystem
	{
	}

	export abstract class DistributedServer
		extends DistributedSystem
		implements IDistributedServer
	{
		protected ip: string;
		protected port: number;

		public constructor(systemArray: DistributedSystemArray)
		{
			super(systemArray);

			this.ip = "";
			this.port = 0;
		}

		protected abstract createServerConnector(): IServerConnector;

		public connect(): void
		{
			if (this.communicator == null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as IServerConnector).connect(this.ip, this.port);
		}

		public getIP(): string
		{
			return this.ip;
		}
		public getPort(): number
		{
			return this.port;
		}
	}
}