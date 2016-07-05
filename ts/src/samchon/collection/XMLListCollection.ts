/// <reference path="../API.ts" />

/// <reference path="../library/XML.ts" />

namespace samchon.collection
{
	export class XMLListCollection
		extends library.XMLList
		implements ICollection<library.XML>
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
		public push<U extends library.XML>(...items: U[]): number
		{
			let ret = super.push(...items);

			this.notify_insert(this.end().advance(-items.length), this.end());

			return ret;
		}

		/**
		 * @inheritdoc
		 */
		public push_back(val: library.XML): void
		{
			super.push(val);

			this.notify_insert(this.end().prev(), this.end());
		}

		/**
		 * @hidden
		 */
		protected insert_by_repeating_val(position: std.VectorIterator<library.XML>, n: number, val: library.XML): std.VectorIterator<library.XML>
		{
			let ret = super.insert_by_repeating_val(position, n, val);

			this.notify_insert(ret, ret.advance(n));
			
			return ret;
		}

		/**
		 * @hidden
		 */
		protected insert_by_range<U extends library.XML, InputIterator extends std.Iterator<U>>
			(position: std.VectorIterator<library.XML>, begin: InputIterator, end: InputIterator): std.VectorIterator<library.XML>
		{
			let n: number = this.size();

			let ret = super.insert_by_range(position, begin, end);
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
		protected erase_by_range(first: std.VectorIterator<library.XML>, last: std.VectorIterator<library.XML>): std.VectorIterator<library.XML>
		{
			this.notify_erase(first, last);

			return super.erase_by_range(first, last);
		}

		/* ---------------------------------------------------------
			NOTIFIER
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private notify_insert(first: std.VectorIterator<library.XML>, last: std.VectorIterator<library.XML>): void
		{
			if (this.hasEventListener(CollectionEvent.INSERT))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.INSERT, first, last));
		}

		/**
		 * @hidden
		 */
		private notify_erase(first: std.VectorIterator<library.XML>, last: std.VectorIterator<library.XML>): void
		{
			if (this.hasEventListener(CollectionEvent.ERASE))
				this.dispatchEvent(new CollectionEvent(CollectionEvent.ERASE, first, last));
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
		public dispatchEvent(event: Event): boolean
		{
			return this.event_dispatcher_.dispatchEvent(event);
		}

		/**
		 * @inheritdoc
		 */
		public refresh(): void
		{
			this.dispatchEvent(new CollectionEvent<library.XML>(CollectionEvent.REFRESH, this.begin(), this.end()));
		}

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		public addEventListener(type: string, listener: EventListener, thisArg: Object): void;

		public addEventListener(type: string, listener: EventListener, thisArg: Object = null): void
		{
			this.event_dispatcher_.addEventListener(type, listener, thisArg);
		}

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		public removeEventListener(type: string, listener: EventListener, thisArg: Object): void;

		public removeEventListener(type: string, listener: EventListener, thisArg: Object = null): void
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
		public unshift<U extends library.XML>(...items: U[]): number
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
		public pop(): library.XML
		{
			this.notify_erase(this.end().prev(), this.end());

			return super.pop();
		}

		/**
		 * @inheritdoc
		 */
		public splice(start: number): library.XML[];
		
		/**
		 * @inheritdoc
		 */
		public splice(start: number, deleteCount: number, ...items: library.XML[]): library.XML[];

		public splice(start: number, deleteCount: number = this.size() - start, ...items: library.XML[]): library.XML[]
		{
			// FILTER
			if (start + deleteCount > this.size())
				deleteCount = this.size() - start;

			// NOTIFY ERASE
			let first = new std.VectorIterator<library.XML>(this, start);
			let last = first.advance(deleteCount);

			this.notify_erase(first, last);

			// CALL SUPER::ERASE
			return super.splice(start, deleteCount, ...items);
		}
	}
}