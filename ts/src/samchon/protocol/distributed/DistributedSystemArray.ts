/// <reference path="../../API.ts" />

/// <reference path="../parallel/ParallelSystemArray.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedSystemArray extends parallel.ParallelSystemArray
	{
		/**
		 * @hidden
		 */
		private role_map_: std.HashMap<string, DistributedSystemRole>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			// CREATE ROLE MAP AND ENROLL COLLECTION EVENT LISTENRES
			this.role_map_ = new std.HashMap<string, DistributedSystemRole>();
		}

		/**
		 * @inheritdoc
		 */
		public construct(xml: library.XML): void
		{
			//--------
			// CONSTRUCT ROLES
			//--------
			// CLEAR ORDINARY ROLES
			this.role_map_.clear();

			// CREATE ROLES
			if (xml.has("roles") == true && xml.get("roles").front().has("role") == true)
			{
				let role_xml_list: library.XMLList = xml.get("roles").front().get("role");
				for (let i: number = 0; i < role_xml_list.size(); i++)
				{
					let role_xml: library.XML = role_xml_list.at(i);

					// CONSTRUCT ROLE FROM XML
					let role: DistributedSystemRole = this.createRole(role_xml);
					role.construct(role_xml);

					// AND INSERT TO ROLE_MAP
					this.role_map_.insert([role.getName(), role]);
				}
			}

			//--------
			// CONSTRUCT SYSTEMS
			//--------
			super.construct(xml);
		}

		/**
		 * Factory method creating a child {@link DistributedSystemRole role} object.
		 * 
		 * @param xml {@link XML} represents the {@link DistributedSystemRole child} object.
		 * @return A new {@link DistributedSystemRole} object.
		 */
		protected abstract createRole(xml: library.XML): DistributedSystemRole;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public at(index: number): DistributedSystem
		{
			return super.at(index) as DistributedSystem;
		}

		public getRoleMap(): std.HashMap<string, DistributedSystemRole>
		{
			return this.role_map_;
		}

		/**
		 * @inheritdoc
		 */
		public hasRole(name: string): boolean
		{
			return this.role_map_.has(name);
		}

		/**
		 * @inheritdoc
		 */
		public getRole(name: string): DistributedSystemRole
		{
			return this.role_map_.get(name);
		}

		public insertRole(role: DistributedSystemRole): void
		{
			this.role_map_.insert([role.getName(), role]);
		}

		public eraseRole(name: string): void
		{
			this.role_map_.erase(name);
		}

		/* ---------------------------------------------------------
			HISTORY HANDLER - PERFORMANCE ESTIMATION
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Complete_history(history: InvokeHistory): boolean
		{
			if (history instanceof DSInvokeHistory)
			{
				//--------
				// DistributedSystemRole's history -> DSInvokeHistory
				//--------
				// NO ROLE, THEN FAILED TO COMPLETE
				if (history.getRole() == null)
					return false;

				// ESTIMATE PERFORMANCE INDEXES
				this.estimate_system_performance(history); // ESTIMATE SYSTEMS' INDEX
				this.estimate_role_performance(history); // ESTIMATE ROLE' INDEX

				// AT LAST, NORMALIZE PERFORMANCE INDEXES OF ALL SYSTEMS AND ROLES
				this._Normalize_performance();
				return true;
			}
			else
			{
				// ParallelSystem's history -> PRInvokeHistory
				return super._Complete_history(history);
			}
		}

		/**
		 * @hidden
		 */
		private estimate_role_performance(history: DSInvokeHistory): void
		{
			let role: DistributedSystemRole = history.getRole();
			if (role["enforced_"] == true)
				return; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

			let average_elapsed_time_of_others: number = 0;
			let denominator: number = 0;

			// COMPUTE AVERAGE ELAPSED TIME
			for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
			{
				let my_role: DistributedSystemRole = it.second;
				if (my_role == history.getRole() || my_role["history_list_"].empty() == true)
					continue;

				average_elapsed_time_of_others += my_role["compute_average_elapsed_time"]() * my_role.getResource();
				denominator++;
			}

			// COMPARE WITH THIS HISTORY'S ELAPSED TIME
			if (denominator != 0)
			{
				// DIVE WITH DENOMINATOR
				average_elapsed_time_of_others /= denominator;

				// DEDUCT NEW PERFORMANCE INDEX BASED ON THE EXECUTION TIME
				//	- ROLE'S PERFORMANCE MEANS; HOW MUCH TIME THE ROLE NEEDS
				//	- ELAPSED TIME IS LONGER, THEN PERFORMANCE IS HIGHER
				let new_performance: number = history.computeElapsedTime() / average_elapsed_time_of_others;

				// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 15%
				let ordinary_ratio: number;
				if (role["history_list_"].size() < 2)
					ordinary_ratio = .15;
				else
					ordinary_ratio = Math.min(.85, 1.0 / (role["history_list_"].size() - 1.0));

				// DEFINE NEW PERFORMANCE
				role.setResource
				(
					(role.getResource() * ordinary_ratio) 
					+ (new_performance * (1 - ordinary_ratio))
				);
			}
		}

		/**
		 * @hidden
		 */
		private estimate_system_performance(history: DSInvokeHistory): void
		{
			let system: DistributedSystem = history.getSystem();
			if (system["enforced_"] == true)
				return; // THE PERFORMANCE INDEX IS ENFORCED. IT DOESN'T PERMIT REVALUATION

			let average_elapsed_time_of_others: number = 0;
			let denominator: number = 0;

			// COMPUTE AVERAGE ELAPSED TIME
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: DistributedSystem = this.at(i);

				let avg: number = system["compute_average_elapsed_time"]();
				if (avg == -1)
					continue;

				average_elapsed_time_of_others += avg;
				denominator++;
			}
			
			// COMPARE WITH THIS HISTORY'S ELAPSED TIME
			if (denominator != 0)
			{
				// DIVE WITH DENOMINATOR
				average_elapsed_time_of_others /= denominator;

				// DEDUCT NEW PERFORMANCE INDEX BASED ON THE EXECUTION TIME
				//	- SYSTEM'S PERFORMANCE MEANS; HOW FAST THE SYSTEM IS
				//	- ELAPSED TIME IS LOWER, THEN PERFORMANCE IS HIGHER
				let new_performance: number = average_elapsed_time_of_others / history.computeElapsedTime();

				// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 30%
				let ordinary_ratio: number;
				if (system["history_list_"].size() < 2)
					ordinary_ratio = .3;
				else
					ordinary_ratio = Math.min(0.7, 1.0 / (system["history_list_"].size() - 1.0));

				// DEFINE NEW PERFORMANCE
				system.setPerformance
				(
					(system.getPerformance() * ordinary_ratio)
					+ (new_performance * (1 - ordinary_ratio))
				);
			}
		}

		/**
		 * @hidden
		 */
		protected _Normalize_performance(): void
		{
			// NORMALIZE SYSTEMS' PERFORMANCE INDEXES
			super._Normalize_performance();

			// COMPUTE AVERAGE
			let average: number = 0.0;
			let denominator: number = 0;

			for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
			{
				let role: DistributedSystemRole = it.second;
				if (role["enforced_"] == true)
					continue; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

				average += role.getResource();
				denominator++;
			}
			average /= this.role_map_.size();

			// DIVIDE FROM THE AVERAGE
			for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
			{
				let role: DistributedSystemRole = it.second;
				if (role["enforced_"] == true)
					continue; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

				role.setResource(role.getResource() / average);
			}
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = super.toXML();
			if (this.role_map_.empty() == true)
				return xml;

			let roles_xml: library.XML = new library.XML();
			{
				roles_xml.setTag("roles");
				for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
					roles_xml.push(it.second.toXML());
			}
			xml.push(roles_xml);
			return xml;
		}
	}
}