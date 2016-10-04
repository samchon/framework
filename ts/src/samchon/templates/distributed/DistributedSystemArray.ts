/// <reference path="../../API.ts" />

/// <reference path="../parallel/ParallelSystemArray.ts" />

/**
 * A template for Distributed Processing System.
 * 
 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
 * @author Jeongho Nam <http://samchon.org>
 */
namespace samchon.templates.distributed
{
	/**
	 * Master of Distributed Processing System.
	 * 
	 * The {@link DistributedSystemArray} is an abstract class containing and managing remote distributed **slave** system
	 * drivers, {@link DistributedSystem} objects. Within framework of network, {@link DistributedSystemArray} represents
	 * your system, a **Master** of *Distributed Processing System* that requesting *distributed process* to **slave**
	 * systems and the children {@link DistributedSystem} objects represent the remote **slave** systems, who is being
	 * requested the *distributed processes*.
	 *
	 * You can specify this {@link DistributedSystemArray} class to be *a server accepting distributed clients* or
	 * *a client connecting to distributed servers*. Even both of them is possible. Extends one of them below and overrides
	 * abstract factory method(s) creating the child {@link DistributedSystem} object.
	 *
	 * - {@link DistributedClientArray}: A server accepting {@link DistributedSystem distributed clients}.
	 * - {@link DistributedServerArray}: A client connecting to {@link DistributedServer distributed servers}.
	 * - {@link DistributedServerClientArray}: Both of them. Accepts {@link DistributedSystem distributed clients} and 
	 *                                         connects to {@link DistributedServer distributed servers} at the same time.
	 * 
	 * The {@link DistributedSystemArray} contains {@link DistributedProcess} objects directly. You can request a
	 * **distributed process** through the {@link DistributedProcess} object. You can access the
	 * {@link DistributedProcess} object(s) with those methods:
	 *
	 * - {@link hasRole}
	 * - {@link getRole}
	 * - {@link insertRole}
	 * - {@link eraseRole}
	 * - {@link getRoleMap}
	 *
	 * When you need the **distributed process**, call the {@link DistributedProcess.sendData} method. Then the
	 * {@link DistributedProcess} will find the most idle {@link DistributedSystem} object who represents a distributed
	 * **slave **system. The {@link Invoke} message will be sent to the most idle {@link DistributedSystem} object. When
	 * the **distributed process** has completed, then {@link DistributedSystem.getPerformance performance index} and
	 * {@link DistributedProcess.getResource resource index} of related objects will be revaluated.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * #### Parallel Process
	 * This {@link DistributedSystemArray} class is derived from the {@link ParallelSystemArray} class, so you can request
	 * a **parallel process**, too.
	 *
	 * When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	 * When the **parallel process** has completed, {@link DistributedSystemArray} estimates each
	 * {@link DistributedSystem}'s {@link DistributedSystem.getPerformance performance index} basis on their execution
	 * time. Those performance indices will be reflected to the next **parallel process**, how much pieces to allocate to
	 * each {@link DistributedSystem}.
	 * 
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DistributedSystemArray 
		extends parallel.ParallelSystemArray
	{
		/**
		 * @hidden
		 */
		private role_map_: std.HashMap<string, DistributedProcess>;

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
			this.role_map_ = new std.HashMap<string, DistributedProcess>();
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
			if (xml.has("processes") == true && xml.get("processes").front().has("process") == true)
			{
				let role_xml_list: library.XMLList = xml.get("processes").front().get("process");
				for (let i: number = 0; i < role_xml_list.size(); i++)
				{
					let role_xml: library.XML = role_xml_list.at(i);

					// CONSTRUCT ROLE FROM XML
					let process: DistributedProcess = this.createProcess(role_xml);
					process.construct(role_xml);

					// AND INSERT TO ROLE_MAP
					this.role_map_.insert([process.getName(), process]);
				}
			}

			//--------
			// CONSTRUCT SYSTEMS
			//--------
			super.construct(xml);
		}

		/**
		 * Factory method creating a child {@link DistributedProcess process} object.
		 * 
		 * @param xml {@link XML} represents the {@link DistributedProcess child} object.
		 * @return A new {@link DistributedProcess} object.
		 */
		protected abstract createProcess(xml: library.XML): DistributedProcess;

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

		/**
		 * Get process map. 
		 * 
		 * Gets an {@link HashMap} containing {@link DistributedProcess} objects with their *key*.
		 * 
		 * @return An {@link HasmMap> containing pairs of string and {@link DistributedProcess} object.
		 */
		public getProcessMap(): std.HashMap<string, DistributedProcess>
		{
			return this.role_map_;
		}

		/**
		 * Test whether the process exists.
		 * 
		 * @param name Name, identifier of target {@link DistributedProcess process}.
		 * 
		 * @return Whether the process has or not.
		 */
		public hasProcess(name: string): boolean
		{
			return this.role_map_.has(name);
		}

		/**
		 * Get a process.
		 * 
		 * @param name Name, identifier of target {@link DistributedProcess process}.
		 * 
		 * @return The specified process.
		 */
		public getProcess(name: string): DistributedProcess
		{
			return this.role_map_.get(name);
		}

		/**
		 * Insert a process.
		 * 
		 * @param process A process to be inserted.
		 * @return Success flag.
		 */
		public insertProcess(process: DistributedProcess): boolean
		{
			return this.role_map_.insert([process.getName(), process]).second;
		}

		/**
		 * Erase a process.
		 * 
		 * @param name Name, identifier of target {@link DistributedProcess process}.
		 */
		public eraseProcess(name: string): boolean
		{
			let prev_size: number = this.role_map_.size();
			
			return (this.role_map_.erase(name) != prev_size);
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
				// DistributedProcess's history -> DSInvokeHistory
				//--------
				// NO ROLE, THEN FAILED TO COMPLETE
				if (history.getProcess() == null)
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
			let process: DistributedProcess = history.getProcess();
			if (process["enforced_"] == true)
				return; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

			let average_elapsed_time_of_others: number = 0;
			let denominator: number = 0;

			// COMPUTE AVERAGE ELAPSED TIME
			for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
			{
				let my_role: DistributedProcess = it.second;
				if (my_role == history.getProcess() || my_role["history_list_"].empty() == true)
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
				if (process["history_list_"].size() < 2)
					ordinary_ratio = .15;
				else
					ordinary_ratio = Math.min(.85, 1.0 / (process["history_list_"].size() - 1.0));

				// DEFINE NEW PERFORMANCE
				process.setResource
				(
					(process.getResource() * ordinary_ratio) 
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
				let process: DistributedProcess = it.second;
				if (process["enforced_"] == true)
					continue; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

				average += process.getResource();
				denominator++;
			}
			average /= this.role_map_.size();

			// DIVIDE FROM THE AVERAGE
			for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
			{
				let process: DistributedProcess = it.second;
				if (process["enforced_"] == true)
					continue; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

				process.setResource(process.getResource() / average);
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
				roles_xml.setTag("processes");
				for (let it = this.role_map_.begin(); !it.equal_to(this.role_map_.end()); it = it.next())
					roles_xml.push(it.second.toXML());
			}
			xml.push(roles_xml);
			return xml;
		}
	}
}