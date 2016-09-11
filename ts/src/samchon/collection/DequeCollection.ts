/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link Deque} who can detect element I/O events.
	 * 
	 * <p> Below are list of methods who are dispatching {@link CollectionEvent}: </p>
	 * 
	 * <ul>
	 *	<li> <i>insert</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link insert} </li>
	 *		<li> {@link push} </li>
	 *		<li> {@link push_front} </li>
	 *		<li> {@link push_back} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link clear} </li>
	 *		<li> {@link erase} </li>
	 *		<li> {@link pop_front} </li>
	 *		<li> {@link pop_back} </li>
	 *	</ul></li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class DequeCollection<T>
		extends std.Deque<T>
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
		protected _Insert_by_repeating_val(position: std.DequeIterator<T>, n: number, val: T): std.DequeIterator<T>
		{
			let ret = super._Insert_by_repeating_val(position, n, val);

			this.notify_insert(ret, ret.advance(n));

			return ret;
		}

		/**
		 * @hidden
		 */
		protected _Insert_by_range<U extends T, InputIterator extends std.Iterator<U>>
			(position: std.DequeIterator<T>, begin: InputIterator, end: InputIterator): std.DequeIterator<T>
		{
			let n: number = this.size();

			let ret = super._Insert_by_range(position, begin, end);
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
		protected _Erase_by_range(first: std.DequeIterator<T>, last: std.DequeIterator<T>): std.DequeIterator<T>
		{
			this.notify_erase(first, last);

			return super._Erase_by_range(first, last);
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private notify_insert(first: std.DequeIterator<T>, last: std.DequeIterator<T>): void
		{
			ICollection._Dispatch_CollectionEvent(this, "insert", first, last);
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.DequeIterator<T>, last: std.DequeIterator<T>): void
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
		public refresh(it: std.DequeIterator<T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.DequeIterator<T>, last: std.DequeIterator<T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.DequeIterator<T>;
			let last: std.DequeIterator<T>;

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

			this.dispatchEvent(new CollectionEvent<T>("refresh", first, last));
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