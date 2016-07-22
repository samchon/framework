/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelSystem 
		extends external.ExternalSystem
	{
		private systemArray: ParallelSystemArray;

		private progress_list: std.HashMap<number, PRInvokeHistory>;
		private history_list: std.HashMap<number, PRInvokeHistory>;

		private performance: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArray)
		{
			super();

			this.systemArray = systemArray;
			this.performance = 1.0;

			this.progress_list = new std.HashMap<number, PRInvokeHistory>();
			this.history_list = new std.HashMap<number, PRInvokeHistory>();
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get parent {@link systemArray}.
		 */
		public getSystemArray(): ParallelSystemArray
		{
			return this.systemArray;
		}

		/**
		 * Get {@link performant performance index}.
		 */
		public getPerformance(): number
		{
			return this.performance;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		private send_piece_data(invoke: Invoke, index: number, size: number): void
		{
			// DUPLICATE INVOKE AND ATTACH PIECE INFO
			let my_invoke: Invoke = new Invoke(invoke.getListener());
			{
				my_invoke.assign(invoke.begin(), invoke.end());
				my_invoke.push_back(new InvokeParameter("index", index));
				my_invoke.push_back(new InvokeParameter("size", size));
			}

			// REGISTER THE UID AS PROGRESS
			let history: PRInvokeHistory = new PRInvokeHistory(my_invoke);
			this.progress_list.insert([history.getUID(), history]);

			// SEND DATA
			this.sendData(invoke);
		}

		private report_invoke_history(xml: library.XML): void
		{
			///////
			// CONSTRUCT HISTORY
			///////
			let history: PRInvokeHistory = new PRInvokeHistory();
			history.construct(xml);

			let progress_it = this.progress_list.find(history.getUID());
			history["index"] = progress_it.second.getIndex();
			history["size"] = progress_it.second.getSize();

			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this.progress_list.erase(progress_it);
			this.history_list.insert([history.getUID(), history]);

			// NOTIFY TO THE MANAGER, SYSTEM_ARRAY
			this.systemArray["notify_end"](history);
		}
	}
}