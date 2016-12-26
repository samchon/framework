/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.templates.parallel
{
	/**
	 * A mediator, the master driver.
	 * 
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave** 
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 * 
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which  
	 * type and protocol the **master** system follows:
	 * 
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorDedicatedWorkerServer}
	 *   - {@link MediatorSharedWorkerServer}
	 * 
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the 
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The 
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the 
	 * result to its **master**.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		/**
		 * @hidden
		 */
		private system_array_: ParallelSystemArrayMediator<ParallelSystem> | distributed.DistributedSystemArrayMediator<distributed.DistributedSystem>;
		
		/**
		 * @hidden
		 */
		private progress_list_: std.HashMap<number, slave.InvokeHistory>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ParallelSystemArrayMediator} object.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArrayMediator} object.
		 */
		public constructor(systemArray: ParallelSystemArrayMediator<ParallelSystem>);

		/**
		 * Construct from parent {@link DistributedSystemArrayMediator} object.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArrayMediator} object.
		 */
		public constructor(systemArray: distributed.DistributedSystemArrayMediator<distributed.DistributedSystem>)
		
		public constructor(systemArray: ParallelSystemArrayMediator<ParallelSystem> | distributed.DistributedSystemArrayMediator<distributed.DistributedSystem>)
		{
			super();

			this.system_array_ = systemArray;
			this.progress_list_ = new std.HashMap<number, slave.InvokeHistory>();
		}

		/**
		 * Start interaction.
		 * 
		 * The {@link start start()} is an abstract method starting interaction with the **master** system. If the 
		 * **master** is a server, then connects to the **master**. Otherwise, the **master** is client, then this 
		 * {@link MediatorSystem} object wil open a server accepting the **master**.
		 */
		public abstract start(): void;
		
		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		/**
		 * Get parent {@link ParallelSystemArrayMediator} or {@link DistributedSystemArrayMediator} object.
		 */
		public getSystemArray(): 
			ParallelSystemArrayMediator<ParallelSystem> | 
			distributed.DistributedSystemArrayMediator<distributed.DistributedSystem>;

		/**
		 * Get parent {@link ParallelSystemArrayMediator} object.
		 */
		public getSystemArray<SystemArray extends ParallelSystemArray<ParallelSystem>>(): SystemArray;

		/**
		 * Get parent {@link DistributedSystemArrayMediator} object.
		 */
		public getSystemArray<SystemArray extends distributed.DistributedSystemArray<distributed.DistributedSystem>>(): SystemArray;
		
		public getSystemArray(): 
			ParallelSystemArrayMediator<ParallelSystem> | 
			distributed.DistributedSystemArrayMediator<distributed.DistributedSystem>
		{
			return this.system_array_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private _Complete_history(uid: number): void
		{
			// NO SUCH HISTORY; THE PROCESS HAD DONE ONLY IN THIS MEDIATOR LEVEL.
			if (this.progress_list_.has(uid) == false)
				return;

			// COMPLETE THE HISTORY
			let history: slave.InvokeHistory = this.progress_list_.get(uid);
			let start_time: Date = null;
			let end_time: Date = null;

			// DETERMINE WHEN STARTED AND COMPLETED TIME
			for (let i: number = 0; i < this.system_array_.size(); i++)
			{
				let system: ParallelSystem = this.system_array_.at(i);
				
				let it: std.MapIterator<number, slave.InvokeHistory> = system["history_list_"].find(uid);
				if (it.equals(system["history_list_"].end()) == true)
					continue;
				
				let my_history: slave.InvokeHistory = it.second;
				if (start_time == null || my_history.getStartTime() < start_time)
					start_time = my_history.getStartTime();
				if (end_time == null || my_history.getEndTime() > end_time)
					end_time = my_history.getEndTime();
			}
			history["start_time_"] = start_time;
			history["end_time_"] = end_time;
			
			// ERASE THE HISTORY ON PROGRESS LIST
			this.progress_list_.erase(uid);
			
			// REPORT THE HISTORY TO MASTER
			this.sendData(history.toInvoke());
		}

		/**
		 * @hidden
		 */
		protected _Reply_data(invoke: protocol.Invoke): void
		{
			if (invoke.has("_History_uid") == true)
			{
				// INIT HISTORY OBJECT
				let history: slave.InvokeHistory = new slave.InvokeHistory(invoke);
				
				if (this.system_array_.empty() == true)
				{
					// NO BELONGED SLAVE, THEN SEND BACK
					this.sendData(new protocol.Invoke("_Send_back_history", history.getUID()));
					return;
				}

				// REGISTER THIS PROCESS ON HISTORY LIST
				this.progress_list_.insert([history.getUID(), history]);

				if (invoke.has("_Piece_first") == true)
				{
					// PARALLEL PROCESS
					let first: number = invoke.get("_Piece_first").getValue();
					let last: number = invoke.get("_Piece_last").getValue();

					invoke.erase(invoke.end().advance(-2), invoke.end());
					this.system_array_.sendPieceData(invoke, first, last);
				}
				else if (this.system_array_ instanceof distributed.DistributedSystemArrayMediator
					&& invoke.has("_Process_name") == true)
				{
					// FIND THE MATCHED ROLE
					let process_name: string = invoke.get("_Process_name").getValue();
					if (this.system_array_.hasProcess(process_name) == false)
						return;

					// SEND DATA VIA THE ROLE
					let process: distributed.DistributedProcess = this.system_array_.getProcess(process_name);
					process.sendData(invoke);
				}
			}
			else
				this.replyData(invoke);
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			this.system_array_.sendData(invoke);
		}
	}
}
