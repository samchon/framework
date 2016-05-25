/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link List} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ListCollection<T>
		extends std.List<T>
		implements ICollection<T>
	{
		private insert_handler_: CollectionHandler<T> = null;

		private erase_handler_: CollectionHandler<T> = null;

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
		public set_insert_handler(listener: CollectionHandler<T>)
		{
			this.insert_handler_ = listener;
		}

		/**
		 * @inheritdoc
		 */
		public set_erase_handler(listener: CollectionHandler<T>)
		{
			this.erase_handler_ = listener;
		}

		/**
		 * @inheritdoc
		 */
		public get_insert_handler(): CollectionHandler<T>
		{
			return this.insert_handler_;
		}

		/**
		 * @inheritdoc
		 */
		public get_erase_handler(): CollectionHandler<T>
		{
			return this.erase_handler_;
		}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- ERASE
				- NOTIFIER
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public push<U extends T>(...items: T[]): number
		{
			let ret = super.push(...items);

			this.notify_insert(this.end().advance(-items.length), this.end());

			return ret;
		}
		
		/**
		 * @inheritdoc
		 */
		public push_front(val: T): void
		{
			super.push_front(val);

			this.notify_insert(this.begin(), this.begin().next());
		}

		/**
		 * @inheritdoc
		 */
		public push_back(val: T): void
		{
			super.push_back(val);

			this.notify_insert(this.end().prev(), this.end());
		}

		/**
		 * @hidden
		 */
		protected insert_by_repeating_val(position: std.ListIterator<T>, n: number, val: T): std.ListIterator<T>
		{
			let ret = super.insert_by_repeating_val(position, n, val);

			this.notify_insert(ret, ret.advance(n));

			return ret;
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<U extends T, InputIterator extends std.Iterator<U>>
			(position: std.ListIterator<T>, begin: InputIterator, end: InputIterator): std.ListIterator<T>
		{
			let n: number = this.size();

			let ret = super.insert_by_range(position, begin, end);
			n = this.size() - n;

			this.notify_insert(ret, ret.advance(n));

			return ret;
		}

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public pop_front(): void
		{
			let it = this.begin();
			super.pop_front();
			
			this.notify_erase(it, it.next());
		}

		/**
		 * @inheritdoc
		 */
		public pop_back(): void
		{
			let it = this.end().prev();
			super.pop_back();

			this.notify_erase(it, this.end());
		}

		/**
		 * @hidden
		 */
		protected erase_by_range(first: std.ListIterator<T>, last: std.ListIterator<T>): std.ListIterator<T>
		{
			let ret = super.erase_by_range(first, last);

			this.notify_erase(first, last);

			return ret;
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private notify_insert(first: std.ListIterator<T>, last: std.ListIterator<T>): void
		{
			if (this.insert_handler_ != null)
				this.insert_handler_(first, last);

			this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.ListIterator<T>, last: std.ListIterator<T>): void
		{
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