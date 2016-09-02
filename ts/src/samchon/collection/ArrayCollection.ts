/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link Vector} who can detect element I/O events. 
	 * 
	 * <ul>
	 *	<li> <i>insert</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link insert} </li>
	 *		<li> {@link push} </li>
	 *		<li> {@link push_back} </li>
	 *		<li> {@link unshift} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link clear} </li>
	 *		<li> {@link erase} </li>
	 *		<li> {@link pop_back} </li>
	 *		<li> {@link shift} </li>
	 *		<li> {@link pop} </li>
	 *		<li> {@link splice} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link sort} </li>
	 *	</ul></li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ArrayCollection<T>
		extends std.Vector<T>
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
			super.push_back(val);

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
			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
		{
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
		public refresh(it: std.VectorIterator<T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.VectorIterator<T>;
			let last: std.VectorIterator<T>;

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