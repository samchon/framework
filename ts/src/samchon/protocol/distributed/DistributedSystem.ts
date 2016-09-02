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

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			let roles: std.HashMap<string, DistributedSystemRole> = this.getSystemArray().getRoleMap();
			for (let it = roles.begin(); !it.equal_to(roles.end()); it = it.next())
				this.push_back(it.second);
		}

		public createChild(xml: library.XML): DistributedSystemRole
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
		protected report_invoke_history(xml: library.XML): void
		{
			if (xml.hasProperty("piece_first") == true)
			{
				// ParallelSystem's history -> PRInvokeHistory
				super.report_invoke_history(xml);
			}
			else
			{
				// DistributedSystemRole's history -> DSInvokeHistory
				// CONSTRUCT HISTORY
				let history: DSInvokeHistory = new DSInvokeHistory(this);
				history.construct(xml);

				// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
				this.progress_list_.erase(history.getUID());
				this.history_list_.insert([history.getUID(), history]);

				// ALSO NOTIFY TO THE ROLE
				if (history.getRole() != null)
					history.getRole()["report_invoke_history"](history);
			}
		}
	}
}