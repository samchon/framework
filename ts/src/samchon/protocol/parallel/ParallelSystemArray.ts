/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemArray.ts" />

namespace samchon.protocol.parallel
{
	/**
	 * A manager containing {@link ParallelSystem} objects.
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
		 * @param last Final piece's index in a section. The ranged used is [*first*, *last*), which contains 
		 *			   all the pieces' indices between *first* and *last*, including the piece pointed by index
		 *			   *first*, but not the piece pointed by the index *last*.
		 */
		public sendPieceData(invoke: Invoke, first: number, last: number): void
		{
			if (invoke.has("_History_uid") == false)
				invoke.push_back(new InvokeParameter("_History_uid", ++this.history_sequence_));
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- THIS IS A TYPE OF ParallelSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A ParallelSystem HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO OTHER SLAVES.
				let uid: number = invoke.get("_History_uid").getValue();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				this.history_sequence_ = uid;
			}

			let segment_size: number = last - first;
			let system_size: number = 0;

			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["exclude_"] == false)
					system_size++;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;
				if (system["exclude_"] == true)
					continue;

				// COMPUTE FIRST AND LAST INDEX TO ALLOCATE
				let piece_size: number = (i == this.size() - 1) 
					? segment_size - first
					: Math.floor(segment_size / system_size * system.getPerformance());
				if (piece_size == 0)
					continue;

				// SEND DATA WITH PIECE INDEXES
				system["send_piece_data"](invoke, first, first + piece_size);
				first += piece_size; // FOR THE NEXT STEP
			}
		}

		/* ---------------------------------------------------------
			PERFORMANCE ESTIMATION
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Complete_history(history: InvokeHistory): boolean
		{
			// WRONG TYPE
			if ((history instanceof PRInvokeHistory) == false)
				return false;

			let uid: number = history.getUID();

			// ALL THE SUB-TASKS ARE DONE?
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["progress_list_"].has(uid) == true)
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
				if (system["history_list_"].has(uid) == false)
					continue; // NO HISTORY (HAVE NOT PARTICIPATED IN THE PARALLEL PROCESS)

				// COMPUTE PERFORMANCE INDEX BASIS ON EXECUTION TIME OF THIS PARALLEL PROCESS
				let my_history: PRInvokeHistory = system["history_list_"].get(uid) as PRInvokeHistory;
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
				if (system["enforced_"] == true)
					continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

				let new_performance: number = system_pairs.at(i).second / performance_index_average;

				// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 30%
				let ordinary_ratio: number;
				if (system["history_list_"].size() < 2)
					ordinary_ratio = .3;
				else
					ordinary_ratio = Math.min(0.7, 1.0 / (system["history_list_"].size() - 1.0));
				
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
			// COMPUTE AVERAGE
			let average: number = 0.0;
			let denominator: number = 0;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i);
				if (system["enforced_"] == true)
					continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

				average += system.getPerformance();
				denominator++;
			}
			average /= denominator;

			// DIVIDE FROM THE AVERAGE
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i);
				if (system["enforced_"] == true)
					continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION
				
				system.setPerformance(system.getPerformance() / average);
			}
		}
	}
}