/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	export abstract class ClientDriver extends Communicator
	{
		public constructor()
		{
			super();
		}

		public abstract listen(listener: IProtocol): void;
	}
}