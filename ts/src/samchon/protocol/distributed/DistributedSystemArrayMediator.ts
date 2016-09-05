/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArray".ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemArrayMediator
		extends DistributedSystemArray
	{
		protected mediator_: parallel.MediatorSystem;

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

		protected abstract createMediator(): parallel.MediatorSystem;

		protected start_mediator(): void
		{
			if (this.mediator_ != null)
				return;

			this.mediator_ = this.createMediator();
			this.mediator_.start();
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		protected notify_end(history: parallel.PRInvokeHistory): boolean
		{
			let ret: boolean = super.notify_end(history);
			if (ret == true)
				this.mediator_["notify_end"](history.getUID());

			return ret;
		}
	}
}