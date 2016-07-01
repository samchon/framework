/// <reference path="../APi.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	export abstract class ServerConnector
		extends Communicator
	{
		/**
		 * <p> An open-event listener. </p>
		 */
		public onopen: Function;

		public constructor(listener: IProtocol)
		{
			super();

			this.listener = listener;
			this.onopen = null;
		}

		public abstract connect(ip: string, port: number): void;
	}
}