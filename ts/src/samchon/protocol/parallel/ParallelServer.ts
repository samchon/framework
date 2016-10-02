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
		implements IParallelServer
	{
		/**
		 * IP address of target external system to connect.
		 */
		protected ip: string;
		
		/**
		 * Port number of target external system to connect.
		 */
		protected port: number;

		public constructor(systemArray: ParallelSystemArray)
		{
			super(systemArray);

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
			if (this.communicator != null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as IServerConnector).connect(this.ip, this.port);
		}
	}
}