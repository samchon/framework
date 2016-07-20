/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveSystem
		extends external.ExternalSystem
	{
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		public replyData(invoke: Invoke): void
		{
			if (invoke.has("invoke_history_uid"))
			{
				// INIT HISTORY - WITH START TIME
				let history: InvokeHistory = new InvokeHistory(invoke);
				std.remove_if(invoke.begin(), invoke.end(),
					function (parameter: InvokeParameter): boolean
					{
						return parameter.getName() == "invoke_history_uid";
					}); // DETACH THE UID FOR FUNCTION AUTO-MATCHING

				// MAIN PROCESS - REPLY_DATA
				super.replyData(invoke);

				// NOTIFY - WITH END TIME
				history.notifyEnd();
				this.sendData(history.toInvoke());
			}
			else
				super.replyData(invoke);
		}
	}
}