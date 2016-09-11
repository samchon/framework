/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * A {@link HashMultiMap} who can detect element I/O events.
	 * 
	 * <ul>
	 *	<li> <i>insert</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link insert} </li>
	 *		<li> {@link push} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link clear} </li>
	 *		<li> {@link erase} </li>
	 *	</ul></li>
	 * </ul>
	 * 
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