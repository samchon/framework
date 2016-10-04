/// <reference path="../API.ts" />

namespace samchon.collections
{
	/**
	 * A {@link TreeMultiSet} who can detect element I/O events.
	 * 
	 * Below is the list of methods who are dispatching {@link CollectionEvent}:
	 * - *insert* typed events: 
	 *   - {@link assign}
	 *   - {@link insert}
	 *   - {@link push}
	 * - *erase* typed events: 
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 * 
	 * #### [Inherited] {@link TreeMultiSet}
	 * {@link TreeMultiSet TreeMultiSets} are containers that store elements following a specific order, and where 
	 * multiple elements can have equivalent values.
	 *
	 * In a {@link TreeMultiSet}, the value of an element also identifies it (the value is itself the *key*, of type 
	 * *T*). The value of the elements in a {@link TreeMultiSet} cannot be modified once in the container (the 
	 * elements are always const), but they can be inserted or removed from the container.
	 *
	 * Internally, the elements in a {@link TreeMultiSet TreeMultiSets} are always sorted following a strict weak 
	 * ordering criterion indicated by its internal comparison method (of {@link IComparable.less less}).
	 *
	 * {@link TreeMultiSet} containers are generally slower than {@link HashMultiSet} containers to access individual 
	 * elements by their *key*, but they allow the direct iteration on subsets based on their order.
	 *
	 * <p> {@link TreeMultiSet TreeMultiSets} are typically implemented as binary search trees. </p>
	 *
	 * <p> <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" target="_blank">
	 * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" style="max-width: 100%" /> </a></p>
	 *
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd>
	 *		Elements in associative containers are referenced by their *key* and not by their absolute
	 *		position in the container.
	 *	</dd>
	 *
	 *	<dt> Ordered </dt>
	 *	<dd>
	 *		The elements in the container follow a strict order at all times. All inserted elements are
	 *		given a position in this order.
	 *	</dd>
	 *
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the *key* used to identify it. </dd>
	 *
	 *	<dt> Multiple equivalent keys </dt>
	 *	<dd> Multiple elements in the container can have equivalent *keys*. </dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements. Each element in a {@link TreeMultiSet} container is also identified
	 *			  by this value (each value is itself also the element's *key*).
	 *
	 * @reference http://www.cplusplus.com/reference/set/multiset
	 * @handbook [Collections](https://github.com/samchon/framework/wiki/TypeScript-STL#collections)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class TreeMultiSetCollection<T>
		extends std.TreeMultiSet<T>
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