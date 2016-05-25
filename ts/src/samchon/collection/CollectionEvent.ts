/// <reference path="../API.ts" />

namespace samchon.collection
{
	export interface CollectionEventListener<T> extends EventListener
	{
		(event: CollectionEvent<T>): void;
	}

	export class CollectionEvent<T>
		extends library.BasicEvent
	{
		public static get INSERT(): string
		{
			return "insert";
		}
		public static get ERASE(): string
		{
			return "erase";
		}

		private first_: std.Iterator<T>;
		private last_: std.Iterator<T>;

		public constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>)
		{
			super(type);

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
	}
}