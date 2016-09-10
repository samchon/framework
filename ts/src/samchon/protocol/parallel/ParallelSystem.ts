/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.parallel
{
	/**
	 * <p> An external parallel system driver. </p>
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
		 * <p> Performance index. </p>
		 * 
		 * <p> A performance index that indicates how much fast the connected parallel system is. </p>
		 * 
		 * <p> If this {@link ParallelSystem parallel system} hasn't any {@link Invoke} message had handled, then the
		 * {@link performance performance index} will be 1, which means default and average value between all
		 * {@link ParallelSystem} instances (belonged to a same {@link ParallelSystemArray} object). </p>
		 * 
		 * <p> You can specify this {@link performance} by yourself, but notice that, if the 
		 * {@link performance performance index} is higher then other {@link ParallelSystem} objects, then this 
		 * {@link ParallelSystem parallel system} will ordered to handle more processes than other
		 * {@link ParallelSystem} objects. Otherwise, the {@link performance performance index) is lower than others,
		 * of course, less processes will be delivered. </p>
		 * 
		 * <p> This {@link performance index} is always re-calculated whenever {@link ParallelSystemArray} calls one of 
		 * them below. </p>
		 * 
		 * <ul>
		 *	<li> {@link ParallelSystemArray.sendSegmentData ParallelSystemArray.sendSegmentData()} </li>
		 *	<li> {@link ParallelSystemArray.sendPieceData ParallelSystemArray.sendPieceData()} </li>
		 * </ul>
		 * 
		 * <p> If this class is a type of {@link DistributedSystem} derived class from the {@link ParallelSystem}, 
		 * then {@link DistributedSystemRole.sendData DistributedSystemRole.sendData()} also cause the re-calculation.
		 * </p>
		 */
		protected performance: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArray);

		public constructor(systemArray: ParallelSystemArray, communicator: IClientDriver);

		public constructor(systemArray: ParallelSystemArray, communicator: IClientDriver = null)
		{
			super(systemArray, communicator);
			
			// PERFORMANCE INDEX
			this.performance = 1.0;
			this.progress_list_ = new std.HashMap<number, std.Pair<Invoke, InvokeHistory>>();
			this.history_list_ = new std.HashMap<number, InvokeHistory>();
		}

		public destructor(): void
		{
			// MAY DO NOTHING
			super.destructor();
			
			for (let it = this.progress_list_.begin(); !it.equal_to(this.progress_list_.end()); it = it.next())
			{
				// A HISTORY HAD PROGRESSED
				let history: PRInvokeHistory = it.second.second as PRInvokeHistory;
				if (history instanceof PRInvokeHistory == false)
					continue;

				// INVOKE MESSAGE TO RESEND TO OTHER SLAVES
				let invoke: Invoke = it.second.first;
				let first: number = history.getFirst();
				let last: number = history.getLast();

				// SEND-PIECE-DATA
				this.getSystemArray().sendPieceData(invoke, first, last);
			}
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get manager of this object, {@link systemArray}.
		 * 
		 * @return A manager containing this {@link ParallelSystem} object.
		 */
		public getSystemArray(): ParallelSystemArray
		{
			return super.getSystemArray() as ParallelSystemArray;
		}

		/**
		 * Get {@link performant performance index}.
		 * 
		 * A performance index that indicates how much fast the connected parallel system is.
		 */
		public getPerformance(): number
		{
			return this.performance;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * Send an {@link Invoke} message with index of segmentation.
		 * 
		 * @param invoke An invoke message requesting parallel process.
		 * @param first Initial piece's index in a section.
		 * @param last Final piece's index in a section. The ranged used is [<i>first</i>, <i>last</i>), which contains
		 *			   all the pieces' indices between <i>first</i> and <i>last</i>, including the piece pointed by index
		 *			   <i>first</i>, but not the piece pointed by the index <i>last</i>.
		 * 
		 * @see {@link ParallelSystemArray.sendPieceData}
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
				this._Report_history(invoke.front().getValue() as library.XML);
			else
				this.replyData(invoke);
		}
		
		/**
		 * 
		 * 
		 * @param xml
		 * 
		 * @see {@link ParallelSystemArray.notify_complete}
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
	}
}