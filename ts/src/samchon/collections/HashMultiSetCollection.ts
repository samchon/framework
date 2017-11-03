/// <reference path="../API.ts" />

namespace samchon.collections
{
	/**
	 * A {@link HashMultiSet} who can detect element I/O events.
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
	 * #### [Inherited] {@link HashMultiSet}
	 * @copydoc HashMultiSet
	 */
	export class HashMultiSetCollection<T>
		extends std.HashMultiSet<T>
		implements ICollection<T>
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
		protected _Handle_insert(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void
		{
			super._Handle_insert(first, last);

			ICollection._Dispatch_CollectionEvent<T>(this, "insert", first, last);
		}

		/**
		 * @hidden
		 */
		protected _Handle_erase(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void
		{
			super._Handle_erase(first, last);

			ICollection._Dispatch_CollectionEvent<T>(this, "erase", first, last);
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
		public refresh(it: std.HashMultiSet.Iterator<T>): void;

		/**
		 * @inheritdoc
		 */
		public refresh(first: std.HashMultiSet.Iterator<T>, last: std.HashMultiSet.Iterator<T>): void;

		public refresh(...args: any[]): void
		{
			let first: std.HashMultiSet.Iterator<T>;
			let last: std.HashMultiSet.Iterator<T>;

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

			ICollection._Dispatch_CollectionEvent<T>(this, "refresh", first, last);
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

		public removeEventListener<Listener extends library.BasicEventListener>
			(type: string, listener: Listener, thisArg: Object = null): void
		{
			this.event_dispatcher_.removeEventListener(type, listener, thisArg);
		}
	}
}