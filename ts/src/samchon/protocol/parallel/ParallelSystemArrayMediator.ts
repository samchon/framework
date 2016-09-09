/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray".ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		private mediator_: MediatorSystem;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.mediator_ = null;
		}

		protected abstract createMediator(): MediatorSystem;

		protected start_mediator(): void
		{
			if (this.mediator_ != null)
				return;

			this.mediator_ = this.createMediator();
			this.mediator_.start();
		}

		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		public getMediator(): MediatorSystem
		{
			return this.mediator_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		protected _Notify_end(history: PRInvokeHistory): boolean
		{
			let ret: boolean = super._Notify_end(history);
			if (ret == true)
				this.mediator_["notify_end"](history.getUID());

			return ret;
		}
	}
}