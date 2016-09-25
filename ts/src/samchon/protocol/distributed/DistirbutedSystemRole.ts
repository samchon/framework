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

		protected resource: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: DistributedSystemArray)
		{
			super(null);

			this.system_array_ = systemArray;

			// PERFORMANCE INDEX
			this.resource = 1.0;
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

		public getResource(): number
		{
			return this.resource;
		}

		public setResource(val: number): void
		{
			this.resource = val;
		}

		private compute_average_elapsed_time(): number
		{
			let sum: number = 0;
			
			for (let it = this.history_list_.begin(); !it.equal_to(this.history_list_.end()); it = it.next())
			{
				let history: DSInvokeHistory = it.second;

				// THE SYSTEM'S PERFORMANCE IS 5. THE SYSTEM CAN HANDLE A PROCESS VERY QUICKLY
				// AND ELAPSED TIME OF THE PROCESS IS 3 SECONDS
				// THEN I CONSIDER THE ELAPSED TIME AS 15 SECONDS.
				sum += history.computeElapsedTime() * history.getSystem().getPerformance();
			}
			return sum / this.history_list_.size();
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
				uid = ++this.system_array_["history_sequence_"];
				invoke.push_back(new InvokeParameter("_History_uid", uid));
			}
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- system_array_ IS A TYPE OF DistributedSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A Distributed HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO ANOTHER SLAVE.
				uid = invoke.get("_History_uid").getValue();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				this.system_array_["history_sequence_"] = uid;

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
				if (system["exclude_"] == true)
					continue;

				if (idle_system == null 
					|| system["progress_list_"].size() < idle_system["progress_list_"].size()
					|| system.getPerformance() < idle_system.getPerformance())
					idle_system = system;
			}

			// ARCHIVE HISTORY ON PROGRESS_LIST (IN SYSTEM AND ROLE AT THE SAME TIME)
			let history: DSInvokeHistory = new DSInvokeHistory(idle_system, this, invoke);

			this.progress_list_.insert([uid, history]);
			idle_system["progress_list_"].insert([uid, std.make_pair(invoke, history)]);

			// SEND DATA
			idle_system.sendData(invoke);
		}

		private complete_history(history: DSInvokeHistory): void
		{
			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this.progress_list_.erase(history.getUID());
			this.history_list_.insert([history.getUID(), history]);

			////--------
			//// ESTIMATE PERFORMANCE OF THIS ROLE
			////--------
			//let role_map: std.HashMap<string, DistributedSystemRole> = this.system_array_.getRoleMap();
			//let average_elapsed_time_of_others: number = 0;
			//let denominator: number = 0;

			//// COMPUTE AVERAGE ELAPSED TIME OF OTHER ROLES
			//for (let it = role_map.begin(); !it.equal_to(role_map.end()); it = it.next())
			//{
			//	let role: DistributedSystemRole = it.second;
			//	if (this == role || role.history_list_.empty() == true)
			//		continue;

			//	average_elapsed_time_of_others += role._Compute_average_elapsed_time() * role.performance;
			//	denominator++;
			//}

			//// COMPARE WITH THIS HISTORY'S ELAPSED TIME
			//if (denominator != 0)
			//{
			//	average_elapsed_time_of_others /= denominator; // DIVE WITH DENOMINATOR

			//	// DEDUCT NEW PERFORMANCE INDEX BASED ON THE EXECUTION TIME
			//	//	- ROLE'S PERFORMANCE MEANS; HOW MUCH TIME THE ROLE NEEDS
			//	//	- ELAPSED TIME IS LONGER, THEN PERFORMANCE IS HIGHER
			//	let new_performance: number = history.computeElapsedTime() / average_elapsed_time_of_others;

			//	// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 15%
			//	let ordinary_ratio: number;
			//	if (this.history_list_.size() < 2)
			//		ordinary_ratio = .15;
			//	else
			//		ordinary_ratio = Math.min(0.85, 1.0 / (this.history_list_.size() - 1.0));

			//	// DEFINE NEW PERFORMANCE
			//	this.performance = (this.performance * ordinary_ratio) 
			//		+ (new_performance * (1 - ordinary_ratio));
			//}
		}
	}
}