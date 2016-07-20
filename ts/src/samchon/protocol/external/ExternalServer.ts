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

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.ip = "";
			this.port = 0;
		}

		/**
		 * Factory method creating server connector.
		 */
		protected abstract createServerConnector(): IServerConnector;

		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			if (this.communicator == null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as IServerConnector).connect(this.ip, this.port);
		}

		/**
		 * @inheritdoc
		 */
		public getIP(): string
		{
			return this.ip;
		}

		/**
		 * @inheritdoc
		 */
		public getPort(): number
		{
			return this.port;
		}
	}
}