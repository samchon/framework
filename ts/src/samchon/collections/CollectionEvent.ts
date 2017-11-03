/// <reference path="../API.ts" />

/// <reference path="../library/events/BasicEvent.ts" />

namespace samchon.collections
{
	/**
	 * Type of function pointer for listener of {@link CollectionEvent CollectionEvents}.
	 */
	export type CollectionEventListener<T> = (event: CollectionEvent<T>) => void;
}

namespace samchon.collections
{	
	/**
	 * An event occured in a {@link ICollection collection} object.
	 * 
	 * @handbook [Collections](https://github.com/samchon/framework/wiki/TypeScript-STL#collections)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class CollectionEvent<T>
		extends library.BasicEvent
	{
		/**
		 * @hidden
		 */
		private first_: std.base.Iterator<T>;

		/**
		 * @hidden
		 */
		private last_: std.base.Iterator<T>;

		/**
		 * @hidden
		 */
		private temporary_container_: std.Vector<T>;

		/**
		 * @hidden
		 */
		private origin_first_: std.base.Iterator<T>;

		/**
		 * Initialization Constructor.
		 * 
		 * @param type Type of collection event.
		 * @param first An {@link Iterator} to the initial position in this {@link CollectionEvent}.
		 * @param last An {@link Iterator} to the final position in this {@link CollectionEvent}.
		 */
		public constructor(type: string, first: std.base.Iterator<T>, last: std.base.Iterator<T>);

		public constructor(type: "insert", first: std.base.Iterator<T>, last: std.base.Iterator<T>);
		public constructor(type: "erase", first: std.base.Iterator<T>, last: std.base.Iterator<T>);
		public constructor(type: "refresh", first: std.base.Iterator<T>, last: std.base.Iterator<T>);

		public constructor(type: string, first: std.base.Iterator<T>, last: std.base.Iterator<T>)
		{
			super(type, false, (type == "insert" || type == "erase"));

			if (type == "erase" && first instanceof std.base.ArrayIterator)
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
		 * Associative target, the {@link ICollection collection}.
		 */
		public get target(): ICollection<T>
		{
			return this.target_ as ICollection<T>;
		}

		/**
		 * An {@link Iterator} to the initial position in this {@link CollectionEvent}.
		 */
		public get first(): std.base.Iterator<T>
		{
			return this.first_;
		}

		/**
		 * An {@link Iterator} to the final position in this {@link CollectionEvent}.
		 */
		public get last(): std.base.Iterator<T>
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
				let it: std.Vector.Iterator<T>;

				if (this.temporary_container_ == null)
					it = this.first_.prev().next() as std.Vector.Iterator<T>;
				else
					it = this.origin_first_.prev().next() as std.Vector.Iterator<T>;
				
				container.insert(it, this.first_, this.last_);
			}
			this.defaultPrevented_ = false;
		}
	}
}

namespace samchon.collections.CollectionEvent
{
	export const INSERT: "insert" = "insert";
	export const ERASE: "erase" = "erase";
	export const REFRESH: "refresh" = "refresh";
}