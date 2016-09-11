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

		public destructor(): void
		{
			super.destructor();

			// SHIFT INVOKE MESSAGES HAD PROGRESSED TO OTHER SLAVE
			for (let it = this._Get_progress_list().begin(); !it.equal_to(this._Get_progress_list().end()); it = it.next())
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
		
		protected _Report_history(xml: library.XML): void
		{
			if (xml.hasProperty("_Piece_first") == true)
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

				// IF THE HISTORY IS NOT EXIST IN PROGRESS, THEN TERMINATE REPORTING
				let progress_it = this._Get_progress_list().find(history.getUID());
				if (progress_it.equal_to(this._Get_progress_list().end()) == true)
					return;

				// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
				this._Get_progress_list().erase(progress_it);
				this._Get_history_list().insert([history.getUID(), history]);

				// ALSO NOTIFY TO THE ROLE
				if (history.getRole() != null)
					history.getRole()._Report_history(history);

				// IF SYSTEM_ARRAY IS A TYPE OF DistributedSystemArrayMediator, 
				// THEN ALSO NOTIFY TO ITS MASTER
				let system_array_mediator: DistributedSystemArrayMediator = this.getSystemArray() as DistributedSystemArrayMediator;
				if (system_array_mediator instanceof DistributedSystemArrayMediator)
				{
					let mediator: parallel.MediatorSystem = system_array_mediator.getMediator();
					mediator._Complete_history(history.getUID()); // NOTIFY END TO MASTER
				}
			}
		}
	}
}