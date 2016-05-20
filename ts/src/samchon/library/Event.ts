namespace samchon.library
{
	/**
	 * An event class.
	 *
	 * <ul>
	 *  <li> Comments from - https://developer.mozilla.org/en-US/docs/Web/API/Event/ </li>
	 * </ul>
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class BasicEvent implements Event
	{
		/* -------------------------------------------------------------------
			STATIC CONSTS
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public static get NONE(): number { return 0; }
		public get NONE(): number { return 0; }

		/**
		 * @inheritdoc
		 */
		public static get CAPTURING_PHASE(): number { return Event.CAPTURING_PHASE; }
		public get CAPTURING_PHASE(): number { return Event.CAPTURING_PHASE; }
		

		/**
		 * @inheritdoc
		 */
		public static get AT_TARGET(): number { return Event.AT_TARGET; }
		public get AT_TARGET(): number { return Event.AT_TARGET; }

		/**
		 * @inheritdoc
		 */
		public static get BUBBLING_PHASE(): number { return Event.BUBBLING_PHASE; }
		public get BUBBLING_PHASE(): number { return Event.BUBBLING_PHASE; }

		/* -------------------------------------------------------------------
			MEMBERS
		------------------------------------------------------------------- */
		private type_: string;
		private target_: IEventDispatcher;
		private currentTarget_: IEventDispatcher;

		protected trusted_: boolean;
		protected bubbles_: boolean;
		protected cancelable_: boolean;
		protected defaultPrevented_: boolean;
		protected cancelBubble_: boolean;

		private timeStamp_: Date;

		/* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false)
		{
			this.type_ = type.toLowerCase();
			this.target_ = null;
			this.currentTarget_ = null;

			this.trusted_ = false;
			this.bubbles_ = bubbles;
			this.cancelable_ = cancelable;
			this.defaultPrevented_ = false;
			this.cancelBubble_ = false;
			this.timeStamp_ = new Date();
		}

		/**
		 * @inheritdoc
		 */
		public initEvent(type: string, bubbles: boolean, cancelable: boolean): void
		{
			this.type_ = type.toLowerCase();

			this.bubbles_ = bubbles;
			this.cancelable_ = cancelable;
		}

		/* -------------------------------------------------------------------
			ACTIONS ON PROGRESS
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public preventDefault(): void
		{
		}

		/**
		 * @inheritdoc
		 */
		public stopImmediatePropagation()
		{
		}

		/**
		 * @inheritdoc
		 */
		public stopPropagation()
		{
		}

		/* -------------------------------------------------------------------
			GETTERS
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public get type(): string
		{
			return this.type_;
		}

		/**
		 * @inheritdoc
		 */
		public get target(): IEventDispatcher
		{
			return this.target_;
		}

		/**
		 * @inheritdoc
		 */
		public get currentTarget(): IEventDispatcher
		{
			return this.currentTarget_;
		}

		/**
		 * @inheritdoc
		 */
		public get isTrusted(): boolean
		{
			return this.isTrusted;
		}

		/**
		 * @inheritdoc
		 */
		public get bubbles(): boolean
		{
			return this.bubbles_;
		}

		/**
		 * @inheritdoc
		 */
		public get cancelable(): boolean
		{
			return this.cancelable_;
		}

		/**
		 * @inheritdoc
		 */
		public get eventPhase(): number
		{
			return this.NONE;
		}

		/**
		 * @inheritdoc
		 */
		public get defaultPrevented(): boolean
		{
			return this.defaultPrevented_;
		}

		/**
		 * @inheritdoc
		 */
		public get srcElement(): Element
		{
			return null;
		}

		/**
		 * @inheritdoc
		 */
		public get cancelBubble(): boolean
		{
			return this.cancelBubble_;
		}

		/**
		 * @inheritdoc
		 */
		public get timeStamp(): number
		{
			return this.timeStamp_.getTime();
		}

		/**
		 * Don't know what it is.
		 */ 
		public get returnValue(): boolean
		{
			return false;
		}
	}

	export class ProgressEvent
		extends BasicEvent
	{
		public static get PROGRESS(): string { return "progress"; }

		protected numerator_: number;
		protected denominator_: number;

		public constructor(type: string, numerator: number, denominator: number)
		{
			super(type);

			this.numerator_ = numerator;
			this.denominator_ = denominator;
		}

		public get numerator(): number
		{
			return this.numerator_;
		}
		public get denominator(): number
		{
			return this.denominator_;
		}
	}
}