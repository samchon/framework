/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray".ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		private mediator: MediatorSystem;

		public constructor()
		{
			super();
		}

		protected abstract createMediator(): MediatorSystem;

		protected start_mediator(): void
		{
		}
	}
}