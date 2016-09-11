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
			ACCESSORS
		--------------------------------------------------------- */
		public getMediator(): MediatorSystem
		{
			return this.mediator_;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public _Complete_history(history: PRInvokeHistory): boolean
		{
			let ret: boolean = super._Complete_history(history);
			if (ret == true)
				this.mediator_._Complete_history(history.getUID());

			return ret;
		}
	}
}