/// <reference path="../API.ts" />

namespace samchon.collection
{
	export interface CollectionHandler<T>
	{
		(first: std.Iterator<T>, last: std.Iterator<T>): void;
	}

	export interface MapCollectionHandler<Key, T>
		extends CollectionHandler<std.Pair<Key, T>>
	{
		(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
	}

	/**
	 * An interface for {@link IContainer containers} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICollection<T>
		extends std.base.IContainer<T>, library.IEventDispatcher
	{
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		get_insert_handler(): CollectionHandler<T>;

		get_erase_handler(): CollectionHandler<T>;

		set_insert_handler(listener: CollectionHandler<T>);

		set_erase_handler(listener: CollectionHandler<T>);

		/* ---------------------------------------------------------
			EVENT DISPATCHER
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener, thisArg: Object): void;

		addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
		addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener, thisArg: Object): void;

		removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
	}
}