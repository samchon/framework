/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link TreeMap} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeSetCollection<T>
		extends std.TreeSet<T>
		implements ICollection<T>
	{
		/**
		 * A chain object taking responsibility of dispatching events.
		 */
		private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/* =========================================================
			EVENT_DISPATCHER
				- ACCESSORS
				- ADD
				- REMOVE
		============================================================
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.event_dispatcher_.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.event_dispatcher_.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public refresh(): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;

		public refresh(first: std.SetIterator<T> = this.begin(), last: std.SetIterator<T> = this.end()): void
		{
			this.dispatchEvent(new CollectionEvent<T>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.addEventListener(type, listener, thisArg);
		}

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}

	/**
	 * A {@link TreeMultiSet} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeMultiSetCollection<T>
		extends std.TreeMultiSet<T>
		implements ICollection<T>
	{
		/**
		 * A chain object taking responsibility of dispatching events.
		 */
		private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/* =========================================================
			ELEMENTS I/O
				- HANDLE_INSERT & HANDLE_ERASE
		============================================================
			HANDLE_INSERT & HANDLE_ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			super.handle_insert(first, last);

			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			super.handle_erase(first, last);

			if (this.hasEventListener(CollectionEvent.ERASE))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.ERASE, first, last));
		}

		/* =========================================================
			EVENT_DISPATCHER
				- ACCESSORS
				- ADD
				- REMOVE
		============================================================
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.event_dispatcher_.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.event_dispatcher_.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public refresh(): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;

		public refresh(first: std.SetIterator<T> = this.begin(), last: std.SetIterator<T> = this.end()): void
		{
			this.dispatchEvent(new CollectionEvent<T>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.addEventListener(type, listener, thisArg);
		}

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}