/// <reference path="../API.ts" />

/// <reference path="Entity.ts" />
/// <reference path="EntityArray.ts" />

namespace samchon.protocol
{
	export class InvokeHistory extends Entity
	{
		/**
		 *
		 */
		private uid: number;
		
		/**
		 * @see {@link Invoke.listener}
		 */
		private listener: string;
		
		/**
		 * 
		 */
		private startTime: Date;
		
		/**
		 *
		 */
		private endTime: Date;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		public constructor(invoke: Invoke);

		public constructor(invoke: Invoke = null)
		{
			super();

			if (invoke == null)
			{
				this.uid = 0;
				this.listener = "";
			}
			else
			{
				this.uid = invoke.get("invoke_history_uid").getValue();
				this.listener = invoke.getListener();

				this.startTime = new Date();
			}
		}

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			this.startTime = new Date(parseInt(xml.getProperty("startTime")));
			this.endTime = new Date(parseInt(xml.getProperty("endTime")));
		}

		public notifyEnd(): void
		{
			this.endTime = new Date();
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key(): number
		{
			return this.uid;
		}

		public getUID(): number
		{
			return this.uid;
		}

		public getListener(): string
		{
			return this.listener;
		}

		public getStartTime(): Date
		{
			return this.startTime;
		}

		public getEndTime(): Date
		{
			return this.endTime;
		}

		public computeElapsedTime(): number
		{
			return Math.max(this.endTime.getTime() - this.startTime.getTime(), 1);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "invokeHistory";
		}

		public toXML(): library.XML
		{
			let xml: library.XML = super.toXML();
			xml.setProperty("startTime", this.startTime.getTime() + "");
			xml.setProperty("endTime", this.endTime.getTime() + "");

			return xml;
		}

		public toInvoke(): Invoke
		{
			return new Invoke("report_invoke_history", this.toXML());
		}
	}
}