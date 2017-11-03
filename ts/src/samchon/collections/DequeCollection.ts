/// <reference path="../API.ts" />

namespace samchon.collections
{
	/**
	 * A {@link Deque} who can detect element I/O events.
	 * 
	 * Below is the list of methods who are dispatching {@link CollectionEvent}:
	 * - *insert* typed events: 
	 *   - {@link assign}
	 *   - {@link insert}
	 *   - {@link push}
	 *   - {@link push_front}
	 *   - {@link push_back}
	 * - *erase* typed events: 
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 *   - {@link pop_front}
	 *   - {@link pop_back}
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 * 
	 * #### [Inherited] {@link Deque}
	 * @copydoc Deque
	 */
	export class DequeCollection<T>
		extends std.Deque<T>
		implements ICollection<T>
	{
		// A chain object taking responsibility of dispatching events.
		/**
		 * @hidden
		 */
		private event_dispatcher_: library.EventDispatcher = new library.EventDispatcher(this);

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

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
		public push_front(val: T): void
		{
			super.push_front(val);

			this._Notify_insert(this.begin(), this.begin().next());
		}

		/**
		 * @inheritdoc
		 */
		public push_back(val: T): void
		{
			super.push(val);

			this._Notify_insert(this.end().prev(), this.end());
		}

		/**
		 * @hidden
		 */
		protected _Insert_by_range<U extends T, InputIterator extends std.IForwardIterator<U>>
			(position: std.Deque.Iterator<T>, begin: InputIterator, end: InputIterator): std.Deque.Iterator<T>
		{
			let n: number = this.size();

			let ret = super._Insert_by_range(position, begin, end);
			n = this.size() - n;

			this._Notify_insert(ret, ret.advance(n));

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
			this._Notify_erase(this.begin(), this.begin().next());

			super.pop_front();
		}

		/**
		 * @inheritdoc
		 */
		public pop_back(): void
		{
			this._Notify_erase(this.end().prev(), this.end());

			super.pop_back();
		}

		/**
		 * @hidden
		 */
		protected _Erase_by_range(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): std.Deque.Iterator<T>
		{
			this._Notify_erase(first, last);

			return super._Erase_by_range(first, last);
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private _Notify_insert(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): void
		{
			ICollection._Dispatch_CollectionEvent(this, "insert", first, last);
		}

		/**
		 * @hidden
		 */
		private _Notify_erase(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): void
		{
			ICollection._Dispatch_CollectionEvent(this, "erase", first, last);
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
		public dispatchEvent(event: library.BasicEvent): boolean
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
		public refresh(it: std.Deque.Iterator<T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.Deque.Iterator<T>, last: std.Deque.Iterator<T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.Deque.Iterator<T>;
			let last: std.Deque.Iterator<T>;

			if (args.length == 0)
			{
				first = this.begin();
				last = this.end();
			}
			else if (args.length == 1)
			{
				first = args[0];
				last = first.next();
			}
			else
			{
				first = args[0];
				last = args[1];
			}

			ICollection._Dispatch_CollectionEvent(this, "refresh", first, last);
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: library.BasicEventListener): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		public addEventListener<Listener extends library.BasicEventListener>
			(type: string, listener: Listener, thisArg: Object = null): void
		{
			this.event_dispatcher_.addEventListener(type, listener, thisArg);
		}

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: library.BasicEventListener): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		public removeEventListener<Listener extends library.BasicEventListener>
			(type: string, listener: Listener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}