/// <reference path="../API.ts" />

namespace samchon.collections
{
	/**
	 * A {@link HashMap} who can detect element I/O events.
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
	 * #### [Inherited] {@link HashMap}
	 * @copydoc HashMap
	 */
	export class HashMapCollection<Key, T>
		extends std.HashMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
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

		/* ---------------------------------------------------------
			ELEMENTS I/O
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		protected _Handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			super._Handle_insert(first, last);

			ICollection._Dispatch_MapCollectionEvent(this, "insert", first, last);
		}

		/**
		 * @hidden
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

			ICollection._Dispatch_MapCollectionEvent(this, "refresh", first, last);
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

		public addEventListener<Listener extends library.BasicEventListener>
			(type: string, listener: Listener, thisArg: Object = null): void
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

		public removeEventListener<Listener extends library.BasicEventListener>
			(type: string, listener: Listener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}