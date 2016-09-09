/// <reference path="../../API.ts" />

/// <reference path="../parallel/ParallelSystem.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystem
		extends parallel.ParallelSystem
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: DistributedSystemArray);

		public constructor(systemArray: DistributedSystemArray, driver: IClientDriver);

		public constructor(systemArray: DistributedSystemArray, driver: IClientDriver = null)
		{
			super(systemArray, driver);

			let roles: std.HashMap<string, DistributedSystemRole> = systemArray.getRoleMap();
			for (let it = roles.begin(); !it.equal_to(roles.end()); it = it.next())
				this.push_back(it.second);
		}

		public destructor(): void
		{
			// SHIFT PARALLEL INVOKE MESSAGES HAD PROGRESSED TO OTHER SLAVES
			super.destructor();

			for (let it = this["progress_list_"].begin(); !it.equal_to(this["progress_list_"].end()); it = it.next())
			{
				// A HISTORY HAD PROGRESSED
				let history: DSInvokeHistory = it.second.second as DSInvokeHistory;
				if (history instanceof DSInvokeHistory == false)
					continue;

				// INVOKE MESSAGE TO RESEND TO ANOTHER SLAVE VIA ROLE
				let invoke: Invoke = it.second.first;
				let role: DistributedSystemRole = history.getRole();

				// SEND-DATA VIA ROLE
				role.sendData(invoke);
			}
		}

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			// FETCH ALL DistributedSystemRole OBJECTS FROM THE DistributedSystemArray.getRoleMap()
			let role_map: std.HashMap<string, DistributedSystemRole> = this.getSystemArray().getRoleMap();
			
			for (let it = role_map.begin(); !it.equal_to(role_map.end()); it = it.next())
				this.push_back(it.second);
		}

		public createChild(xml: library.XML): external.ExternalSystemRole
		{
			return null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get manager of this object.
		 *
		 * @return A manager containing this {@link DistributedSystem} objects.
		 */
		public getSystemArray(): DistributedSystemArray
		{
			return super.getSystemArray() as DistributedSystemArray;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		protected _Report_history(xml: library.XML): void
		{
			if (xml.hasProperty("piece_first") == true)
			{
				//--------
				// ParallelSystem's history -> PRInvokeHistory
				//--------
				super._Report_history(xml);
			}
			else
			{
				//--------
				// DistributedSystemRole's history -> DSInvokeHistory
				//--------
				// CONSTRUCT HISTORY
				let history: DSInvokeHistory = new DSInvokeHistory(this);
				history.construct(xml);

				// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
				this["progress_list_"].erase(history.getUID());
				this["history_list_"].insert([history.getUID(), history]);

				// ALSO NOTIFY TO THE ROLE
				if (history.getRole() != null)
					history.getRole()["report_invoke_history"](history);

				// IF SYSTEM_ARRAY IS A TYPE OF DistributedSystemArrayMediator, 
				// THEN ALSO NOTIFY TO ITS MASTER
				let mediator: parallel.MediatorSystem = (this.getSystemArray() as DistributedSystemArrayMediator)["mediator_"];
				mediator["notify_end"](history.getUID()); // NOTIFY END TO MASTER
			}
		}
	}
}