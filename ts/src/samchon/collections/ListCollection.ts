/// <reference path="../API.ts" />

namespace samchon.collections
{
	/**
	 * A {@link List} who can detect element I/O events.
	 * 
	 * Below is the list of methods who are dispatching {@link CollectionEvent}:
	 *	- *insert* typed events:
	 *   - {@link assign}
	 *   - {@link insert}
	 *   - {@link push}
	 *   - {@link push_front}
	 *   - {@link push_back}
	 *   - {@link merge}
	 * - *erase* typed events:
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 *   - {@link pop_front}
	 *   - {@link pop_back}
	 *   - {@link unique}
	 *   - {@link remove}
	 *   - {@link remove_if}
	 *   - {@link splice}
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 *   - {@link sort}
	 * 
	 * #### [Inherited] {@link List}
	 * @copydoc List
	 */
	export class ListCollection<T>
		extends std.List<T>
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
		 * @hidden
		 */
		protected _Insert_by_range<U extends T, InputIterator extends std.Iterator<U>>
			(position: std.ListIterator<T>, begin: InputIterator, end: InputIterator): std.ListIterator<T>
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
		 * @hidden
		 */
		protected _Erase_by_range(first: std.ListIterator<T>, last: std.ListIterator<T>): std.ListIterator<T>
		{
			let ret = super._Erase_by_range(first, last);

			this._Notify_erase(first, last);

			return ret;
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private _Notify_insert(first: std.ListIterator<T>, last: std.ListIterator<T>): void
		{
			ICollection._Dispatch_CollectionEvent(this, "insert", first, last);
		}

		/**
		 * @hidden
		 */
		private _Notify_erase(first: std.ListIterator<T>, last: std.ListIterator<T>): void
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
		public refresh(it: std.ListIterator<T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.ListIterator<T>, last: std.ListIterator<T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.ListIterator<T>;
			let last: std.ListIterator<T>;

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

		public addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object = null): void
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

		public removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}