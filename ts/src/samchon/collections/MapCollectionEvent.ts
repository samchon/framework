/// <reference path="../API.ts" />

/// <reference path="CollectionEvent.ts" />

namespace samchon.collections
{
	export type MapCollectionEventListener<Key, T> = (event: MapCollectionEvent<Key, T>) => void;

	/**
	 * An event occured in a {@link MapContainer map container} object.
	 * 
	 * @handbook [Collections](https://github.com/samchon/framework/wiki/TypeScript-STL#collections)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MapCollectionEvent<Key, T> 
		extends CollectionEvent<std.Entry<Key, T>>
	{
		// using super::constructor
		
		/**
		 * @inheritdoc
		 */
		public get first(): std.base.MapIterator<Key, T, std.base.IMapContainer<Key, T>>
		{
			return this["first_"] as std.base.MapIterator<Key, T, std.base.IMapContainer<Key, T>>
		}

		/**
		 * @inheritdoc
		 */
		public get last(): std.base.MapIterator<Key, T, std.base.IMapContainer<Key, T>>
		{
			return this["last_"] as std.base.MapIterator<Key, T, std.base.IMapContainer<Key, T>>
		}
	}
}