/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArray".ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemArrayMediator
		extends DistributedSystemArray
	{
		/**
		 * @hidden
		 */
		private mediator_: parallel.MediatorSystem;

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

		protected startMediator(): void
		{
			if (this.mediator_ != null)
				return;

			this.mediator_ = this.createMediator();
			this.mediator_.start();
		}

		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		public getMediator(): parallel.MediatorSystem
		{
			return this.mediator_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Complete_history(history: parallel.PRInvokeHistory): boolean
		{
			let ret: boolean = super._Complete_history(history);
			if (ret == true)
				this.mediator_["complete_history"](history.getUID());

			return ret;
		}
	}
}