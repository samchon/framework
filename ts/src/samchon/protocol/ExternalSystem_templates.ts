/// <reference path="../API.ts" />

/// <reference path="ExternalSystem.ts" />

namespace samchon.protocol
{
	export abstract class ExternalServerArray
		extends ExternalSystemArray
	{
		protected createServer(): ExtNormalServerBase | ExtWebServerBase | ExtSharedWorkerServerBase
		{
			return null;
		}
	}

	export abstract class ExternalNormalSystemArray
		extends ExternalSystemArray
	{
		protected createServer(): ExtNormalServerBase | ExtWebServerBase | ExtSharedWorkerServerBase
		{
			return new ExtNormalServerBase(this);
		}
	}

	export abstract class ExternalWebSystemArray
		extends ExternalSystemArray
	{
		protected createServer(): ExtNormalServerBase | ExtWebServerBase | ExtSharedWorkerServerBase
		{
			return new ExtWebServerBase(this);
		}
	}

	export abstract class ExternalSharedWorkerSystemArray
		extends ExternalSystemArray
	{
		protected createServer(): ExtNormalServerBase | ExtWebServerBase | ExtSharedWorkerServerBase
		{
			return new ExtSharedWorkerServerBase(this);
		}
	}

	export abstract class ExternalClient
		extends ExternalSystem
		implements IExternalClient
	{
	}
}

namespace samchon.protocol
{
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

	export abstract class ExternalNormalServer
		extends ExternalServer
	{
		protected createServerConnector(): ServerConnector
		{
			return new NormalServerConnector(this);
		}
	}

	export abstract class ExternalWebServer
		extends ExternalServer
	{
		protected createServerConnector(): ServerConnector
		{
			return new WebServerConnector(this);
		}
	}

	export abstract class ExternalSharedWorker
		extends ExternalServer
	{
		protected createServerConnector(): ServerConnector
		{
			return new SharedWorkerConnector(this);
		}
	}
}