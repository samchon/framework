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

		protected performance: number;

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
		public getSystemArray(): DistributedSystemArray
		{
			return this.system_array_;
		}

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

			// ADD UID FOR ARCHIVING HISTORY
			let uid: number;
			if (invoke.has("_History_uid") == false)
			{
				// ISSUE UID AND ATTACH IT TO INVOKE'S LAST PARAMETER
				uid = this.system_array_._Fetch_history_sequence();
				invoke.push_back(new InvokeParameter("_History_uid", uid));
			}
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- system_array_ IS A TYPE OF DistributedSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A Distributed HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO ANOTHER SLAVE.
				uid = invoke.get("_History_uid").getValue();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				this.system_array_._Set_history_sequence(uid);

				// FOR CASE 2. ERASE ORDINARY PROGRESSIVE HISTORY FROM THE DISCONNECTED
				this.progress_list_.erase(uid);
			}

			// ADD ROLE NAME FOR MEDIATOR
			if (invoke.has("_Role_name") == false)
				invoke.push_back(new InvokeParameter("_Role_name", this.name));

			// FIND THE MOST IDLE SYSTEM
			let idle_system: DistributedSystem = null;

			for (let i: number = 0; i < this.system_array_.size(); i++)
			{
				let system: DistributedSystem = this.system_array_.at(i) as DistributedSystem;

				if (idle_system == null 
					|| system._Get_progress_list().size() < idle_system._Get_progress_list().size()
					|| system.getPerformance() < idle_system.getPerformance())
					idle_system = system;
			}

			// ARCHIVE HISTORY ON PROGRESS_LIST (IN SYSTEM AND ROLE AT THE SAME TIME)
			let history: DSInvokeHistory = new DSInvokeHistory(idle_system, this, invoke);

			this.progress_list_.insert([uid, history]);
			idle_system._Get_progress_list().insert([uid, std.make_pair(invoke, history)]);

			// SEND DATA
			idle_system.sendData(invoke);
		}

		public _Report_history(history: DSInvokeHistory): void
		{
			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this.progress_list_.erase(history.getUID());
			this.history_list_.insert([history.getUID(), history]);

			// ESTIMATE REQUIRED PERFORMANCE OF THIS ROLE
			
		}
	}
}