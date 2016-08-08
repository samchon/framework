/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray".ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		protected mediator: external.MediatorSystem;

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

		protected abstract createMediator(): external.MediatorSystem;

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
		public sendData(invoke: protocol.Invoke): void
		{
			if (invoke.has("invoke_history_uid") == true)
			{
				let piece_index: number = invoke.get("piece_index").getValue();
				let piece_size: number = invoke.get("piece_size").getValue();

				invoke.erase(invoke.end().advance(-2), invoke.end());
				this.sendPieceData(invoke, piece_index, piece_size);
			}
			else
				super.sendData(invoke);
		}

		public sendPieceData(invoke: protocol.Invoke, index: number, size: number): void
		{
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;

				let piece_size: number = (i == this.size() - 1)
					? size - index
					: Math.floor(size / this.size() * system.getPerformance());
				if (piece_size == 0)
					continue;

				system["send_piece_data"](invoke, index, piece_size);
				index += piece_size;
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