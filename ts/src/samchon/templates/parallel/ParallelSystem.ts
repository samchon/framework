/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.templates.parallel
{
	/**
	 * A driver for a parallel slave system.
	 * 
	 * The {@link ParallelSystem} is an abstract class represents a **slave** system in *Parallel Processing System*, 
	 * connected with this **master** system. This {@link ParallelSystem} takes full charge of network communication with 
	 * the remote, parallel **slave** system has connected.
	 * 
	 * When a *parallel process* is requested (by {@link ParallelSystemArray.sendSegmentData} or 
	 * {@link ParallelSystemArray.sendPieceData}), the number of pieces to be allocated to a {@link ParallelSystem} is 
	 * turn on its {@link getPerformance performance index}. Higher {@link getPerformance performance index}, then 
	 * more pieces are requested. The {@link getPerformance performance index} is revaluated whenever a *parallel process* 
	 * has completed, basic on the execution time and number of pieces. You can sugguest or enforce the 
	 * {@link getPerformance performance index} with {@link setPerformance} or {@link enforcePerformance}.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * #### Bridge & Proxy Pattern
	 * This class {@link ParallelSystem} is derived from the {@link ExternalSystem} class. Thus, you can take advantage 
	 * of the *Bridge & Proxy Pattern* in this {@link ParallelSystem} class. If a process to request is not the
	 * *parallel process* (to be distrubted to all slaves), but the **exclusive process** handled in a system, then it
	 * may better to utilizing the *Bridge & Proxy Pattern*:
	 * 
	 * The {@link ExternalSystem} class can be a *bridge* for *logical proxy*. In framework within user,
	 * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is *which can be done*.
	 *
	 * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
	 *
	 * <ul>
	 *	<li>
	 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called *Bridge Pattern* and *Proxy Pattern*. </li>
	 * </ul>
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ParallelSystem 
		extends external.ExternalSystem
	{
		/**
		 * @hidden
		 */
		private progress_list_: std.HashMap<number, std.Pair<protocol.Invoke, protocol.InvokeHistory>>;
		
		/**
		 * @hidden
		 */
		private history_list_: std.HashMap<number, protocol.InvokeHistory>;

		/**
		 * @hidden
		 */
		private exclude_: boolean;
		
		/**
		 * @hidden
		 */
		private performance: number;

		/**
		 * @hidden
		 */
		private enforced_: boolean;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ParallelSystemArray}.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArray} object.
		 */
		public constructor(systemArray: ParallelSystemArray<ParallelSystem>);

		/**
		 * Construct from parent {@link ParallelSystemArray} and communicator.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArray} object.
		 * @param communicator A communicator communicates with remote, the external system.
		 */
		public constructor(systemArray: ParallelSystemArray<ParallelSystem>, communicator: protocol.IClientDriver);

		public constructor(systemArray: ParallelSystemArray<ParallelSystem>, communicator: protocol.IClientDriver = null)
		{
			super(systemArray, communicator);
			
			// HIDDEN MEMBERS
			this.progress_list_ = new std.HashMap<number, std.Pair<protocol.Invoke, protocol.InvokeHistory>>();
			this.history_list_ = new std.HashMap<number, protocol.InvokeHistory>();
			
			this.enforced_ = false;
			this.exclude_ = false;

			// PERFORMANCE INDEX
			this.performance = 1.0;
		}

		/**
		 * Default Destructor.
		 * 
		 * This {@link destructor destructor()} method is called when the {@link ParallelSystem} object is destructed and
		 * the {@link ParallelSystem} object is destructed when connection with the remote system is closed or this
		 * {@link ParallelSystem} object is {@link ParallelSystemArray.erase erased} from its parent 
		 * {@link ParallelSystemArray} object.
		 * 
		 * You may think if there're some *parallel processes* have requested but not completed yet, then it would be a
		 * critical problem because the *parallel processes* will not complete forever. Do not worry. The critical problem
		 * does not happen. After the destruction, the remained *parallel processes* will be shifted to and proceeded in 
		 * other {@link ParallelSystem} objects.
		 * 
		 * Note that, don't call this {@link destructor destructor()} method by yourself. It must be called automatically
		 * by those *destruction* cases. Also, if your derived {@link ParallelSystem} class has something to do on the
		 * *destruction*, then overrides this {@link destructor destructor()} method and defines the something to do.
		 * Overriding this {@link destructor destructor()}, don't forget to calling ```super.destructor();``` on tail.
		 *
		 * ```typescript
		 * class SomeSystem extends protocol.external.ExternalSystem
		 * {
		 *     protected destructor(): void
		 *     {
		 *         // DO SOMETHING
		 *         this.do_something();
		 *
		 *         // CALL SUPER.DESTRUCTOR() ON TAIL. DON'T FORGET THIS
		 *         super.destructor();
		 *     }
		 * }
		 * ```
		 */
		protected destructor(): void
		{
			this.exclude_ = true;

			for (let it = this.progress_list_.begin(); !it.equal_to(this.progress_list_.end()); it = it.next())
			{
				// AN INVOKE AND HISTORY HAD PROGRESSED
				let invoke: protocol.Invoke = it.second.first;
				let history: PRInvokeHistory = it.second.second as PRInvokeHistory;
				
				this._Send_back_history(invoke, history);
			}

			super.destructor();
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get manager of this object.
		 * 
		 * @return The parent {@link ParallelSystemArray} object.
		 */
		public getSystemArray(): ParallelSystemArray<ParallelSystem>
		{
			return this["system_array_"] as ParallelSystemArray<ParallelSystem>;
		}

		/**
		 * Get performance index.
		 * 
		 * Get *performance index* that indicates how much fast the remote system is.
		 *
		 * If this {@link ParallelSystem parallel system} does not have any {@link Invoke} message had handled, then the
		 * *performance index* will be ```1.0```, which means default and average value between all {@link ParallelSystem} 
		 * instances (that are belonged to a same {@link ParallelSystemArray} object).
		 *
		 * You can specify this *performance index* by yourself but notice that, if the *performance index* is higher 
		 * than other {@link ParallelSystem} objects, then this {@link ParallelSystem parallel system} will be ordered to 
		 * handle more processes than other {@link ParallelSystem} objects. Otherwise, the *performance index* is lower 
		 * than others, of course, less processes will be delivered.
		 * 
		 * - {@link setPerformance setPerformance()}
		 * - {@link enforcePerformance enforcePerformance()}
		 *
		 * Unless {@link enforcePerformance enforcePerformance()} is called, This *performance index* is **revaluated**
		 * whenever user calls one of them below.
		 *
		 * - {@link ParallelSystemArray.sendSegmentData ParallelSystemArray.sendSegmentData()}
		 * - {@link ParallelSystemArray.sendPieceData ParallelSystemArray.sendPieceData()}
		 * - {@link DistributedProcess.sendData DistributedProcess.sendData()}.
		 * 
		 * @return Performance index.
		 */
		public getPerformance(): number
		{
			return this.performance;
		}

		/**
		 * Set performance index.
		 * 
		 * Set *performance index* that indicates how much fast the remote system is. This *performance index* can be 
		 * **revaulated**.
		 * 
		 * Note that, initial and average *performance index* of {@link ParallelSystem} objects are ```1.0```. If the 
		 * *performance index* is higher than other {@link ParallelSystem} objects, then this {@link ParallelSystem} will
		 * be ordered to handle more processes than other {@link ParallelSystem} objects. Otherwise, the 
		 * *performance index* is lower than others, of course, less processes will be delivered.
		 * 
		 * Unlike {@link enforcePerformance}, configuring *performance index* by this {@link setPerformance} allows 
		 * **revaluation**. This **revaluation** prevents wrong valuation from user. For example, you *mis-valuated* the
		 * *performance index*. The remote system is much faster than any other, but you estimated it to the slowest one. 
		 * It looks like a terrible case that causes {@link ParallelSystemArray entire parallel systems} to be slower, 
		 * however, don't mind. The system will direct to the *propriate performance index* eventually with the 
		 * **revaluation** by following methods.
		 * 
		 * - {@link ParallelSystemArray.sendSegmentData ParallelSystemArray.sendSegmentData()}
		 * - {@link ParallelSystemArray.sendPieceData ParallelSystemArray.sendPieceData()}
		 * - {@link DistributedProcess.sendData DistributedProcess.sendData()}.
		 * 
		 * @param val New performance index, but can be revaluated.
		 */
		public setPerformance(val: number): void
		{
			this.performance = val;
			this.enforced_ = false;
		}

		/**
		 * Enforce performance index.
		 * 
		 * Enforce *performance index* that indicates how much fast the remote system is. The *performance index* will be
		 * fixed, never be **revaluated**.
		 *
		 * Note that, initial and average *performance index* of {@link ParallelSystem} objects are ```1.0```. If the
		 * *performance index* is higher than other {@link ParallelSystem} objects, then this {@link ParallelSystem} will
		 * be ordered to handle more processes than other {@link ParallelSystem} objects. Otherwise, the
		 * *performance index* is lower than others, of course, less processes will be delivered.
		 * 
		 * The difference between {@link setPerformance} and this {@link enforcePerformance} is allowing **revaluation**
		 * or not. This {@link enforcePerformance} does not allow the **revaluation**. The *performance index* is clearly
		 * fixed and never be changed by the **revaluation**. But you've to keep in mind that, you can't avoid the 
		 * **mis-valuation** with this {@link enforcePerformance}. 
		 * 
		 * For example, there's a remote system much faster than any other, but you **mis-estimated** it to the slowest. 
		 * In that case, there's no way. The {@link ParallelSystemArray entire parallel systems} will be slower by the 
		 * **mis-valuation**. By the reason, using {@link enforcePerformance}, it's recommended only when you can clearly
		 * certain the *performance index*. If you can't certain the *performance index* but want to recommend, then use 
		 * {@link setPerformance} instead.
		 * 
		 * @param val New performance index to be fixed.
		 */
		public enforcePerformance(val: number): void
		{
			this.performance = val;
			this.enforced_ = true;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private send_piece_data(invoke: protocol.Invoke, first: number, last: number): void
		{
			// DUPLICATE INVOKE AND ATTACH PIECE INFO
			let my_invoke: protocol.Invoke = new protocol.Invoke(invoke.getListener());
			{
				my_invoke.assign(invoke.begin(), invoke.end());
				my_invoke.push_back(new protocol.InvokeParameter("_Piece_first", first));
				my_invoke.push_back(new protocol.InvokeParameter("_Piece_last", last));
			}

			// REGISTER THE UID AS PROGRESS
			let history: PRInvokeHistory = new PRInvokeHistory(my_invoke);
			this.progress_list_.insert
			([
				history.getUID(), // KEY: UID
				std.make_pair(my_invoke, history) // VALUE: PAIR OF INVOKE AND ITS HISTORY
			]);

			// SEND DATA
			this.sendData(my_invoke);
		}

		/**
		 * @hidden
		 */
		private _replyData(invoke: protocol.Invoke): void
		{
			if (invoke.getListener() == "_Report_history")
			{
				this._Report_history(invoke.front().getValue() as library.XML);
			}
			else if (invoke.getListener() == "_Send_back_history")
			{
				let uid: number = invoke.front().getValue();
				let it = this.progress_list_.find(uid);

				if (it.equal_to(this.progress_list_.end()) == true)
					return;

				this._Send_back_history(it.second.first, it.second.second);
			}
			else
				this.replyData(invoke);
		}
		
		/**
		 * @hidden
		 */
		protected _Report_history(xml: library.XML): void
		{
			//--------
			// CONSTRUCT HISTORY
			//--------
			let history: PRInvokeHistory = new PRInvokeHistory();
			history.construct(xml);

			// IF THE HISTORY IS NOT EXIST IN PROGRESS, THEN TERMINATE REPORTING
			let progress_it = this.progress_list_.find(history.getUID());
			if (progress_it.equal_to(this.progress_list_.end()) == true)
				return;

			// ARCHIVE FIRST AND LAST INDEX
			history["first"] = (progress_it.second.second as PRInvokeHistory).getFirst();
			history["last"] = (progress_it.second.second as PRInvokeHistory).computeSize();

			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this.progress_list_.erase(progress_it);
			this.history_list_.insert([history.getUID(), history]);

			// NOTIFY TO THE MANAGER, SYSTEM_ARRAY
			this.getSystemArray()["_Complete_history"](history);
		}

		/**
		 * @hidden
		 */
		protected _Send_back_history(invoke: protocol.Invoke, history: protocol.InvokeHistory): void
		{
			if (history instanceof PRInvokeHistory)
			{
				// REMOVE UID AND FIRST, LAST INDEXES
				std.remove_if(invoke.begin(), invoke.end(),
					function (param: protocol.InvokeParameter): boolean
					{
						return param.getName() == "_History_uid"
							|| param.getName() == "_Piece_first"
							|| param.getName() == "_Piece_last";
					});

				// RE-SEND (DISTRIBUTE) THE PIECE TO OTHER SLAVES
				this.getSystemArray().sendPieceData
				(
					invoke, 
					history.getFirst(), 
					history.getLast()
				);
			}

			// ERASE FROM THE PROGRESS LIST
			this.progress_list_.erase(history.getUID());
		}
	}
}