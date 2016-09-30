/// <reference path="../../API.ts" />

/// <reference path="ParallelSystem.ts" />

namespace samchon.protocol.parallel
{
	export interface IParallelServer
		extends ParallelSystem
	{
		/**
		 * Connect to external server.
		 */
		connect(): void;
	}

	export abstract class ParallelServer
		extends ParallelSystem
		implements external.IExternalServer
	{
		protected ip: string;
		protected port: number;

		public constructor(systemArray: ParallelSystemArray)
		{
			super(systemArray);

			this.ip = "";
			this.port = 0;
		}

		protected abstract createServerConnector(): IServerConnector;

		public connect(): void
		{
			if (this.communicator != null)
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