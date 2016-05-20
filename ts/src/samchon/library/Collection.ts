namespace samchon.library
{
	export class CollectionEvent<T>
		extends BasicEvent
	{
		private first_: std.Iterator<T>;

		private last_: std.Iterator<T>;

		public constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>)
		{
			super(type, false, true);

			this.first_ = first;
			this.last_ = last;
		}

		public get container(): ICollection<T>
		{
			return this.target as ICollection<T>;
		}

		public get first(): std.Iterator<T>
		{
			return this.first_;
		}

		public get last(): std.Iterator<T>
		{
			return this.last_;
		}

		public static get ADDED(): string
		{
			return "inserted";
		}
		public static get REMOVED(): string
		{
			return "removed";
		}
	}

	export interface ICollection<T> 
		extends std.base.IContainer<T>, IEventDispatcher
	{
	}

	/* =============================================================
		LINEAR COLLECTIONS
	============================================================= */
	export class ArrayCollection<T>
		extends std.Vector<T>
		implements ICollection<T>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class DequeCollection<T>
		extends std.Deque<T>
		implements ICollection<T>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.DequeIterator<T>, last: std.DequeIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.DequeIterator<T>, last: std.DequeIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class ListCollection<T>
		extends std.List<T>
		implements IEventDispatcher
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.ListIterator<T>, last: std.ListIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.ListIterator<T>, last: std.ListIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	/* =============================================================
		SET COLLECTIONS
			- HASH_SET
			- TREE_SET
	============================================================= */
	export class HashSetCollection<T>
		extends std.HashSet<T>
		implements ICollection<T>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class HashMultiSetCollection<T>
		extends std.HashMultiSet<T>
		implements ICollection<T>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class TreeSetCollection<T>
		extends std.TreeSet<T>
		implements ICollection<T>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class TreeMultiSetCollection<T>
		extends std.TreeMultiSet<T>
		implements ICollection<T>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void
		{
			let event = new CollectionEvent<T>(CollectionEvent.REMOVED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	/* =============================================================
		MAP COLLECTIONS
			- HASH_MAP
			- TREE_MAP
	============================================================= */
	export class HashMapCollection<Key, T>
		extends std.HashMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class HashMultiMapCollection<Key, T>
		extends std.HashMultiMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class TreeMapCollection<Key, T>
		extends std.TreeMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}

	export class TreeMultiMapCollection<Key, T>
		extends std.TreeMultiMap<Key, T>
		implements ICollection<std.Pair<Key, T>>
	{
		private eventDispatcher: EventDispatcher = new EventDispatcher(this);

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void
		{
			let event = new CollectionEvent<std.Pair<Key, T>>(CollectionEvent.ADDED, first, last);

			this.dispatchEvent(event);
		}

		/* ---------------------------------------------------------
			I_EVENT_DISPATCHER'S MEMBERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public hasEventListener(type: string): boolean 
		{
			return this.eventDispatcher.hasEventListener(type);
		}

		/**
		 * @inheritdoc
		 */
		public dispatchEvent(event: Event): boolean
		{
			return this.eventDispatcher.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.addEventListener(type, listener, thisArg);
		}

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.eventDispatcher.removeEventListener(type, listener, thisArg);
		}
	}
}