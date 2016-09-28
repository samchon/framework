/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link HashSet} who can detect element I/O events.
	 * 
	 * Below is the list of methods who are dispatching {@link CollectionEvent}:
	 * - *insert* typed events: 
	 *   - {@link assign}
	 *   - {@link insert}
	 *   - {@link push}
	 *   - {@link insert_or_assign}
	 * - *erase* typed events: 
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 *   - {@link extract}
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 * 
	 * #### [Inherited] {@link HashSet}
	 * {@link HashSet HashSets} are containers that store unique elements in no particular order, and which allow for 
	 * fast retrieval of individual elements based on their value.
	 *
	 * In an {@link HashSet}, the value of an element is at the same time its *key*, that identifies it uniquely. 
	 * Keys are immutable, therefore, the elements in an {@link HashSet} cannot be modified once in the container - 
	 * they can be inserted and removed, though. 
	 *
	 * Internally, the elements in the {@link HashSet} are not sorted in any particular order, but organized into 
	 * buckets depending on their hash values to allow for fast access to individual elements directly by their 
	 * *values* (with a constant average time complexity on average). 
	 *
	 * {@link HashSet} containers are faster than {@link TreeSet} containers to access individual elements by their 
	 * *key*, although they are generally less efficient for range iteration through a subset of their elements. 
	 *
	 * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" target="_blank">
	 * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" style="max-width: 100%" />
	 * </a> 
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> Elements in associative containers are referenced by their *key* and not by their absolute
	 *		 position in the container. </dd>
	 *
	 *	<dt> Hashed </dt>
	 *	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements
	 *		 by their *key*. </dd>
	 *
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the *key* used to identify it. </dd>
	 *
	 *	<dt> Unique keys </dt>
	 *	<dd> No two elements in the container can have equivalent *keys*. </dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements.
	 *			  Each element in an {@link HashSet} is also uniquely identified by this value.
	 *
	 * @reference http://www.cplusplus.com/reference/unordered_set/unordered_set
	 * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class HashSetCollection<T>
		extends std.HashSet<T>
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
				- HANDLE_INSERT & HANDLE_ERASE
		============================================================
			HANDLE_INSERT & HANDLE_ERASE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected _Handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			super._Handle_insert(first, last);

			ICollection._Dispatch_CollectionEvent(this, "insert", first, last);
		}

		/**
		 * @inheritdoc
		 */
		protected _Handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			super._Handle_erase(first, last);

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
		public refresh(it: std.SetIterator<T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.SetIterator<T>;
			let last: std.SetIterator<T>;

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