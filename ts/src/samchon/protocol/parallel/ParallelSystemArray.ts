/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemArray.ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelSystemArray
		extends external.ExternalSystemArray
	{
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
		public sendSegmentData(invoke: Invoke, size: number): void
		{
			this.sendPieceData(invoke, 0, size);
		}

		public sendPieceData(invoke: Invoke, index: number, size: number): void
		{
			invoke.push_back(new InvokeParameter("invoke_history_uid", ++this.history_sequence));

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;

				let piece_size: number = (i == this.size() - 1) 
					? size - index
					: Math.floor(size / this.size() * system.getPerformance());
				if (piece_size == 0)
					continue;

				system["send_piece_data"](invoke, index, piece_size);
				index += piece_size;
			}
		}

		protected notify_end(history: PRInvokeHistory): boolean
		{
			let uid: number = history.getUID();

			// ALL THE SUB-TASKS ARE DONE?
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["progress_list"].has(uid) == true)
					return false;

			///////
			// RE-CALCULATE PERFORMANCE INDEX
			///////
			// CONSTRUCT BASIC DATA
			let system_pairs = new std.Vector<std.Pair<ParallelSystem, number>>();
			let performance_index_averge: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i) as ParallelSystem;
				if (system["history_list"].has(uid) == false)
					continue;

				let my_history: PRInvokeHistory = system["history_list"].get(uid);
				let performance_index: number = my_history.getSize() / my_history.computeElapsedTime();

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
				if (system["history_list"].size() < 2)
					ordinary_ratio = .3;
				else
					ordinary_ratio = Math.min(0.7, 1.0 / (system["history_list"].size() - 1.0));
				
				system["performance"] = (system["performance"] * ordinary_ratio) + (new_performance * (1 - ordinary_ratio));
			}
			this.normalize_performance();

			return true;
		}

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