/// <reference path="../../API.ts" />

/// <reference path="../InvokeHistory.ts" />

namespace samchon.protocol.parallel
{
	export class PRInvokeHistory extends InvokeHistory
	{
		/**
		 * Index number of initial piece.
		 */
		private first: number;
		
		/**
		 * Index number of final piece.
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
		 * Construct from an Invoke message.
		 * 
		 * @param invoke
		 */
		public constructor(invoke: Invoke);

		public constructor(invoke: Invoke = null)
		{
			super(invoke);
			
			if (invoke == null)
			{
				this.first = 0;
				this.last = 0;
			}
			else
			{
				this.first = invoke.get("piece_first").getValue() as number;
				this.last = invoke.get("piece_last").getValue() as number;
			}
		}
		
		public getFirst(): number
		{
			return this.first;
		}
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