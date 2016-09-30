/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.parallel
{
	/**
	 * An external parallel system driver.
	 * 
	 * 
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ParallelSystem 
		extends external.ExternalSystem
	{
		/**
		 * @hidden
		 */
		private progress_list_: std.HashMap<number, std.Pair<Invoke, InvokeHistory>>;
		
		/**
		 * @hidden
		 */
		private history_list_: std.HashMap<number, InvokeHistory>;

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
		 * 
		 * @param systemArray
		 */
		public constructor(systemArray: ParallelSystemArray);

		/**
		 * 
		 * @param systemArray 
		 * @param communicator A communicator communicates with remote, the external system.
		 */
		public constructor(systemArray: ParallelSystemArray, communicator: IClientDriver);

		public constructor(systemArray: ParallelSystemArray, communicator: IClientDriver = null)
		{
			super(systemArray, communicator);
			
			// HIDDEN MEMBERS
			this.progress_list_ = new std.HashMap<number, std.Pair<Invoke, InvokeHistory>>();
			this.history_list_ = new std.HashMap<number, InvokeHistory>();
			
			this.enforced_ = false;
			this.exclude_ = false;

			// PERFORMANCE INDEX
			this.performance = 1.0;
		}

		protected destructor(): void
		{
			this.exclude_ = true;

			for (let it = this.progress_list_.begin(); !it.equal_to(this.progress_list_.end()); it = it.next())
			{
				// AN INVOKE AND HISTORY HAD PROGRESSED
				let invoke: Invoke = it.second.first;
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
		 * @return A manager containing this {@link ParallelSystem} object.
		 */
		public getSystemArray(): ParallelSystemArray
		{
			return super.getSystemArray() as ParallelSystemArray;
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
		 * - {@link DistributedSystemRole.sendData DistributedSystemRole.sendData()}.
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
		 * - {@link DistributedSystemRole.sendData DistributedSystemRole.sendData()}.
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
		 * In that case, there's no way. The {@link ParalllelSystemArray entire parallel systems} will be slower by the 
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
		private send_piece_data(invoke: Invoke, first: number, last: number): void
		{
			// DUPLICATE INVOKE AND ATTACH PIECE INFO
			let my_invoke: Invoke = new Invoke(invoke.getListener());
			{
				my_invoke.assign(invoke.begin(), invoke.end());
				my_invoke.push_back(new InvokeParameter("_Piece_first", first));
				my_invoke.push_back(new InvokeParameter("_Piece_last", last));
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
				this.progress_list_.erase(uid);
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
		protected _Send_back_history(invoke: Invoke, history: InvokeHistory): void
		{
			if (history instanceof PRInvokeHistory)
			{
				// REMOVE UID AND FIRST, LAST INDEXES
				std.remove_if(invoke.begin(), invoke.end(),
					function (param: InvokeParameter): boolean
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
		}
	}
}