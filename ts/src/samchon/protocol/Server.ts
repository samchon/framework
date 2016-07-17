/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export abstract class Server
	{
		public abstract open(port: number): void;

		public abstract close(): void;

		protected abstract addClient(clientDriver: IClientDriver): void;
	}
}