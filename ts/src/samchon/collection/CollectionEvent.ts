/// <reference path="../API.ts" />

/// <reference path="../library/BasicEvent.ts" />

namespace samchon.collection
{
	/**
	 * Type of function pointer for listener of {@link CollectionEvent CollectionEvents}.
	 */
	export type CollectionEventListener<T> = (event: CollectionEvent<T>) => void;
}

namespace samchon.collection
{	
	/**
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class CollectionEvent<T>
		extends library.BasicEvent
	{
		/**
		 * @hidden
		 */
		protected first_: std.Iterator<T>;

		/**
		 * @hidden
		 */
		protected last_: std.Iterator<T>;

		private temporary_container_: std.Vector<T>;

		private origin_first_: std.Iterator<T>;

		/**
		 * Initialization Constructor.
		 * 
		 * @param type Type of collection event.
		 * @param first 
		 * @param last 
		 */
		public constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>);

		public constructor(type: "insert", first: std.Iterator<T>, last: std.Iterator<T>);
		public constructor(type: "erase", first: std.Iterator<T>, last: std.Iterator<T>);
		public constructor(type: "refresh", first: std.Iterator<T>, last: std.Iterator<T>);

		public constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>)
		{
			super(type, false, (type == "insert" || type == "erase"));

			if (type == "erase" && (first instanceof std.VectorIterator || first instanceof std.DequeIterator))
			{
				this.temporary_container_ = new std.Vector<T>(first, last);
				this.origin_first_ = first;

				this.first_ = this.temporary_container_.begin();
				this.last_ = this.temporary_container_.end();
			}
			else
			{
				this.temporary_container_ = null;
				this.origin_first_ = null;

				this.first_ = first;
				this.last_ = last;
			}
		}

		/**
		 * Get associative target, the container.
		 */
		public get target(): ICollection<T>
		{
			return this["target_"] as ICollection<T>;
		}

		/**
		 * Get range of the first.
		 */
		public get first(): std.Iterator<T>
		{
			return this.first_;
		}

		/**
		 * Get range of the last.
		 */
		public get last(): std.Iterator<T>
		{
			return this.last_;
		}

		/**
		 * @inheritdoc
		 */
		public preventDefault(): void
		{
			if (this.cancelable == false)
				return;

			this.defaultPrevented_ = true;

			if (this.type == "insert")
			{
				this.target.erase(this.first_, this.last_);
			}
			else if (this.type == "erase")
			{
				let container: ArrayCollection<T> = this.target as ArrayCollection<T>;
				let it: std.VectorIterator<T>;

				if (this.temporary_container_ == null)
					it = this.first_.prev().next() as std.VectorIterator<T>;
				else
					it = this.origin_first_.prev().next() as std.VectorIterator<T>;
				
				container.insert(it, this.first_, this.last_);
			}
			this.defaultPrevented_ = false;
		}
	}
}

/**
 * @hidden
 */
namespace samchon.collection.CollectionEvent
{
	export const INSERT: "insert" = "insert";
	export const ERASE: "erase" = "erase";
	export const REFRESH: "refresh" = "refresh";
}