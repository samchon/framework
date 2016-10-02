/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveSystem
		implements protocol.IProtocol
	{
		/**
		 * @hidden
		 */
		protected communicator_: ICommunicator;

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
		public sendData(invoke: Invoke): void
		{
			this.communicator_.sendData(invoke);
		}

		/**
		 * @hidden
		 */
		protected _replyData(invoke: Invoke): void
		{
			// INTERCEPT INVOKE MESSAGE
			if (invoke.has("_History_uid"))
			{
				// INIT HISTORY - WITH START TIME
				let history: InvokeHistory = new InvokeHistory(invoke);
				std.remove_if
				(
					invoke.begin(), invoke.end(),
					function (parameter: InvokeParameter): boolean
					{
						return parameter.getName() == "_History_uid" 
							|| parameter.getName() == "_Role_name";
					}
				); // DETACH THE UID FOR FUNCTION AUTO-MATCHING

				// MAIN PROCESS - REPLY_DATA
				this.replyData(invoke);

				// NOTIFY - WITH END TIME
				history.complete();
				this.sendData(history.toInvoke());
			}
			else
				this.replyData(invoke);
		}

		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);
		}
	}
}