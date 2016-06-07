/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link Vector} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ArrayCollection<T>
		extends std.Vector<T>
		implements ICollection<T>
	{
		/**
		 * A callback function listening elements insertion.
		 */
		private insert_handler_: CollectionHandler<T> = null;

		/**
		 * A callback function listening elements deletion.
		 */
		private erase_handler_: CollectionHandler<T> = null;

		/**
		 * A chain object taking responsibility of dispatching events.
		 */
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
		public push<U extends T>(...items: U[]): number
		{
			let ret = super.push(...items);

			this.notify_insert(this.end().advance(-items.length), this.end());

			return ret;
		}

		/**
		 * @inheritdoc
		 */
		public push_back(val: T): void
		{
			super.push(val);

			this.notify_insert(this.end().prev(), this.end());
		}

		/**
		 * @hidden
		 */
		protected insert_by_repeating_val(position: std.VectorIterator<T>, n: number, val: T): std.VectorIterator<T>
		{
			let ret = super.insert_by_repeating_val(position, n, val);

			this.notify_insert(ret, ret.advance(n));
			
			return ret;
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<U extends T, InputIterator extends std.Iterator<U>>
			(position: std.VectorIterator<T>, begin: InputIterator, end: InputIterator): std.VectorIterator<T>
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
		public pop_back(): void
		{
			this.notify_erase(this.end().prev(), this.end());
			
			super.pop_back();
		}

		/**
		 * @hidden
		 */
		protected erase_by_range(first: std.VectorIterator<T>, last: std.VectorIterator<T>): std.VectorIterator<T>
		{
			this.notify_erase(first, last);

			return super.erase_by_range(first, last);
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private notify_insert(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
		{
			if (this.insert_handler_ != null)
				this.insert_handler_(first, last);

			this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
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

		/* =========================================================
			ARRAY'S MEMBERS
				- INSERT
				- ERASE
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public unshift<U extends T>(...items: U[]): number
		{
			let ret = super.unshift(...items);

			this.notify_insert(this.begin(), this.begin().advance(items.length));

			return ret;
		}

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public pop(): T
		{
			this.notify_erase(this.end().prev(), this.end());

			return super.pop();
		}

		/**
		 * @inheritdoc
		 */
		public splice(start: number): T[];
		
		/**
		 * @inheritdoc
		 */
		public splice(start: number, deleteCount: number, ...items: T[]): T[];

		public splice(start: number, deleteCount: number = this.size() - start, ...items: T[]): T[]
		{
			// FILTER
			if (start + deleteCount > this.size())
				deleteCount = this.size() - start;

			// NOTIFY ERASE
			let first = new std.VectorIterator<T>(this, start);
			let last = first.advance(deleteCount);

			this.notify_erase(first, last);

			// CALL SUPER::ERASE
			return super.splice(start, deleteCount, ...items);
		}
	}
}