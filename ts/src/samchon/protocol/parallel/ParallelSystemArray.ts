/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemArray.ts" />

/**
 * [[include: TypeScript-Protocol-Parallel_System.md]]
 */
namespace samchon.protocol.parallel
{
	/**
	 * Master of Parallel Processing System.
	 * 
	 * The {@link ParallelSystemArray} is an abstract class containing and managing remote parallel slave system drivers, 
	 * {@link ParallelSystem} objects. Within framework of network, {@link ParallelSystemArray} represents your system, 
	 * a *Master* of *Parallel Processing System* that requesting *parallel process* to slave systems and the children 
	 * {@link ParallelSystem} objects represent the remote slave systems, who is being requested the *parallel processes*.
	 * 
	 * You can specify this {@link ParallelSystemArray} class to be *a server accepting parallel clients* or 
	 * *a client connecting to parallel servers*. Even both of them is possible. Extends one of them below and overrides 
	 * abstract factory method(s) creating the child {@link ParallelSystem} object.
	 * 
	 * - {@link ParallelClientArray}: A server accepting {@link ParallelSystem parallel clients}.
	 * - {@link ParallelServerArray}: A client connecting to {@link ParallelServer parallel servers}.
	 * - {@link ParallelServerClientArray}: Both of them. Accepts {@link ParallelSystem parallel clients} and connects to
	 *                                      {@link ParallelServer parallel servers} at the same time.
	 * 
	 * When you need the **parallel process**, then call one of them: {@link sendSegmentData} or {@link sendPieceData}.
	 * When the **parallel process** has completed, {@link ParallelSystemArray} estimates each {@link ParallelSystem}'s 
	 * {@link ParallelSystem.getPerformance performance index} basis on their execution time. Those performance indices 
	 * will be reflected to the next **parallel process**, how much pieces to allocate to each {@link ParallelSystem}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * #### Proxy Pattern
	 * This class {@link ParallelSystemArray} is derived from the {@link ExternalSystemArray} class. Thus, you can take 
	 * advantage of the *Proxy Pattern* in the {@link ParallelSystemArray} class. If a process to request is not the 
	 * *parallel process* (to be distrubted to all slaves), but the **exclusive process** handled in a system, then it 
	 * may better to utilizing the *Proxy Pattern*:
	 * 
	 * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
	 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
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
	 *	<li> Those strategy is called *Proxy Pattern*. </li>
	 * </ul>
	 * 
	 * @handbook [Protocol - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Parallel_System)
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
		 * Send an {@link Invoke} message with segment size.
		 * 
		 * Sends an {@link Invoke} message requesting a **parallel process** with its *segment size*. The {@link Invoke}
		 * message will be delivered to children {@link ParallelSystem} objects with the *piece size*, which is divided
		 * from the *segment size*, basis on their {@link ParallelSystem.getPerformance performance indices}.
		 * 
		 * - If segment size is 100,
		 * - The segment will be allocated such below:
		 *     Name    | Performance index | Number of pieces to be allocated | Formula
		 *     --------|-------------------|----------------------------------|--------------
		 *     Snail   |                 1 |                               10 | 100 / 10 * 1
		 *     Cheetah |                 4 |                               40 | 100 / 10 * 4
		 *     Rabbit  |                 3 |                               30 | 100 / 10 * 3
		 *     Turtle  |                 2 |                               20 | 100 / 10 * 2
		 * 
		 * When the **parallel process** has completed, then this {@link ParallelSystemArraY} will estimate 
		 * {@link ParallelSystem.getPerformance performance indices} of {@link ParallelSystem} objects basis on their 
		 * execution time.
		 * 
		 * @param invoke An {@link Invoke} message requesting parallel process.
		 * @param size Number of pieces to segment.
		 * 
		 * @see {@link sendPieceData}, {@link ParallelSystem.getPerformacen}
		 */
		public sendSegmentData(invoke: Invoke, size: number): void
		{
			this.sendPieceData(invoke, 0, size);
		}
		
		/**
		 * Send an {@link Invoke} message with range of pieces.
		 * 
		 * Sends an {@link Invoke} message requesting a **parallel process** with its *range of pieces [first, last)*. 
		 * The {@link Invoke} will be delivered to children {@link ParallelSystem} objects with the newly computed 
		 * *range of sub-pieces*, which is divided from the *range of pieces (first to last)*, basis on their
		 * {@link ParallelSystem.getPerformance performance indices}.
		 * 
		 * - If indices of pieces are 0 to 50,
		 * - The sub-pieces will be allocated such below:
		 *      Name    | Performance index | Range of sub-pieces to be allocated | Formula
		 *     ---------|-------------------|-------------------------------------|------------------------
		 *      Snail   |                 1 |                            ( 0,  5] | (50 - 0) / 10 * 1
		 *      Cheetah |                 4 |                            ( 5, 25] | (50 - 0) / 10 * 4 + 5
		 *      Rabbit  |                 3 |                            (25, 40] | (50 - 0) / 10 * 3 + 25
		 *      Turtle  |                 2 |                            (40, 50] | (50 - 0) / 10 * 2 + 40
		 * 
		 * When the **parallel process** has completed, then this {@link ParallelSystemArraY} will estimate
		 * {@link ParallelSystem.getPerformance performance indices} of {@link ParallelSystem} objects basis on their
		 * execution time.
		 * 
		 * @param invoke An {@link Invoke} message requesting parallel process.
		 * @param first Initial piece's index in a section.
		 * @param last Final piece's index in a section. The ranged used is [*first*, *last*), which contains 
		 *			   all the pieces' indices between *first* and *last*, including the piece pointed by index
		 *			   *first*, but not the piece pointed by the index *last*.
		 * 
		 * @see {@link sendSegmentData}, {@link ParallelSystem.getPerformacen}
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