/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link TreeMap} who can detect element I/O events.
	 * 
	 * Below is the list of methods who are dispatching {@link MapCollectionEvent}:
	 * - *insert* typed events: 
	 *   - {@link assign}
	 *   - {@link insert}
	 *   - {@link insert_or_assign}
	 *   - {@link emplace}
	 *   - {@link set}
	 *   - {@link push}
	 * - *erase* typed events: 
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 *   - {@link extract}
	 * - *refresh* typed events: 
	 *   - {@link refresh}
	 *
	 * #### [Inherited]
	 * {@link TreeMap TreeMaps} are associative containers that store elements formed by a combination of a 
	 * *key value* (*Key*) and a *mapped value* (*T*), following order. 
	 *
	 * In a {@link TreeMap}, the *key values* are generally used to sort and uniquely identify the elements, while the 
	 * *mapped values* store the content associated to this key. The types of *key* and *mapped value* may differ, and 
	 * are grouped together in member type *value_type*, which is a {@link Pair} type combining both: 
	 *
	 * ```typedef Pair<Key, T> value_type;```
	 *
	 * Internally, the elements in a {@link TreeMap} are always sorted by its *key* following a *strict weak ordering* 
	 * criterion indicated by its internal comparison method {@link less}.
	 *
	 * {@link TreeMap} containers are generally slower than {@link HashMap HashMap} containers to access individual
	 * elements by their *key*, but they allow the direct iteration on subsets based on their order. 
	 *
	 * {@link TreeMap}s are typically implemented as binary search trees. 
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
	 *	<dt> Ordered </dt>
	 *	<dd> The elements in the container follow a strict order at all times. All inserted elements are
	 *		 given a position in this order. </dd>
	 *
	 *	<dt> Map </dt>
	 *	<dd> Each element associates a *key* to a *mapped value*:
	 *		 *Keys* are meant to identify the elements whose main content is the *mapped value*. </dd>
	 *
	 *	<dt> Unique keys </dt>
	 *	<dd> No two elements in the container can have equivalent *keys*. </dd>
	 * </dl>
	 *
	 * @param <Key> Type of the keys. Each element in a map is uniquely identified by its key value.
	 * @param <T> Type of the mapped value. Each element in a map stores some data as its mapped value.
	 *
	 * @reference http://www.cplusplus.com/reference/map/map
	 * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeMapCollection<Key, T>
		extends std.TreeMap<Key, T>
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