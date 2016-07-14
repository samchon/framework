/// <reference path="../API.ts" />

/// <reference path="../library/Event.ts" />

namespace samchon.collection
{
	/**
	 * Type of function pointer for {@link CollectionEvent CollectionEvents}.
	 */
	export interface CollectionEventListener<T> extends EventListener
	{
		(event: CollectionEvent<T>): void;
	}
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
		private first_: std.Iterator<T>;

		/**
		 * @hidden
		 */
		private last_: std.Iterator<T>;
		
		/**
		 * 
		 * 
		 * @param type Type of collection event.
		 * @param first 
		 * @param last 
		 */
		public constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>)
		{
			super(type);

			this.first_ = first;
			this.last_ = last;
		}

		/**
		 * Get associative container.
		 */
		public get container(): ICollection<T>
		{
			return this.target as ICollection<T>;
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
	}
}

namespace samchon.collection.CollectionEvent
{
	export const INSERT: string = "insert";
	export const ERASE: string = "erase";
	export const REFRESH: string = "refresh";
}