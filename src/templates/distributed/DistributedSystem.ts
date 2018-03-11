/// <reference path="../../API.ts" />

/// <reference path="../parallel/ParallelSystem.ts" />

namespace samchon.templates.distributed
{
	/**
	 * A driver for a distributed slave system.
	 * 
	 * The {@link DistributedSystem} is an abstract class represents a **slave** system in *Distributed Processing System*,
	 * connected with this **master** system. This {@link DistributedSystem} takes full charge of network communication 
	 * with the remote, distributed **slave** system has connected.
	 * 
	 * This {@link DistributedSystem} has a {@link getPerformance performance index} that indicates how much the **slave** 
	 * system is fast. The {@link getPerformance performance index} is referenced and revaluated whenever those methods 
	 * are called:
	 * 
	 * - Requesting a *parallel process*
	 *   - {@link DistributedSystemArray.sendSegmentData}
	 *   - {@link DistributedSystemArray.sendPieceData}
	 * - Requesting a *distributed process*: {@link DistributedProcess.sendData}
	 * 
	 * Note that, this {@link DistributedSystem} class derived from the {@link ExternalSystem} class. Thus, this 
	 * {@link DistributedSystem} can also have children {@link ExternalSystemRole} objects exclusively. However, the 
	 * children {@link ExternalSystemRole roles} objects are different with the {@link DistributedProcess}. The 
	 * domestic {@link ExternalSystemRole roles} are belonged to only a specific {@link DistributedSystem} object. 
	 * Otherwise, the {@link DistributedProcess} objects are belonged to a {@link DistributedSystemArray} object. 
	 * Furthermore, the relationship between this {@link DistributedSystem} and {@link DistributedProcess} classes are 
	 * **M: N Associative**.
	 * 
	 * Articles     | {@link DistributedProcess}     | {@link ExternalSystemRole}
	 * -------------|--------------------------------|----------------------------
	 * Belonged to  | {@link DistributedSystemArray} | {@link DistributedSystem}
	 * Relationship | M: N Associative               | 1: N Composite
	 * Ownership    | References                     | Exclusive possession
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DistributedSystem
		extends parallel.ParallelSystem
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link DistributedSystemArray}.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArray} object.
		 */
		public constructor(systemArray: DistributedSystemArray<DistributedSystem>);

		/**
		 * Constrct from parent {@link DistributedSystemArray} and communicator.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArray} object.
		 * @param communicator A communicator communicates with remote, the external system.
		 */
		public constructor(systemArray: DistributedSystemArray<DistributedSystem>, communicator: protocol.IClientDriver);

		public constructor(systemArray: DistributedSystemArray<DistributedSystem>, communicator: protocol.IClientDriver = null)
		{
			super(systemArray, communicator);
		}

		// using super::destructor

		/**
		 * Factory method creating a {@link ExternalSystemRole child} object.
		 * 
		 * In {@link distributed} module, the process class {@link DistributedProcess} is not belonged to a specific 
		 * {@link DistributedSystem} object. It only belongs to a {@link DistributedSystemArray} object and has a 
		 * **M: N Associative Relationship** between this {@link DistributedSystem} class.
		 * 
		 * By that reason, it's the normal case that the {@link DistributedSystem} object does not have any children 
		 * {@link ExternalSystemRole} object. Thus, default {@link createChild} returns ```null```.
		 * 
		 * However, if you want a {@link DistributedSystem} to have its own domestic {@link ExternalSystemRole} objects
		 * without reference to the {@link DistributedProcess} objects, it is possible. Creates and returns the 
		 * domestic {@link ExternalSystemRole} object.
		 * 
		 * @param xml {@link XML} represents the {@link ExternalSystemRole child} object.
		 * @return A newly created {@link ExternalSystemRole} object or ```null```.
		 */
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
		 * @return The parent {@link DistributedSystemArray} object.
		 */
		public getSystemArray(): DistributedSystemArray<DistributedSystem>;

		/**
		 * Get manager of this object.
		 * 
		 * @return The parent {@link DistributedSystemArray} object.
		 */
		public getSystemArray<SystemArray extends DistributedSystemArray<DistributedSystem>>(): SystemArray;

		public getSystemArray(): DistributedSystemArray<DistributedSystem>
		{
			return this["system_array_"] as DistributedSystemArray<DistributedSystem>;
		}

		/**
		 * @hidden
		 */
		private _Compute_average_elapsed_time(): number
		{
			let sum: number = 0;
			let denominator: number = 0;

			for (let it = this["history_list_"].begin(); !it.equals(this["history_list_"].end()); it = it.next())
			{
				let history: DSInvokeHistory = it.second as DSInvokeHistory;
				if (history instanceof DSInvokeHistory == false)
					continue;

				let elapsed_time: number = history.computeElapsedTime() / history.getWeight();

				sum += elapsed_time / history.getProcess().getResource();
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
		/**
		 * @inheritdoc
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			// SHIFT TO ROLES
			let role_map = this.getSystemArray().getProcessMap();
			for (let it = role_map.begin(); !it.equals(role_map.end()); it = it.next())
				it.second.replyData(invoke);

			// SHIFT TO PARENT AND CHIILDREN, EXCLUSIVE ROLES
			super.replyData(invoke);
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
			// DistributedProcess's history -> DSInvokeHistory
			//--------
			// CONSTRUCT HISTORY
			let history: DSInvokeHistory = new DSInvokeHistory(this);
			history.construct(xml);

			// IF THE HISTORY HAS NOT EXISTED IN PROGRESS, THEN TERMINATE REPORTING
			let progress_it = this["progress_list_"].find(history.getUID());
			if (progress_it.equals(this["progress_list_"].end()) == true)
				return;

			history["process_"] = (progress_it.second.second as DSInvokeHistory).getProcess();
			history["weight_"] = (progress_it.second.second as DSInvokeHistory).getWeight();

			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this["progress_list_"].erase(progress_it);
			this["history_list_"].emplace(history.getUID(), history);

			// REPORT TO THE ROLE
			if (history.getProcess() != null)
				history.getProcess()["_Complete_history"](history);
				
			// COMPLETE THE HISTORY IN THE BELONGED SYSTEM_ARRAY
			this.getSystemArray()["_Complete_history"](history);
		}

		/**
		 * @hidden
		 */
		protected _Send_back_history(invoke: protocol.Invoke, history: slave.InvokeHistory): void
		{
			if (history instanceof DSInvokeHistory)
			{
				// RE-SEND INVOKE MESSAGE TO ANOTHER SLAVE VIA ROLE
				history.getProcess().sendData(invoke, history.getWeight());
			}
			
			// ERASE THE HISTORY
			super._Send_back_history(invoke, history);
		}
	}
}