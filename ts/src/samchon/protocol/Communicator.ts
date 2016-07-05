/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export abstract class Communicator
	{
		protected listener: IProtocol;

		public constructor()
		{
			this.listener = null;
		}

		public abstract sendData(invoke: Invoke): void;

		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}
	}
}