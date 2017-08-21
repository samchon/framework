/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.templates.slave
{
	/**
	 * A slave system.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class SlaveSystem
		implements protocol.IProtocol
	{
		/**
		 * @hidden
		 */
		protected communicator_: protocol.ICommunicator;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			this.communicator_ = null;
		}

		/* ---------------------------------------------------------
			INVOKE MSSAGE CHIAN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator_.sendData(invoke);
		}

		public abstract replyData(invoke: protocol.Invoke): void | Promise<void>;

		/**
		 * @hidden
		 */
		protected _Reply_data(invoke: protocol.Invoke): void
		{
			// INTERCEPT INVOKE MESSAGE
			if (invoke.has("_History_uid"))
			{
				// INIT HISTORY - WITH START TIME
				let history: InvokeHistory = new InvokeHistory(invoke);
				std.remove_if
				(
					invoke.begin(), invoke.end(),
					function (parameter: protocol.InvokeParameter): boolean
					{
						return parameter.getName() == "_History_uid"
							|| parameter.getName() == "_Process_name"
							|| parameter.getName() == "_Process_weight";
					}
				); // DETACH THE UID FOR FUNCTION AUTO-MATCHING

				// MAIN PROCESS - REPLY_DATA
				let pInvoke: PInvoke = new PInvoke(invoke, history, this);
				let ret: Promise<void> = this.replyData(pInvoke) as Promise<void>; // NOTHING OR PROMISE

				if (ret instanceof Function && ret.then instanceof Function && ret.catch instanceof Function)
				{
					ret.then(() =>
					{
						this._Complete_process(pInvoke);
					});
				}
				else
					this._Complete_process(pInvoke);
			}
			else
				this.replyData(invoke);
		}

		private _Complete_process(pInvoke: PInvoke): void
		{
			// NOTIFY - WITH END TIME
			if (pInvoke.isHold() == false)
				pInvoke.complete();
		}
	}
}