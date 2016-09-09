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
		 * @see {@link ParallelSystem.progress_list}, {@link ParallelSystem.history_list}
		 */
		private history_sequence: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.history_sequence = 0;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * 
		 * @param invoke An invoke message requesting parallel process.
		 * @param size Number of pieces.
		 */
		public sendPieceData(invoke: Invoke, size: number): void;
		
		/**
		 * 
		 * 
		 * @param invoke An invoke message requesting parallel process.
		 * @param first Initial piece's index in a section.
		 * @param last Final piece's index in a section. The ranged used is [<i>first</i>, <i>last</i>), which contains 
		 *			   all the pieces' indices between <i>first</i> and <i>last</i>, including the piece pointed by index
		 *			   <i>first</i>, but not the piece pointed by the index <i>last</i>.
		 */
		public sendPieceData(invoke: Invoke, first: number, last: number): void;

		public sendPieceData(invoke: Invoke, first: number, last: number = -1): void
		{
			if (last == -1)
			{ // METHOD OVERRIDING -> FROM sendPieceData(invoke, first, last)
				last = first;
				first = 0;
			}

			if (invoke.has("invoke_history_uid") == false)
				invoke.push_back(new InvokeParameter("invoke_history_uid", ++this.history_sequence));
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- THIS IS A TYPE OF ParallelSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A ParallelSystem HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO OTHER SLAVES.
				let uid: number = invoke.get("invoke_history_uid").getValue();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				if (uid > this.history_sequence)
					this.history_sequence = uid;
			}

			let size: number = last - first;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;

				let piece_size: number = (i == this.size() - 1) 
					? size - first
					: Math.floor(size / this.size() * system.getPerformance());
				if (piece_size == 0)
					continue;

				system["send_piece_data"](invoke, first, first + piece_size);
				first += piece_size;
			}
		}

		/**
		 * 
		 * @param history 
		 * 
		 * @return Whether the processes with same uid are all fininsed.
		 * 
		 * @see {@link ParallelSystem.report_invoke_history}, {@link normalize_performance}
		 */
		protected _Notify_end(history: InvokeHistory): boolean
		{
			let uid: number = history.getUID();

			// ALL THE SUB-TASKS ARE DONE?
			for (let i: number = 0; i < this.size(); i++)
				if ((this.at(i) as ParallelSystem)["progress_list_"].has(uid) == true)
					return false; // IT'S ON A PROCESS IN SOME SYSTEM.

			///////
			// RE-CALCULATE PERFORMANCE INDEX
			///////
			// CONSTRUCT BASIC DATA
			let system_pairs = new std.Vector<std.Pair<ParallelSystem, number>>();
			let performance_index_averge: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;
				if (system["history_list_"].has(uid) == false)
					continue;

				let my_history: PRInvokeHistory = system["history_list_"].get(uid) as PRInvokeHistory;
				let performance_index: number = my_history.computeSize() / my_history.computeElapsedTime();

				system_pairs.push_back(std.make_pair(system, performance_index));
				performance_index_averge += performance_index;
			}
			performance_index_averge /= system_pairs.size();

			// RE-CALCULATE PERFORMANCE INDEX
			for (let i: number = 0; i < system_pairs.size(); i++)
			{
				let system: ParallelSystem = system_pairs.at(i).first;
				let new_performance: number = system_pairs.at(i).second / performance_index_averge;

				let ordinary_ratio: number;
				if (system["history_list_"].size() < 2)
					ordinary_ratio = .3;
				else
					ordinary_ratio = Math.min(0.7, 1.0 / (system["history_list_"].size() - 1.0));
				
				system["performance"] = (system["performance"] * ordinary_ratio) + (new_performance * (1 - ordinary_ratio));
			}
			this.normalize_performance();

			return true;
		}

		/**
		 * @see {@link ParallelSystem.performance}
		 */
		private normalize_performance(): void
		{
			// CALC AVERAGE
			let average: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
				average += (this.at(i) as ParallelSystem).getPerformance();
			average /= this.size();

			// DIVIDE FROM THE AVERAGE
			for (let i: number = 0; i < this.size(); i++)
				(this.at(i) as ParallelSystem)["performance"] /= average;
		}
	}
}