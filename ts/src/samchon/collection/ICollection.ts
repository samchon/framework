/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * An interface for {@link IContainer containers} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICollection<T>
		extends std.base.IContainer<T>, library.IEventDispatcher
	{
		/* ---------------------------------------------------------
			REFRESH
		--------------------------------------------------------- */
		refresh(): void;

		refresh(first: std.Iterator<T>, last: std.Iterator<T>): void;

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener): void;
		addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener): void;
		removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
	}
}