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
		private insert_handler_: MapCollectionHandler<Key, T> = null;

		private erase_handler_: MapCollectionHandler<Key, T> = null;

		private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);

		/* =========================================================
			CONSTRUCTORS & ACCESSORS
		============================================================
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public get_insert_handler(): MapCollectionHandler<Key, T>
		{
			return this.insert_handler_;
		}

		/**
		 * @inheritdoc
		 */
		public get_erase_handler(): MapCollectionHandler<Key, T>
		{
			return this.erase_handler_;
		}

		/**
		 * @inheritdoc
		 */
		public set_insert_handler(listener: MapCollectionHandler<Key, T>)
		{
			this.insert_handler_ = listener;
		}

		/**
		 * @inheritdoc
		 */
		public set_erase_handler(listener: MapCollectionHandler<Key, T>)
		{
			this.erase_handler_ = listener;
		}

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

			if (this.insert_handler_ != null)
				this.insert_handler_(first, last);

			this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super.handle_erase(first, last);

			if (this.erase_handler_ != null)
				this.erase_handler_(first, last);

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

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;

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

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;

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
		private insert_handler_: MapCollectionHandler<Key, T> = null;

		private erase_handler_: MapCollectionHandler<Key, T> = null;

		private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);

		/* =========================================================
			CONSTRUCTORS & ACCESSORS
		============================================================
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public get_insert_handler(): MapCollectionHandler<Key, T>
		{
			return this.insert_handler_;
		}

		/**
		 * @inheritdoc
		 */
		public get_erase_handler(): MapCollectionHandler<Key, T>
		{
			return this.erase_handler_;
		}

		/**
		 * @inheritdoc
		 */
		public set_insert_handler(listener: MapCollectionHandler<Key, T>)
		{
			this.insert_handler_ = listener;
		}

		/**
		 * @inheritdoc
		 */
		public set_erase_handler(listener: MapCollectionHandler<Key, T>)
		{
			this.erase_handler_ = listener;
		}

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

			if (this.insert_handler_ != null)
				this.insert_handler_(first, last);

			this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super.handle_erase(first, last);

			if (this.erase_handler_ != null)
				this.erase_handler_(first, last);

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

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;

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

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}