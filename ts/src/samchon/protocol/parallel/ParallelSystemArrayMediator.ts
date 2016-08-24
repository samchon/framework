/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray".ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		protected mediator: MediatorSystem;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.mediator = null;
		}

		protected abstract createMediator(): MediatorSystem;

		protected start_mediator(): void
		{
			if (this.mediator != null)
				return;

			this.mediator = this.createMediator();
			this.mediator.start();
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendPieceData(invoke: protocol.Invoke, first: number, last: number): void
		{
			let size: number = last - first;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;

				let piece_size: number = (i == this.size() - 1)
					? size - first
					: Math.floor(size / this.size() * system.getPerformance());
				if (piece_size == 0)
					continue;

				system["send_piece_data"](invoke, first, first + piece_size);
				first += piece_size;
			}
		}

		protected notify_end(history: PRInvokeHistory): boolean
		{
			let ret: boolean = super.notify_end(history);
			if (ret == true)
				this.mediator["notify_end"](history.getUID());

			return ret;
		}
	}
}