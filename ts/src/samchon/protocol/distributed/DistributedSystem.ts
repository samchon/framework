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
		// using super::constructor

		// using super::destructor

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
		
		/**
		 * @inheritdoc
		 */
		public has(key: string): boolean
		{
			return this.getSystemArray().hasRole(key);
		}

		/**
		 * @inheritdoc
		 */
		public get(key: string): DistributedSystemRole
		{
			return this.getSystemArray().getRole(key);
		}

		private compute_average_elapsed_time(): number
		{
			let sum: number = 0;
			let denominator: number = 0;

			for (let it = this["history_list_"].begin(); !it.equal_to(this["history_list_"].end()); it = it.next())
			{
				let history: DSInvokeHistory = it.second as DSInvokeHistory;
				if (history instanceof parallel.PRInvokeHistory)
					continue;

				sum += history.computeElapsedTime() / history.getRole().getResource();
				denominator++;
			}

			if (denominator == 0)
				return -1;
			else
				return sum / denominator;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == true)
				return;

			// SHIFT TO SYSTEM_ARRAY
			this.getSystemArray().replyData(invoke);

			// SHIFT TO ROLES
			let role_map = this.getSystemArray().getRoleMap();
			for (let it = role_map.begin(); !it.equal_to(role_map.end()); it = it.next())
				it.second.replyData(invoke);
		}
		
		/**
		 * @hidden
		 */
		protected _Report_history(xml: library.XML): void
		{
			// ParallelSystem's history -> PRInvokeHistory
			if (xml.hasProperty("_Piece_first") == true)
				return super._Report_history(xml);

			//--------
			// DistributedSystemRole's history -> DSInvokeHistory
			//--------
			// CONSTRUCT HISTORY
			let history: DSInvokeHistory = new DSInvokeHistory(this);
			history.construct(xml);

			// IF THE HISTORY HAS NOT EXISTED IN PROGRESS, THEN TERMINATE REPORTING
			let progress_it = this["progress_list_"].find(history.getUID());
			if (progress_it.equal_to(this["progress_list_"].end()) == true)
				return;

			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this["progress_list_"].erase(progress_it);
			this["history_list_"].insert([history.getUID(), history]);

			// REPORT TO THE ROLE
			if (history.getRole() != null)
				history.getRole()["complete_history"](history);
				
			// COMPLETE THE HISTORY IN THE BELONGED SYSTEM_ARRAY
			this.getSystemArray()["_Complete_history"](history);
		}

		/**
		 * @hidden
		 */
		protected _Send_back_history(invoke: Invoke, history: InvokeHistory): void
		{
			if (history instanceof DSInvokeHistory)
			{
				// RE-SEND INVOKE MESSAGE TO ANOTHER SLAVE VIA ROLE
				history.getRole().sendData(invoke);
			}
			else
				super._Send_back_history(invoke, history);
		}
	}
}