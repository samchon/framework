/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.templates.slave
{
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
				this.replyData(pInvoke);

				// NOTIFY - WITH END TIME
				if (pInvoke.isHold() == false)
					pInvoke.complete();
			}
			else
				this.replyData(invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}
	}
}