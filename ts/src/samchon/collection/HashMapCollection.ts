/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link HashMap} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class HashMapCollection<Key, T>
		extends std.HashMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
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
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super.handle_insert(first, last);

			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
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
		public refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;

		public refresh(first: std.MapIterator<Key, T> = this.begin(), last: std.MapIterator<Key, T> = this.end()): void
		{
			this.dispatchEvent(new CollectionEvent<std.Pair<Key, T>>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;

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
		public removeEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}

	/**
	 * A {@link HashMultiMap} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class HashMultiMapCollection<Key, T>
		extends std.HashMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
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
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super.handle_insert(first, last);

			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
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
		public refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;

		public refresh(first: std.MapIterator<Key, T> = this.begin(), last: std.MapIterator<Key, T> = this.end()): void
		{
			this.dispatchEvent(new CollectionEvent<std.Pair<Key, T>>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;

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
		public removeEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<std.Pair<Key, T>>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}