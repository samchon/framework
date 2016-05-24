declare namespace samchon.collection {
    class ArrayCollection<T> extends std.Vector<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        push<U extends T>(...items: U[]): number;
        /**
         * @inheritdoc
         */
        push_back(val: T): void;
        /**
         * @hidden
         */
        protected insert_by_repeating_val(position: std.VectorIterator<T>, n: number, val: T): std.VectorIterator<T>;
        /**
         * @hidden
         */
        protected insert_by_range<U extends T, InputIterator extends std.Iterator<U>>(position: std.VectorIterator<T>, begin: InputIterator, end: InputIterator): std.VectorIterator<T>;
        /**
         * @inheritdoc
         */
        pop_back(): void;
        /**
         * @hidden
         */
        protected erase_by_range(first: std.VectorIterator<T>, last: std.VectorIterator<T>): std.VectorIterator<T>;
        /**
         * @hidden
         */
        private notify_insert(first, last);
        /**
         * @hidden
         */
        private notify_erase(first, last);
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        unshift<U extends T>(...items: U[]): number;
        /**
         * @inheritdoc
         */
        pop(): T;
        /**
         * @inheritdoc
         */
        splice(start: number): T[];
        /**
         * @inheritdoc
         */
        splice(start: number, deleteCount: number, ...items: T[]): T[];
    }
}
declare namespace samchon.collection {
    interface CollectionEventListener<T> extends EventListener {
        (event: CollectionEvent<T>): void;
    }
    class CollectionEvent<T> extends library.BasicEvent {
        static INSERT: string;
        static ERASE: string;
        private first_;
        private last_;
        constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>);
        container: ICollection<T>;
        first: std.Iterator<T>;
        last: std.Iterator<T>;
    }
}
declare namespace samchon.collection {
    class DequeCollection<T> extends std.Deque<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        push<U extends T>(...items: U[]): number;
        /**
         * @inheritdoc
         */
        push_back(val: T): void;
        /**
         * @hidden
         */
        protected insert_by_repeating_val(position: std.DequeIterator<T>, n: number, val: T): std.DequeIterator<T>;
        /**
         * @hidden
         */
        protected insert_by_range<U extends T, InputIterator extends std.Iterator<U>>(position: std.DequeIterator<T>, begin: InputIterator, end: InputIterator): std.DequeIterator<T>;
        /**
         * @inheritdoc
         */
        pop_back(): void;
        /**
         * @hidden
         */
        protected erase_by_range(first: std.DequeIterator<T>, last: std.DequeIterator<T>): std.DequeIterator<T>;
        /**
         * @hidden
         */
        private notify_insert(first, last);
        /**
         * @hidden
         */
        private notify_erase(first, last);
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    class HashMapCollection<Key, T> extends std.HashMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        get_insert_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
    class HashMultiMapCollection<Key, T> extends std.HashMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        get_insert_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    class HashSetCollection<T> extends std.TreeSet<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
    class HashMultiSetCollection<T> extends std.TreeMultiSet<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    interface CollectionHandler<T> {
        (first: std.Iterator<T>, last: std.Iterator<T>): void;
    }
    interface MapCollectionHandler<Key, T> extends CollectionHandler<std.Pair<Key, T>> {
        (first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
    }
    interface ICollection<T> extends std.base.IContainer<T>, library.IEventDispatcher {
        get_insert_handler(): CollectionHandler<T>;
        get_erase_handler(): CollectionHandler<T>;
        set_insert_handler(listener: CollectionHandler<T>): any;
        set_erase_handler(listener: CollectionHandler<T>): any;
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
declare namespace samchon.collection {
    class ListCollection<T> extends std.List<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        push<U extends T>(...items: T[]): number;
        /**
         * @inheritdoc
         */
        push_front(val: T): void;
        /**
         * @inheritdoc
         */
        push_back(val: T): void;
        /**
         * @hidden
         */
        protected insert_by_repeating_val(position: std.ListIterator<T>, n: number, val: T): std.ListIterator<T>;
        /**
         * @hidden
         */
        protected insert_by_range<U extends T, InputIterator extends std.Iterator<U>>(position: std.ListIterator<T>, begin: InputIterator, end: InputIterator): std.ListIterator<T>;
        /**
         * @inheritdoc
         */
        pop_front(): void;
        /**
         * @inheritdoc
         */
        pop_back(): void;
        /**
         * @hidden
         */
        protected erase_by_range(first: std.ListIterator<T>, last: std.ListIterator<T>): std.ListIterator<T>;
        /**
         * @hidden
         */
        private notify_insert(first, last);
        /**
         * @hidden
         */
        private notify_erase(first, last);
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    class TreeMapCollection<Key, T> extends std.HashMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        get_insert_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
    class TreeMultiMapCollection<Key, T> extends std.HashMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        get_insert_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): MapCollectionHandler<Key, T>;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: MapCollectionHandler<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    class TreeSetCollection<T> extends std.TreeSet<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
    class TreeMultiSetCollection<T> extends std.TreeMultiSet<T> implements ICollection<T> {
        private insert_handler_;
        private erase_handler_;
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        set_insert_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        set_erase_handler(listener: CollectionHandler<T>): void;
        /**
         * @inheritdoc
         */
        get_insert_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        get_erase_handler(): CollectionHandler<T>;
        /**
         * @inheritdoc
         */
        protected handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: "insert" | "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
