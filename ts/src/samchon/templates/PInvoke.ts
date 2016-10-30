/// <reference path="../API.ts" />

/// <reference path="../protocol/Invoke.ts" />

namespace samchon.templates
{
	export class PInvoke extends protocol.Invoke
	{
		/**
		 * @hidden
		 */
		private history_: InvokeHistory;

		/**
		 * @hidden
		 */
		private master_driver_: protocol.IProtocol;

		/**
		 * @hidden
		 */
		private hold_: boolean;

		public constructor(invoke: protocol.Invoke, history: InvokeHistory, masterDriver: protocol.IProtocol)
		{
			super(invoke.getListener());
			this.assign(invoke.begin(), invoke.end());

			this.history_ = history;
			this.master_driver_ = masterDriver;
			this.hold_ = false;
		}

		public getHistory(): InvokeHistory
		{
			return this.history_;
		}
		public isHold(): boolean
		{
			return this.hold_;
		}

		/**
		 * Hold reporting completion to master. 
		 */
		public hold(): void
		{
			this.hold_ = true;
		}

		/**
		 * Report completion.
		 */
		public complete(): void
		{
			this.history_.complete();

			this.master_driver_.sendData(this.history_.toInvoke());
		}
	}
}