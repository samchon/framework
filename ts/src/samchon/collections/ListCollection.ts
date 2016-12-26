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
	 * {@link List Lists} are sequence containers that allow constant time insert and erase operations anywhere within 
	 * the sequence, and iteration in both directions.
	 *
	 * List containers are implemented as doubly-linked lists; Doubly linked lists can store each of the elements they
	 * contain in different and unrelated storage locations. The ordering is kept internally by the association to 
	 * each element of a link to the element preceding it and a link to the element following it.
	 *
	 * They are very similar to forward_list: The main difference being that forward_list objects are single-linked
	 * lists, and thus they can only be iterated forwards, in exchange for being somewhat smaller and more efficient.
	 *
	 * Compared to other base standard sequence containers (array, vector and deque), lists perform generally better
	 * in inserting, extracting and moving elements in any position within the container for which an iterator has 
	 * already been obtained, and therefore also in algorithms that make intensive use of these, like sorting 
	 * algorithms.
	 *
	 * The main drawback of lists and forward_lists compared to these other sequence containers is that they lack 
	 * direct access to the elements by their position; For example, to access the sixth element in a list, one has to
	 * iterate from a known position (like the beginning or the end) to that position, which takes linear time in the
	 * distance between these. They also consume some extra memory to keep the linking information associated to each
	 * element (which may be an important factor for large lists of small-sized elements).
	 *
	 * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" target="_blank">
	 * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" style="max-width: 100%" />
	 * </a>
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 * 	<dt> Sequence </dt>
	 * 	<dd> Elements in sequence containers are ordered in a strict linear sequence. Individual elements are accessed by
	 *		 their position in this sequence. </dd>
	 *
	 * 	<dt> Doubly-linked list </dt>
	 *	<dd> Each element keeps information on how to locate the next and the previous elements, allowing constant time
	 *		 insert and erase operations before or after a specific element (even of entire ranges), but no direct random
	 *		 access. </dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements.
	 *
	 * @reference http://www.cplusplus.com/reference/list/list/
	 * @handbook [Collections](https://github.com/samchon/framework/wiki/TypeScript-STL#collections)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ListCollection<T>
		extends std.List<T>
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
		public push(...items: T[]): number
		{
			let ret = super.push(...items);

			this._Notify_insert(this.end().advance(-items.length), this.end());

			return ret;
		}
		
		/**
		 * @hidden
		 */
		protected _Insert_by_repeating_val(position: std.ListIterator<T>, n: number, val: T): std.ListIterator<T>
		{
			let ret = super._Insert_by_repeating_val(position, n, val);

			this._Notify_insert(ret, ret.advance(n));

			return ret;
		}

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