/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link HashMultiMap} who can detect element I/O events.
	 * 
	 * Below is the list of methods who are dispatching {@link MapCollectionEvent}:
	 * - *insert* typed events: 
	 *   - {@link assign}
	 *   - {@link insert}
	 *   - {@link emplace}
	 *   - {@link push}
	 * - *erase* typed events: 
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 * 
	 * #### [Inherited]
	 * {@link HashMultiMap HashMultiMap}s are associative containers that store elements formed by the combination of
	 * a *key value* and a *mapped value*, much like {@link HashMultiMap} containers, but allowing different elements 
	 * to have equivalent *keys*. 
	 *
	 * In an {@link HashMultiMap}, the *key value* is generally used to uniquely identify the element, while the 
	 * *mapped value* is an object with the content associated to this *key*. Types of *key* and *mapped value* may 
	 * differ. 
	 *
	 * Internally, the elements in the {@link HashMultiMap} are not sorted in any particular order with respect to 
	 * either their *key* or *mapped values*, but organized into *buckets* depending on their hash values to allow for 
	 * fast access to individual elements directly by their *key values* (with a constant average time complexity on 
	 * average). 
	 *
	 * Elements with equivalent *keys* are grouped together in the same bucket and in such a way that an iterator can 
	 * iterate through all of them. Iterators in the container are doubly linked iterators. 
	 *
	 * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" target="_blank">
	 * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" style="max-width: 100%" /> 
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
	 *	<dt> Map </dt>
	 *	<dd> Each element associates a *key* to a *mapped value*:
	 *		 *Keys* are meant to identify the elements whose main content is the *mapped value*. </dd>
	 *
	 *	<dt> Multiple equivalent keys </dt>
	 *	<dd> The container can hold multiple elements with equivalent *keys*. </dd>
	 * </dl>
	 *
	 * @param <Key> Type of the key values.
	 *				Each element in an {@link HashMultiMap} is identified by a key value.
	 * @param <T> Type of the mapped value.
	 *			  Each element in an {@link HashMultiMap} is used to store some data as its mapped value.
	 *
	 * @reference http://www.cplusplus.com/reference/unordered_map/unordered_multimap
	 * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class HashMultiMapCollection<Key, T>
		extends std.HashMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
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
		protected _Handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super._Handle_insert(first, last);

			ICollection._Dispatch_MapCollectionEvent(this, "insert", first, last);
		}

		/**
		 * @inheritdoc
		 */
		protected _Handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super._Handle_erase(first, last);

			ICollection._Dispatch_MapCollectionEvent(this, "erase", first, last);
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
		public refresh(it: std.MapIterator<Key, T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.MapIterator<Key, T>;
			let last: std.MapIterator<Key, T>;

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

			this.dispatchEvent(new MapCollectionEvent<Key, T>("refresh", first, last));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: library.BasicEventListener): void;
		public addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
		public addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
		public addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		public addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
		public addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
		public addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;

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
		public removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
		public removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
		public removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		public removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
		public removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
		public removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;

		public removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}