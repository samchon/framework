/// <reference path="../../API.ts" />

/// <reference path="ExternalSystem.ts" />

namespace samchon.protocol.external
{
	export interface IExternalServer extends ExternalSystem
	{
		connect(): void;

		getIP(): string;
		getPort(): number;
	}

	export abstract class ExternalServer 
		extends ExternalSystem
		implements IExternalServer
	{
		protected ip: string;
		protected port: number;

		public constructor()
		{
			super();
		}

		protected abstract createServerConnector(): ServerConnector;

		public connect(): void
		{
			if (this.communicator == null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as ServerConnector).connect(this.ip, this.port);
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