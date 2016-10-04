/// <reference path="../API.ts" />

namespace samchon.collections
{
	/**
	 * A {@link Vector} who can detect element I/O events. 
	 * 
	 * Below is the list of methods who are dispatching {@link CollectionEvent}:
	 * - *insert* typed events:
	 *   - {@link assign} 
	 *   -  {@link insert} 
	 *   -  {@link push} 
	 *   -  {@link push_back} 
	 *   -  {@link unshift} 
	 * - *erase* typed events:
	 *   -  {@link assign} 
	 *   -  {@link clear} 
	 *   -  {@link erase} 
	 *   - {@link pop_back} 
	 *   - {@link shift} 
	 *   - {@link pop} 
	 *   - {@link splice} 
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 * 
	 * #### [Inherited] {@link Vector}
	 * {@link Vector Vectors}s are sequence containers representing arrays that can change in size.
	 *
	 * Just like arrays, {@link Vector}s use contiguous storage locations for their elements, which means that their 
	 * elements can also be accessed using offsets on regular pointers to its elements, and just as efficiently as in 
	 * arrays. But unlike arrays, their size can change dynamically, with their storage being handled automatically 
	 * by the container.
	 *
	 * Internally, {@link Vector}s use a dynamically allocated array to store their elements. This array may need to
	 * be reallocated in order to grow in size when new elements are inserted, which implies allocating a new array 
	 * and moving all elements to it. This is a relatively expensive task in terms of processing time, and thus, 
	 * {@link Vector}s do not reallocate each time an element is added to the container.
	 *
	 * Instead, {@link Vector} containers may allocate some extra storage to accommodate for possible growth, and 
	 * thus the container may have an actual {@link capacity} greater than the storage strictly needed to contain its
	 * elements (i.e., its {@link size}). Libraries can implement different strategies for growth to balance between
	 * memory usage and reallocations, but in any case, reallocations should only happen at logarithmically growing
	 * intervals of {@link size} so that the insertion of individual elements at the end of the {@link Vector} can be
	 * provided with amortized constant time complexity (see {@link push_back push_back()}).
	 *
	 * Therefore, compared to arrays, {@link Vector}s consume more memory in exchange for the ability to manage 
	 * storage and grow dynamically in an efficient way.
	 *
	 * Compared to the other dynamic sequence containers ({@link Deque}s, {@link List}s), {@link Vector Vectors} are
	 * very efficient accessing its elements (just like arrays) and relatively efficient adding or removing elements 
	 * from its end. For operations that involve inserting or removing elements at positions other than the end, they 
	 * perform worse than the others, and have less consistent iterators and references than {@link List}s.
	 *
	 * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" target="_blank">
	 * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" style="max-width: 100%" />
	 * </a>
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Sequence </dt>
	 *	<dd>
	 *		Elements in sequence containers are ordered in a strict linear sequence. Individual elements are
	 *		accessed by their position in this sequence.
	 *	</dd>
	 *
	 *	<dt> Dynamic array </dt>
	 *	<dd>
	 *		Allows direct access to any element in the sequence, even through pointer arithmetics, and provides
	 *		relatively fast addition/removal of elements at the end of the sequence.
	 *	</dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements.
	 *
	 * @reference http://www.cplusplus.com/reference/vector/vector
	 * @handbook [Collections](https://github.com/samchon/framework/wiki/TypeScript-STL#collections)
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
			super.push_back(val);

			this.notify_insert(this.end().prev(), this.end());
		}

		/**
		 * @hidden
		 */
		protected _Insert_by_repeating_val(position: std.VectorIterator<T>, n: number, val: T): std.VectorIterator<T>
		{
			let ret = super._Insert_by_repeating_val(position, n, val);

			this.notify_insert(ret, ret.advance(n));
			
			return ret;
		}

		/**
		 * @hidden
		 */
		protected _Insert_by_range<U extends T, InputIterator extends std.Iterator<U>>
			(position: std.VectorIterator<T>, begin: InputIterator, end: InputIterator): std.VectorIterator<T>
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
		 * @hidden
		 */
		protected _Erase_by_range(first: std.VectorIterator<T>, last: std.VectorIterator<T>): std.VectorIterator<T>
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
		private notify_insert(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
		{
			ICollection._Dispatch_CollectionEvent(this, "insert", first, last);
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
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