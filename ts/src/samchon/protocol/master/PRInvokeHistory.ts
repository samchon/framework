/// <reference path="../../API.ts" />

/// <reference path="../InvokeHistory.ts" />

namespace samchon.protocol.master
{
	export class PRInvokeHistory extends InvokeHistory
	{
		private index: number;
		private size: number;

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
				this.index = 0;
				this.size = 0;
			}
			else
			{
				this.index = invoke.get("index").getValue() as number;
				this.size = invoke.get("size").getValue() as number;
			}
		}
		
		public getIndex(): number
		{
			return this.index;
		}

		public getSize(): number
		{
			return this.size;
		}
	}
}