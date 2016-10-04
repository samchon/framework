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
	 * {@link Deque} (usually pronounced like "*deck*") is an irregular acronym of **d**ouble-**e**nded **q**ueue. 
	 * Double-ended queues are sequence containers with dynamic sizes that can be expanded or contracted on both ends 
	 * (either its front or its back).
	 *
	 * Specific libraries may implement deques in different ways, generally as some form of dynamic array. But in any
	 * case, they allow for the individual elements to be accessed directly through random access iterators, with 
	 * storage handled automatically by expanding and contracting the container as needed.
	 *
	 * Therefore, they provide a functionality similar to vectors, but with efficient insertion and deletion of 
	 * elements also at the beginning of the sequence, and not only at its end. But, unlike {@link Vector Vectors},
	 * {@link Deque Deques} are not guaranteed to store all its elements in contiguous storage locations: accessing
	 * elements in a <u>deque</u> by offsetting a pointer to another element causes undefined behavior. 
	 *
	 * Both {@link Vector}s and {@link Deque}s provide a very similar interface and can be used for similar purposes,
	 * but internally both work in quite different ways: While {@link Vector}s use a single array that needs to be
	 * occasionally reallocated for growth, the elements of a {@link Deque} can be scattered in different chunks of
	 * storage, with the container keeping the necessary information internally to provide direct access to any of its
	 * elements in constant time and with a uniform sequential interface (through iterators). Therefore,
	 * {@link Deque Deques} are a little more complex internally than {@link Vector}s, but this allows them to grow 
	 * more efficiently under certain circumstances, especially with very long sequences, where reallocations become 
	 * more expensive.
	 *
	 * For operations that involve frequent insertion or removals of elements at positions other than the beginning or
	 * the end, {@link Deque Deques} perform worse and have less consistent iterators and references than
	 * {@link List Lists}.
	 *
	 * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" target="_blank">
	 * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" style="max-width: 100%" /> 
	 * </a>
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Sequence </dt>
	 *	<dd> Elements in sequence containers are ordered in a strict linear sequence. Individual elements
	 *		 are accessed by their position in this sequence. </dd>
	 *
	 *	<dt> Dynamic array </dt>
	 *	<dd> Generally implemented as a dynamic array, it allows direct access to any element in the
	 *		 sequence and provides relatively fast addition/removal of elements at the beginning or the end
	 *		 of the sequence. </dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements.
	 *
	 * @reference http://www.cplusplus.com/reference/deque/deque/
	 * @handbook [Collections](https://github.com/samchon/framework/wiki/TypeScript-STL#collections)
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
		public push(...items: T[]): number
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