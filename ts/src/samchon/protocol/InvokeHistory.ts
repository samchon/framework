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
		private start_time_: Date;
		
		/**
		 *
		 */
		private end_time_: Date;

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

				this.start_time_ = new Date();
			}
		}

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			this.start_time_ = new Date(parseInt(xml.getProperty("startTime")));
			this.end_time_ = new Date(parseInt(xml.getProperty("endTime")));
		}

		public notifyEnd(): void
		{
			this.end_time_ = new Date();
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
			return this.start_time_;
		}

		public getEndTime(): Date
		{
			return this.end_time_;
		}

		public computeElapsedTime(): number
		{
			return Math.max(this.end_time_.getTime() - this.start_time_.getTime(), 1);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public TAG(): string
		{
			return "invokeHistory";
		}

		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = super.toXML();
			xml.setProperty("startTime", this.start_time_.getTime() + "");
			xml.setProperty("endTime", this.end_time_.getTime() + "");

			return xml;
		}

		public toInvoke(): Invoke
		{
			return new Invoke("report_invoke_history", this.toXML());
		}
	}
}