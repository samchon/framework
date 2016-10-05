/// <reference path="../../API.ts" />

/// <reference path="../../protocol/InvokeHistory.ts" />

namespace samchon.templates.parallel
{
	/**
	 * History of an {@link Invoke} message.
	 * 
	 * The {@link PRInvokeHistory} is a class archiving history log of an {@link Invoke} message which requests the
	 * *parallel process*, created whenever {@link ParallelSystemArray.sendSegmentData} or 
	 * {@link ParallelSystemArray.sendSegmentData} is called.
	 * 
	 * When the *parallel process* has completed, then {@link complete complete()} is called and the *elapsed time* is 
	 * determined. The elapsed time is utilized for computation of {@link ParallelSystem.getPerformance performance index} 
	 * of each {@link ParallelSystem parallel slave system}.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class PRInvokeHistory 
		extends protocol.InvokeHistory
	{
		/**
		 * @hidden
		 */
		private first: number;
		
		/**
		 * @hidden
		 */
		private last: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from an {@link Invoke} message.
		 * 
		 * @param invoke An {@link Invoke} message requesting a *parallel process*.
		 */
		public constructor(invoke: protocol.Invoke);

		public constructor(invoke: protocol.Invoke = null)
		{
			super(invoke);
			
			if (invoke == null)
			{
				this.first = 0;
				this.last = 0;
			}
			else
			{
				this.first = invoke.get("_Piece_first").getValue() as number;
				this.last = invoke.get("_Piece_last").getValue() as number;
			}
		}
		
		/**
		 * Get initial piece's index.
		 * 
		 * Returns initial piece's index in the section of requested *parallel process*.
		 * 
		 * @return The initial index.
		 */
		public getFirst(): number
		{
			return this.first;
		}

		/**
		 * Get final piece's index.
		 * 
		 * Returns initial piece's index in the section of requested *parallel process*. The range used is 
		 * [*first*, *last*), which contains all the pieces' indices between *first* and *last*, including the piece 
		 * pointed by index *first*, but not the piece pointed by the index *last*.
		 * 
		 * @return The final index.
		 */
		public getLast(): number
		{
			return this.last;
		}

		/**
		 * Compute number of allocated pieces.
		 */
		public computeSize(): number
		{
			return this.last;
		}
	}
}