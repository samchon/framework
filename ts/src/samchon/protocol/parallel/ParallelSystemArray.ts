/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemArray.ts" />

namespace samchon.protocol.parallel
{
	/**
	 * <p> A manager containing {@link ParallelSystem} objects. </p>
	 * 
	 * 
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ParallelSystemArray
		extends external.ExternalSystemArray
	{
		/**
		 * @hidden
		 */
		private history_sequence_: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.history_sequence_ = 0;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public at(index: number): ParallelSystem
		{
			return super.at(index) as ParallelSystem;
		}

		/**
		 * @hidden
		 */
		public _Fetch_history_sequence(): number
		{
			return ++this.history_sequence_;
		}

		/**
		 * @hidden
		 */
		public _Set_history_sequence(val: number): void
		{
			if (val <= this.history_sequence_)
				return;

			this.history_sequence_ = val;
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- PERFORMANCE ESTIMATION
		============================================================
			SEND & REPLY DATA
		--------------------------------------------------------- */
		/**
		 * 
		 * @param invoke An invoke message requesting parallel process.
		 * @param size Number of pieces.
		 */
		public sendSegmentData(invoke: Invoke, size: number): void
		{
			this.sendPieceData(invoke, 0, size);
		}
		
		/**
		 * 
		 * 
		 * @param invoke An invoke message requesting parallel process.
		 * @param first Initial piece's index in a section.
		 * @param last Final piece's index in a section. The ranged used is [<i>first</i>, <i>last</i>), which contains 
		 *			   all the pieces' indices between <i>first</i> and <i>last</i>, including the piece pointed by index
		 *			   <i>first</i>, but not the piece pointed by the index <i>last</i>.
		 */
		public sendPieceData(invoke: Invoke, first: number, last: number): void
		{
			if (invoke.has("_History_uid") == false)
				invoke.push_back(new InvokeParameter("_History_uid", this._Fetch_history_sequence()));
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- THIS IS A TYPE OF ParallelSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A ParallelSystem HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO OTHER SLAVES.
				let uid: number = invoke.get("_History_uid").getValue();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				this._Set_history_sequence(uid);
			}

			let size: number = last - first;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;

				// COMPUTE FIRST AND LAST INDEX TO ALLOCATE
				let piece_size: number = (i == this.size() - 1) 
					? size - first
					: Math.floor(size / this.size() * system.getPerformance());
				if (piece_size == 0)
					continue;

				// SEND DATA WITH PIECE INDEXES
				system._Send_piece_data(invoke, first, first + piece_size);
				first += piece_size; // FOR THE NEXT STEP
			}
		}

		/* ---------------------------------------------------------
			PERFORMANCE ESTIMATION
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		public _Complete_history(history: InvokeHistory): boolean
		{
			// WRONG TYPE
			if ((history instanceof PRInvokeHistory) == false)
				return false;

			let uid: number = history.getUID();

			// ALL THE SUB-TASKS ARE DONE?
			for (let i: number = 0; i < this.size(); i++)
				if ((this.at(i) as ParallelSystem)._Get_progress_list().has(uid) == true)
					return false; // IT'S ON A PROCESS IN SOME SYSTEM.

			//--------
			// RE-CALCULATE PERFORMANCE INDEX
			//--------
			// CONSTRUCT BASIC DATA
			let system_pairs = new std.Vector<std.Pair<ParallelSystem, number>>();
			let performance_index_average: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;
				if (system._Get_history_list().has(uid) == false)
					continue; // NO HISTORY (HAVE NOT PARTICIPATED IN THE PARALLEL PROCESS)

				// COMPUTE PERFORMANCE INDEX BASIS ON EXECUTION TIME OF THIS PARALLEL PROCESS
				let my_history: PRInvokeHistory = system._Get_history_list().get(uid) as PRInvokeHistory;
				let performance_index: number = my_history.computeSize() / my_history.computeElapsedTime();

				// PUSH TO SYSTEM PAIRS AND ADD TO AVERAGE
				system_pairs.push_back(std.make_pair(system, performance_index));
				performance_index_average += performance_index;
			}
			performance_index_average /= system_pairs.size();

			// RE-CALCULATE PERFORMANCE INDEX
			for (let i: number = 0; i < system_pairs.size(); i++)
			{
				// SYSTEM AND NEW PERFORMANCE INDEX BASIS ON THE EXECUTION TIME
				let system: ParallelSystem = system_pairs.at(i).first;
				let new_performance: number = system_pairs.at(i).second / performance_index_average;

				// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 30%
				let ordinary_ratio: number;
				if (system._Get_history_list().size() < 2)
					ordinary_ratio = .3;
				else
					ordinary_ratio = Math.min(0.7, 1.0 / (system._Get_history_list().size() - 1.0));
				
				// DEFINE NEW PERFORMANCE
				system.setPerformance((system.getPerformance() * ordinary_ratio) + (new_performance * (1 - ordinary_ratio)));
			}

			// AT LAST, NORMALIZE PERFORMANCE INDEXES OF ALL SYSTEMS
			this._Normalize_performance();
			return true;
		}

		/**
		 * @hidden
		 */
		protected _Normalize_performance(): void
		{
			// CALC AVERAGE
			let average: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
				average += this.at(i).getPerformance();
			average /= this.size();

			// DIVIDE FROM THE AVERAGE
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i);
				system.setPerformance(system.getPerformance() / average);
			}
		}
	}
}