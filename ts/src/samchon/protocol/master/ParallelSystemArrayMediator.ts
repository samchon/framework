/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray".ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		public open(port: number): void
		{
			this.start_mediator();
			super.open(port);
		}

		public connect(): void
		{
			this.start_mediator();
			super.connect();
		}

		private start_mediator(): void
		{
		}
	}
}