/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemRole.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemRole
		extends external.ExternalSystemRole
	{
		private system_array_: DistributedSystemArray;

		private progress_list_: std.HashMap<number, DSInvokeHistory>;
		private history_list_: std.HashMap<number, DSInvokeHistory>;

		private performance: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: DistributedSystemArray)
		{
			super(null);

			this.system_array_ = systemArray;

			// PERFORMANCE INDEX
			this.performance = 1.0;
			this.progress_list_ = new std.HashMap<number, DSInvokeHistory>();
			this.history_list_ = new std.HashMap<number, DSInvokeHistory>();
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getPerformance(): number
		{
			return this.performance;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			if (this.system_array_.empty() == true)
				return;

			// ISSUE UID AND ATTACH IT TO INVOKE'S LAST PARAMETER
			let uid: number = ++this.system_array_["history_sequence"];
			invoke.push_back(new InvokeParameter("invoke_history_uid", uid));

			// FIND THE MOST IDLE SYSTEM
			let idle_system: DistributedSystem = null;

			for (let i: number = 0; i < this.system_array_.size(); i++)
			{
				let system: DistributedSystem = this.system_array_.at(i) as DistributedSystem;

				if (idle_system == null || system["progress_list_"].size() < idle_system["progress_list_"].size()
					|| system.getPerformance() < idle_system.getPerformance())
					idle_system = system;
			}

			// ARCHIVE HISTORY ON PROGRESS_LIST (IN SYSTEM AND ROLE AT THE SAME TIME)
			let history: DSInvokeHistory = new DSInvokeHistory(idle_system, this, invoke);
			this.progress_list_.insert([uid, history]);
			idle_system["progress_list_"].insert([uid, history]);

			idle_system.sendData(invoke);
		}

		private report_invoke_history(history: DSInvokeHistory): void
		{
			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this.progress_list_.erase(history.getUID());
			this.history_list_.insert([history.getUID(), history]);

			// ESTIMATE REQUIRED PERFORMANCE OF THIS ROLE
		}
	}
}