// Type definitions for Samchon Framework v2.0.0-beta.8
// Project: https://github.com/samchon/framework
// Definitions by: Jeongho Nam <http://samchon.org>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../typescript-stl/typescript-stl.d.ts" />

declare module "samchon-framework"
{
	export = samchon;
}

/**
 * <h1> Samchon-Framework </h1>
 *
 * <a href="https://nodei.co/npm/samchon-framework">
 *	<img src="https://nodei.co/npm/samchon-framework.png?downloads=true&downloadRank=true&stars=true"> </a>
 *
 * Samchon, a SDN (Software Defined Network) framework.
 *
 * With Samchon Framework, you can implement distributed processing system within framework of OOD like
 * handling S/W objects (classes). You can realize cloud and distributed system very easily with provided
 * system templates and even integration with C++ is possible.
 *
 * The goal, ultimate utilization model of Samchon Framework is, building cloud system with NodeJS and
 * takING heavy works to C++ distributed systems with provided modules (those are system templates).
 *
 * @git https://github.com/samchon/framework
 * @author Jeongho Nam <http://samchon.org>
 */
declare namespace samchon {
    /**
     * Running on Node.
     *
     * Test whether the JavaScript is running on Node.
     *
     * @references http://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
     */
    function is_node(): boolean;
}
declare namespace samchon.collection {
    /**
     * A {@link Vector} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   -  {@link insert}
     *   -  {@link push}
     *   -  {@link push_back}
     *   -  {@link unshift}
     * - *erase* typed events:
     *   -  {@link assign}
     *   -  {@link clear}
     *   -  {@link erase}
     *   - {@link pop_back}
     *   - {@link shift}
     *   - {@link pop}
     *   - {@link splice}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link Vector Vectors}s are sequence containers representing arrays that can change in size.
     *
     * Just like arrays, {@link Vector}s use contiguous storage locations for their elements, which means that their
     * elements can also be accessed using offsets on regular pointers to its elements, and just as efficiently as in
     * arrays. But unlike arrays, their size can change dynamically, with their storage being handled automatically
     * by the container.
     *
     * Internally, {@link Vector}s use a dynamically allocated array to store their elements. This array may need to
     * be reallocated in order to grow in size when new elements are inserted, which implies allocating a new array
     * and moving all elements to it. This is a relatively expensive task in terms of processing time, and thus,
     * {@link Vector}s do not reallocate each time an element is added to the container.
     *
     * Instead, {@link Vector} containers may allocate some extra storage to accommodate for possible growth, and
     * thus the container may have an actual {@link capacity} greater than the storage strictly needed to contain its
     * elements (i.e., its {@link size}). Libraries can implement different strategies for growth to balance between
     * memory usage and reallocations, but in any case, reallocations should only happen at logarithmically growing
     * intervals of {@link size} so that the insertion of individual elements at the end of the {@link Vector} can be
     * provided with amortized constant time complexity (see {@link push_back push_back()}).
     *
     * Therefore, compared to arrays, {@link Vector}s consume more memory in exchange for the ability to manage
     * storage and grow dynamically in an efficient way.
     *
     * Compared to the other dynamic sequence containers ({@link Deque}s, {@link List}s), {@link Vector Vectors} are
     * very efficient accessing its elements (just like arrays) and relatively efficient adding or removing elements
     * from its end. For operations that involve inserting or removing elements at positions other than the end, they
     * perform worse than the others, and have less consistent iterators and references than {@link List}s.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Sequence </dt>
     *	<dd>
     *		Elements in sequence containers are ordered in a strict linear sequence. Individual elements are
     *		accessed by their position in this sequence.
     *	</dd>
     *
     *	<dt> Dynamic array </dt>
     *	<dd>
     *		Allows direct access to any element in the sequence, even through pointer arithmetics, and provides
     *		relatively fast addition/removal of elements at the end of the sequence.
     *	</dd>
     * </dl>
     *
     * @param <T> Type of the elements.
     *
     * @reference http://www.cplusplus.com/reference/vector/vector
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class ArrayCollection<T> extends std.Vector<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        push(...items: T[]): number;
        /**
         * @inheritdoc
         */
        push_back(val: T): void;
        /**
         * @hidden
         */
        protected _Insert_by_repeating_val(position: std.VectorIterator<T>, n: number, val: T): std.VectorIterator<T>;
        /**
         * @hidden
         */
        protected _Insert_by_range<U extends T, InputIterator extends std.Iterator<U>>(position: std.VectorIterator<T>, begin: InputIterator, end: InputIterator): std.VectorIterator<T>;
        /**
         * @hidden
         */
        protected _Erase_by_range(first: std.VectorIterator<T>, last: std.VectorIterator<T>): std.VectorIterator<T>;
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
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.VectorIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.VectorIterator<T>, last: std.VectorIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
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
declare namespace samchon.library {
    /**
     * A basic event class of Samchon Framework.
     *
     * @reference https://developer.mozilla.org/en-US/docs/Web/API/Event
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-EventDispatcher
     * @author Jeongho Nam <http://samchon.org>
     */
    class BasicEvent {
        protected type_: string;
        protected target_: IEventDispatcher;
        private currentTarget_;
        protected trusted_: boolean;
        protected bubbles_: boolean;
        protected cancelable_: boolean;
        protected defaultPrevented_: boolean;
        protected cancelBubble_: boolean;
        private timeStamp_;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @inheritdoc
         */
        initEvent(type: string, bubbles: boolean, cancelable: boolean): void;
        /**
         * @inheritdoc
         */
        /**
         * @inheritdoc
         */
        stopImmediatePropagation(): void;
        /**
         * @inheritdoc
         */
        stopPropagation(): void;
        /**
         * @inheritdoc
         */
        readonly type: string;
        /**
         * @inheritdoc
         */
        target: IEventDispatcher;
        /**
         * @inheritdoc
         */
        readonly currentTarget: IEventDispatcher;
        /**
         * @inheritdoc
         */
        readonly isTrusted: boolean;
        /**
         * @inheritdoc
         */
        readonly bubbles: boolean;
        /**
         * @inheritdoc
         */
        readonly cancelable: boolean;
        /**
         * @inheritdoc
         */
        readonly eventPhase: number;
        /**
         * @inheritdoc
         */
        readonly defaultPrevented: boolean;
        /**
         * @inheritdoc
         */
        readonly srcElement: Element;
        /**
         * @inheritdoc
         */
        readonly cancelBubble: boolean;
        /**
         * @inheritdoc
         */
        readonly timeStamp: number;
        /**
         * Don't know what it is.
         */
        readonly returnValue: boolean;
    }
}
declare namespace samchon.collection {
    /**
     * Type of function pointer for listener of {@link CollectionEvent CollectionEvents}.
     */
    type CollectionEventListener<T> = (event: CollectionEvent<T>) => void;
}
declare namespace samchon.collection {
    /**
     * An event occured in a {@link ICollection collection} object.
     *
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class CollectionEvent<T> extends library.BasicEvent {
        /**
         * @hidden
         */
        private first_;
        /**
         * @hidden
         */
        private last_;
        /**
         * @hidden
         */
        private temporary_container_;
        /**
         * @hidden
         */
        private origin_first_;
        /**
         * Initialization Constructor.
         *
         * @param type Type of collection event.
         * @param first An {@link Iterator} to the initial position in this {@link CollectionEvent}.
         * @param last An {@link Iterator} to the final position in this {@link CollectionEvent}.
         */
        constructor(type: string, first: std.Iterator<T>, last: std.Iterator<T>);
        constructor(type: "insert", first: std.Iterator<T>, last: std.Iterator<T>);
        constructor(type: "erase", first: std.Iterator<T>, last: std.Iterator<T>);
        constructor(type: "refresh", first: std.Iterator<T>, last: std.Iterator<T>);
        /**
         * Associative target, the {@link ICollection collection}.
         */
        readonly target: ICollection<T>;
        /**
         * An {@link Iterator} to the initial position in this {@link CollectionEvent}.
         */
        readonly first: std.Iterator<T>;
        /**
         * An {@link Iterator} to the final position in this {@link CollectionEvent}.
         */
        readonly last: std.Iterator<T>;
        /**
         * @inheritdoc
         */
        preventDefault(): void;
    }
}
/**
 * @hidden
 */
declare namespace samchon.collection.CollectionEvent {
    const INSERT: "insert";
    const ERASE: "erase";
    const REFRESH: "refresh";
}
declare namespace samchon.collection {
    /**
     * A {@link Deque} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link push}
     *   - {@link push_front}
     *   - {@link push_back}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     *   - {@link pop_front}
     *   - {@link pop_back}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link Deque} (usually pronounced like "*deck*") is an irregular acronym of **d**ouble-**e**nded **q**ueue.
     * Double-ended queues are sequence containers with dynamic sizes that can be expanded or contracted on both ends
     * (either its front or its back).
     *
     * Specific libraries may implement deques in different ways, generally as some form of dynamic array. But in any
     * case, they allow for the individual elements to be accessed directly through random access iterators, with
     * storage handled automatically by expanding and contracting the container as needed.
     *
     * Therefore, they provide a functionality similar to vectors, but with efficient insertion and deletion of
     * elements also at the beginning of the sequence, and not only at its end. But, unlike {@link Vector Vectors},
     * {@link Deque Deques} are not guaranteed to store all its elements in contiguous storage locations: accessing
     * elements in a <u>deque</u> by offsetting a pointer to another element causes undefined behavior.
     *
     * Both {@link Vector}s and {@link Deque}s provide a very similar interface and can be used for similar purposes,
     * but internally both work in quite different ways: While {@link Vector}s use a single array that needs to be
     * occasionally reallocated for growth, the elements of a {@link Deque} can be scattered in different chunks of
     * storage, with the container keeping the necessary information internally to provide direct access to any of its
     * elements in constant time and with a uniform sequential interface (through iterators). Therefore,
     * {@link Deque Deques} are a little more complex internally than {@link Vector}s, but this allows them to grow
     * more efficiently under certain circumstances, especially with very long sequences, where reallocations become
     * more expensive.
     *
     * For operations that involve frequent insertion or removals of elements at positions other than the beginning or
     * the end, {@link Deque Deques} perform worse and have less consistent iterators and references than
     * {@link List Lists}.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Sequence </dt>
     *	<dd> Elements in sequence containers are ordered in a strict linear sequence. Individual elements
     *		 are accessed by their position in this sequence. </dd>
     *
     *	<dt> Dynamic array </dt>
     *	<dd> Generally implemented as a dynamic array, it allows direct access to any element in the
     *		 sequence and provides relatively fast addition/removal of elements at the beginning or the end
     *		 of the sequence. </dd>
     * </dl>
     *
     * @param <T> Type of the elements.
     *
     * @reference http://www.cplusplus.com/reference/deque/deque/
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class DequeCollection<T> extends std.Deque<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        push(...items: T[]): number;
        /**
         * @inheritdoc
         */
        push_back(val: T): void;
        /**
         * @hidden
         */
        protected _Insert_by_repeating_val(position: std.DequeIterator<T>, n: number, val: T): std.DequeIterator<T>;
        /**
         * @hidden
         */
        protected _Insert_by_range<U extends T, InputIterator extends std.Iterator<U>>(position: std.DequeIterator<T>, begin: InputIterator, end: InputIterator): std.DequeIterator<T>;
        /**
         * @inheritdoc
         */
        pop_back(): void;
        /**
         * @hidden
         */
        protected _Erase_by_range(first: std.DequeIterator<T>, last: std.DequeIterator<T>): std.DequeIterator<T>;
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
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.DequeIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.DequeIterator<T>, last: std.DequeIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link HashMap} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link MapCollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link insert_or_assign}
     *   - {@link emplace}
     *   - {@link set}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     *   - {@link extract}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link HashMap HashMaps} are associative containers that store elements formed by the combination of a
     * *key value* and a *mapped value*, and which allows for fast retrieval of individual elements based on their
     * *keys*.
     *
     * In an {@link HashMap}, the *key value* is generally used to uniquely identify the element, while the
     * *mapped value* is an object with the content associated to this *key*. Types of *key* and *mapped value* may
     * differ.
     *
     * Internally, the elements in the {@link HashMap} are not sorted in any particular order with respect to either
     * their *key* or *mapped values*, but organized into *buckets* depending on their hash values to allow for fast
     * access to individual elements directly by their *key values* (with a constant average time complexity on
     * average).
     *
     * {@link HashMap} containers are faster than {@link TreeMap} containers to access individual elements by their
     * *key*, although they are generally less efficient for range iteration through a subset of their elements.
     *
     *  <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     * 	<dt> Associative </dt>
     * 	<dd> Elements in associative containers are referenced by their *key* and not by their absolute
     *		 position in the container. </dd>
     *
     * 	<dt> Hashed </dt>
     * 	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements
     *		 by their *key*. </dd>
     *
     * 	<dt> Map </dt>
     * 	<dd> Each element associates a *key* to a *mapped value*:
     *		 *Keys* are meant to identify the elements whose main content is the *mapped value*. </dd>
     *
     * 	<dt> Unique keys </dt>
     * 	<dd> No two elements in the container can have equivalent keys. </dd>
     * </dl>
     *
     * @param <Key> Type of the key values.
     *				Each element in an {@link HashMap} is uniquely identified by its key value.
     * @param <T> Type of the mapped value.
     *			  Each element in an {@link HashMap} is used to store some data as its mapped value.
     *
     * @reference http://www.cplusplus.com/reference/unordered_map/unordered_map
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class HashMapCollection<Key, T> extends std.HashMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link HashMultiMap} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link MapCollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link emplace}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link HashMultiMap HashMultiMap}s are associative containers that store elements formed by the combination of
     * a *key value* and a *mapped value*, much like {@link HashMultiMap} containers, but allowing different elements
     * to have equivalent *keys*.
     *
     * In an {@link HashMultiMap}, the *key value* is generally used to uniquely identify the element, while the
     * *mapped value* is an object with the content associated to this *key*. Types of *key* and *mapped value* may
     * differ.
     *
     * Internally, the elements in the {@link HashMultiMap} are not sorted in any particular order with respect to
     * either their *key* or *mapped values*, but organized into *buckets* depending on their hash values to allow for
     * fast access to individual elements directly by their *key values* (with a constant average time complexity on
     * average).
     *
     * Elements with equivalent *keys* are grouped together in the same bucket and in such a way that an iterator can
     * iterate through all of them. Iterators in the container are doubly linked iterators.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd> Elements in associative containers are referenced by their *key* and not by their absolute
     *		 position in the container. </dd>
     *
     *	<dt> Hashed </dt>
     *	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements
     *		 by their *key*. </dd>
     *
     *	<dt> Map </dt>
     *	<dd> Each element associates a *key* to a *mapped value*:
     *		 *Keys* are meant to identify the elements whose main content is the *mapped value*. </dd>
     *
     *	<dt> Multiple equivalent keys </dt>
     *	<dd> The container can hold multiple elements with equivalent *keys*. </dd>
     * </dl>
     *
     * @param <Key> Type of the key values.
     *				Each element in an {@link HashMultiMap} is identified by a key value.
     * @param <T> Type of the mapped value.
     *			  Each element in an {@link HashMultiMap} is used to store some data as its mapped value.
     *
     * @reference http://www.cplusplus.com/reference/unordered_map/unordered_multimap
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class HashMultiMapCollection<Key, T> extends std.HashMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link HashMultiSet} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link HashMultiSet HashMultiSets} are containers that store elements in no particular order, allowing fast
     * retrieval of individual elements based on their value, much like {@link HashMultiSet} containers, but allowing
     * different elements to have equivalent values.
     *
     * In an {@link HashMultiSet}, the value of an element is at the same time its *key*, used to identify it. *Keys*
     * are immutable, therefore, the elements in an {@link HashMultiSet} cannot be modified once in the container -
     * they can be inserted and removed, though.
     *
     * Internally, the elements in the {@link HashMultiSet} are not sorted in any particular, but organized into
     * *buckets* depending on their hash values to allow for fast access to individual elements directly by their
     * *values* (with a constant average time complexity on average).
     *
     * Elements with equivalent values are grouped together in the same bucket and in such a way that an iterator can
     * iterate through all of them. Iterators in the container are doubly linked iterators.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd> Elements in associative containers are referenced by their *key* and not by their absolute
     *		 position in the container. </dd>
     *
     *	<dt> Hashed </dt>
     *	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements
     *		 by their *key*. </dd>
     *
     *	<dt> Set </dt>
     *	<dd> The value of an element is also the *key* used to identify it. </dd>
     *
     *	<dt> Multiple equivalent keys </dt>
     *	<dd> The container can hold multiple elements with equivalent *keys*. </dd>
     * </dl>
     *
     * @param <T> Type of the elements.
     *		   Each element in an {@link UnorderedMultiSet} is also identified by this value..
     *
     * @reference http://www.cplusplus.com/reference/unordered_set/unordered_multiset
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class HashMultiSetCollection<T> extends std.HashMultiSet<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link HashSet} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link push}
     *   - {@link insert_or_assign}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     *   - {@link extract}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link HashSet HashSets} are containers that store unique elements in no particular order, and which allow for
     * fast retrieval of individual elements based on their value.
     *
     * In an {@link HashSet}, the value of an element is at the same time its *key*, that identifies it uniquely.
     * Keys are immutable, therefore, the elements in an {@link HashSet} cannot be modified once in the container -
     * they can be inserted and removed, though.
     *
     * Internally, the elements in the {@link HashSet} are not sorted in any particular order, but organized into
     * buckets depending on their hash values to allow for fast access to individual elements directly by their
     * *values* (with a constant average time complexity on average).
     *
     * {@link HashSet} containers are faster than {@link TreeSet} containers to access individual elements by their
     * *key*, although they are generally less efficient for range iteration through a subset of their elements.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd> Elements in associative containers are referenced by their *key* and not by their absolute
     *		 position in the container. </dd>
     *
     *	<dt> Hashed </dt>
     *	<dd> Hashed containers organize their elements using hash tables that allow for fast access to elements
     *		 by their *key*. </dd>
     *
     *	<dt> Set </dt>
     *	<dd> The value of an element is also the *key* used to identify it. </dd>
     *
     *	<dt> Unique keys </dt>
     *	<dd> No two elements in the container can have equivalent *keys*. </dd>
     * </dl>
     *
     * @param <T> Type of the elements.
     *			  Each element in an {@link HashSet} is also uniquely identified by this value.
     *
     * @reference http://www.cplusplus.com/reference/unordered_set/unordered_set
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class HashSetCollection<T> extends std.HashSet<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * An interface for {@link IContainer containers} who can detect element I/O events.
     *
     * Below are list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *	 - {@link assign}
     *   - {@link insert}
     *	 - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface ICollection<T> extends std.base.IContainer<T>, library.IEventDispatcher {
        /**
         * Dispatch a {@link CollectionEvent} with *refresh* typed.
         *
         * {@link ICollection} dispatches {@link CollectionEvent} typed *insert* or *erase* whenever elements I/O has
         * occured. However, unlike those elements I/O events, content change in element level can't be detected.
         * There's no way to detect those events automatically by {@link IContainer}.
         *
         * If you want to dispatch those typed events (notifying change on contents in element level), you've to
         * dispatch *refresh* typed event manually, by yourself. Call {@link refresh refresh()} with specified
         * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
         * *refresh* typed will be dispatched.
         *
         * If you don't specify any iterator, then the range of the *refresh* event will be all elements in this
         * {@link ICollection collection}; {@link begin begin()} to {@link end end()}.
         */
        refresh(): void;
        /**
         * Dispatch a {@link CollectionEvent} with *refresh* typed.
         *
         * {@link ICollection} dispatches {@link CollectionEvent} typed *insert* or *erase* whenever elements I/O has
         * occured. However, unlike those elements I/O events, content change in element level can't be detected.
         * There's no way to detect those events automatically by {@link IContainer}.
         *
         * If you want to dispatch those typed events (notifying change on contents in element level), you've to
         * dispatch *refresh* typed event manually, by yourself. Call {@link refresh refresh()} with specified
         * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
         * *refresh* typed will be dispatched.
         *
         * @param it An iterator targeting the content changed element.
         */
        refresh(it: std.Iterator<T>): void;
        /**
         * Dispatch a {@link CollectionEvent} with *refresh* typed.
         *
         * {@link ICollection} dispatches {@link CollectionEvent} typed *insert* or *erase* whenever elements I/O has
         * occured. However, unlike those elements I/O events, content change in element level can't be detected.
         * There's no way to detect those events automatically by {@link IContainer}.
         *
         * If you want to dispatch those typed events (notifying change on contents in element level), you've to
         * dispatch *refresh* typed event manually, by yourself. Call {@link refresh refresh()} with specified
         * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
         * *refresh* typed will be dispatched.
         *
         * @param first An Iterator to the initial position in a sequence of the content changed elmeents.
         * @param last An {@link Iterator} to the final position in a sequence of the content changed elements. The range
         *			   used is [*first*, *last*), which contains all the elements between *first* and
         *			   *last*, including the element pointed by *first* but not the element pointed by
         *			   *last*.
         */
        refresh(first: std.Iterator<T>, last: std.Iterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
    /**
     * @hidden
     */
    namespace ICollection {
        /**
         * @hidden
         */
        function _Dispatch_CollectionEvent<T>(collection: ICollection<T>, type: string, first: std.Iterator<T>, last: std.Iterator<T>): void;
        /**
         * @hidden
         */
        function _Dispatch_MapCollectionEvent<Key, T>(collection: ICollection<std.Pair<Key, T>>, type: string, first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link List} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     *	- *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link push}
     *   - {@link push_front}
     *   - {@link push_back}
     *   - {@link merge}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     *   - {@link pop_front}
     *   - {@link pop_back}
     *   - {@link unique}
     *   - {@link remove}
     *   - {@link remove_if}
     *   - {@link splice}
     * - *refresh* typed events:
     *   - {@link refresh}
     *   - {@link sort}
     *
     * #### [Inherited]
     * {@link List Lists} are sequence containers that allow constant time insert and erase operations anywhere within
     * the sequence, and iteration in both directions.
     *
     * List containers are implemented as doubly-linked lists; Doubly linked lists can store each of the elements they
     * contain in different and unrelated storage locations. The ordering is kept internally by the association to
     * each element of a link to the element preceding it and a link to the element following it.
     *
     * They are very similar to forward_list: The main difference being that forward_list objects are single-linked
     * lists, and thus they can only be iterated forwards, in exchange for being somewhat smaller and more efficient.
     *
     * Compared to other base standard sequence containers (array, vector and deque), lists perform generally better
     * in inserting, extracting and moving elements in any position within the container for which an iterator has
     * already been obtained, and therefore also in algorithms that make intensive use of these, like sorting
     * algorithms.
     *
     * The main drawback of lists and forward_lists compared to these other sequence containers is that they lack
     * direct access to the elements by their position; For example, to access the sixth element in a list, one has to
     * iterate from a known position (like the beginning or the end) to that position, which takes linear time in the
     * distance between these. They also consume some extra memory to keep the linking information associated to each
     * element (which may be an important factor for large lists of small-sized elements).
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/linear_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     * 	<dt> Sequence </dt>
     * 	<dd> Elements in sequence containers are ordered in a strict linear sequence. Individual elements are accessed by
     *		 their position in this sequence. </dd>
     *
     * 	<dt> Doubly-linked list </dt>
     *	<dd> Each element keeps information on how to locate the next and the previous elements, allowing constant time
     *		 insert and erase operations before or after a specific element (even of entire ranges), but no direct random
     *		 access. </dd>
     * </dl>
     *
     * @param <T> Type of the elements.
     *
     * @reference http://www.cplusplus.com/reference/list/list/
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class ListCollection<T> extends std.List<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        push(...items: T[]): number;
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
        protected _Insert_by_repeating_val(position: std.ListIterator<T>, n: number, val: T): std.ListIterator<T>;
        /**
         * @hidden
         */
        protected _Insert_by_range<U extends T, InputIterator extends std.Iterator<U>>(position: std.ListIterator<T>, begin: InputIterator, end: InputIterator): std.ListIterator<T>;
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
        protected _Erase_by_range(first: std.ListIterator<T>, last: std.ListIterator<T>): std.ListIterator<T>;
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
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.ListIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.ListIterator<T>, last: std.ListIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    type MapCollectionEventListener<Key, T> = (event: MapCollectionEvent<Key, T>) => void;
    /**
     * An event occured in a {@link MapContainer map container} object.
     *
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class MapCollectionEvent<Key, T> extends CollectionEvent<std.Pair<Key, T>> {
        /**
         * @inheritdoc
         */
        readonly first: std.MapIterator<Key, T>;
        /**
         * @inheritdoc
         */
        readonly last: std.MapIterator<Key, T>;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link TreeMap} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link MapCollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link insert_or_assign}
     *   - {@link emplace}
     *   - {@link set}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     *   - {@link extract}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link TreeMap TreeMaps} are associative containers that store elements formed by a combination of a
     * *key value* (*Key*) and a *mapped value* (*T*), following order.
     *
     * In a {@link TreeMap}, the *key values* are generally used to sort and uniquely identify the elements, while the
     * *mapped values* store the content associated to this key. The types of *key* and *mapped value* may differ, and
     * are grouped together in member type *value_type*, which is a {@link Pair} type combining both:
     *
     * ```typedef Pair<Key, T> value_type;```
     *
     * Internally, the elements in a {@link TreeMap} are always sorted by its *key* following a *strict weak ordering*
     * criterion indicated by its internal comparison method {@link less}.
     *
     * {@link TreeMap} containers are generally slower than {@link HashMap HashMap} containers to access individual
     * elements by their *key*, but they allow the direct iteration on subsets based on their order.
     *
     * {@link TreeMap}s are typically implemented as binary search trees.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd> Elements in associative containers are referenced by their *key* and not by their absolute
     *		 position in the container. </dd>
     *
     *	<dt> Ordered </dt>
     *	<dd> The elements in the container follow a strict order at all times. All inserted elements are
     *		 given a position in this order. </dd>
     *
     *	<dt> Map </dt>
     *	<dd> Each element associates a *key* to a *mapped value*:
     *		 *Keys* are meant to identify the elements whose main content is the *mapped value*. </dd>
     *
     *	<dt> Unique keys </dt>
     *	<dd> No two elements in the container can have equivalent *keys*. </dd>
     * </dl>
     *
     * @param <Key> Type of the keys. Each element in a map is uniquely identified by its key value.
     * @param <T> Type of the mapped value. Each element in a map stores some data as its mapped value.
     *
     * @reference http://www.cplusplus.com/reference/map/map
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class TreeMapCollection<Key, T> extends std.TreeMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link TreeMultiMap} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link MapCollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link emplace}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link TreeMultiMap TreeMultiMaps} are associative containers that store elements formed by a combination of a
     * *key value* and a *mapped value*, following a specific order, and where multiple elements can have equivalent
     * keys.
     *
     * In a {@link TreeMultiMap}, the *key values* are generally used to sort and uniquely identify the elements,
     * while the *mapped values* store the content associated to this *key*. The types of *key* and *mapped value* may
     * differ, and are grouped together in member type ```value_type```, which is a {@link Pair} type combining both:
     *
     * ```typedef Pair<const Key, T> value_type;```
     *
     * Internally, the elements in a {@link TreeMultiMap}are always sorted by its key following a strict weak ordering
     * criterion indicated by its internal comparison method (of {@link less}).
     *
     * {@link TreeMultiMap}containers are generally slower than {@link HashMap} containers to access individual
     * elements by their *key*, but they allow the direct iteration on subsets based on their order.
     *
     * {@link TreeMultiMap TreeMultiMaps} are typically implemented as binary search trees.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" target="_blank"> <
     * img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/map_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd>
     *		Elements in associative containers are referenced by their *key* and not by their absolute
     *		position in the container.
     *	</dd>
     *
     *	<dt> Ordered </dt>
     *	<dd>
     *		The elements in the container follow a strict order at all times. All inserted elements are
     *		given a position in this order.
     *	</dd>
     *
     *	<dt> Map </dt>
     *	<dd>
     *		Each element associates a *key* to a *mapped value*:
     *		*Keys* are meant to identify the elements whose main content is the *mapped value*.
     *	</dd>
     *
     *	<dt> Multiple equivalent keys </dt>
     *	<dd> Multiple elements in the container can have equivalent *keys*. </dd>
     * </dl>
     *
     * @param <Key> Type of the keys. Each element in a map is uniquely identified by its key value.
     * @param <T> Type of the mapped value. Each element in a map stores some data as its mapped value.
     *
     * @reference http://www.cplusplus.com/reference/map/multimap
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class TreeMultiMapCollection<Key, T> extends std.TreeMultiMap<Key, T> implements ICollection<std.Pair<Key, T>> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: MapCollectionEventListener<Key, T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link TreeMultiSet} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link TreeMultiSet TreeMultiSets} are containers that store elements following a specific order, and where
     * multiple elements can have equivalent values.
     *
     * In a {@link TreeMultiSet}, the value of an element also identifies it (the value is itself the *key*, of type
     * *T*). The value of the elements in a {@link TreeMultiSet} cannot be modified once in the container (the
     * elements are always const), but they can be inserted or removed from the container.
     *
     * Internally, the elements in a {@link TreeMultiSet TreeMultiSets} are always sorted following a strict weak
     * ordering criterion indicated by its internal comparison method (of {@link IComparable.less less}).
     *
     * {@link TreeMultiSet} containers are generally slower than {@link HashMultiSet} containers to access individual
     * elements by their *key*, but they allow the direct iteration on subsets based on their order.
     *
     * <p> {@link TreeMultiSet TreeMultiSets} are typically implemented as binary search trees. </p>
     *
     * <p> <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" style="max-width: 100%" /> </a></p>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd>
     *		Elements in associative containers are referenced by their *key* and not by their absolute
     *		position in the container.
     *	</dd>
     *
     *	<dt> Ordered </dt>
     *	<dd>
     *		The elements in the container follow a strict order at all times. All inserted elements are
     *		given a position in this order.
     *	</dd>
     *
     *	<dt> Set </dt>
     *	<dd> The value of an element is also the *key* used to identify it. </dd>
     *
     *	<dt> Multiple equivalent keys </dt>
     *	<dd> Multiple elements in the container can have equivalent *keys*. </dd>
     * </dl>
     *
     * @param <T> Type of the elements. Each element in a {@link TreeMultiSet} container is also identified
     *			  by this value (each value is itself also the element's *key*).
     *
     * @reference http://www.cplusplus.com/reference/set/multiset
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class TreeMultiSetCollection<T> extends std.TreeMultiSet<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.collection {
    /**
     * A {@link TreeMap} who can detect element I/O events.
     *
     * Below is the list of methods who are dispatching {@link CollectionEvent}:
     * - *insert* typed events:
     *   - {@link assign}
     *   - {@link insert}
     *   - {@link insert_or_assign}
     *   - {@link push}
     * - *erase* typed events:
     *   - {@link assign}
     *   - {@link clear}
     *   - {@link erase}
     *   - {@link extract}
     * - *refresh* typed events:
     *   - {@link refresh}
     *
     * #### [Inherited]
     * {@link TreeSet TreeSets} are containers that store unique elements following a specific order.
     *
     * In a {@link TreeSet}, the value of an element also identifies it (the value is itself the *key*, of type *T*),
     * and each value must be unique. The value of the elements in a {@link TreeSet} cannot be modified once in the
     * container (the elements are always const), but they can be inserted or removed from the container.
     *
     * Internally, the elements in a {@link TreeSet} are always sorted following a specific strict weak ordering
     * criterion indicated by its internal comparison method (of {@link less}).
     *
     * {@link TreeSet} containers are generally slower than {@link HashSet} containers to access individual elements
     * by their *key*, but they allow the direct iteration on subsets based on their order.
     *
     * {@link TreeSet}s are typically implemented as binary search trees.
     *
     * <a href="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" target="_blank">
     * <img src="http://samchon.github.io/typescript-stl/images/design/class_diagram/set_containers.png" style="max-width: 100%" />
     * </a>
     *
     * <h3> Container properties </h3>
     * <dl>
     *	<dt> Associative </dt>
     *	<dd>
     *		Elements in associative containers are referenced by their *key* and not by their absolute
     *		position in the container.
     *	</dd>
     *
     *	<dt> Ordered </dt>
     *	<dd>
     *		The elements in the container follow a strict order at all times. All inserted elements are
     *		given a position in this order.
     *	</dd>
     *
     *	<dt> Set </dt>
     *	<dd> The value of an element is also the *key* used to identify it. </dd>
     *
     *	<dt> Unique keys </dt>
     *	<dd> No two elements in the container can have equivalent *keys*. </dd>
     * </dl>
     *
     * @param <T> Type of the elements.
     *			  Each element in an {@link TreeSet} is also uniquely identified by this value.
     *
     * @reference http://www.cplusplus.com/reference/set/set
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-STL#collection
     * @author Jeongho Nam <http://samchon.org>
     */
    class TreeSetCollection<T> extends std.TreeSet<T> implements ICollection<T> {
        /**
         * A chain object taking responsibility of dispatching events.
         */
        private event_dispatcher_;
        /**
         * @inheritdoc
         */
        protected _Handle_insert(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        protected _Handle_erase(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        refresh(): void;
        /**
         * @inheritdoc
         */
        refresh(it: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        refresh(first: std.SetIterator<T>, last: std.SetIterator<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
        removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
    }
}
declare namespace samchon.library {
    /**
     * Case generator.
     *
     * {@link CaseGenerator} is an abstract case generator being used like a matrix.
     * <ul>
     *  <li> n��r(n^r) -> {@link CombinedPermutationGenerator} </li>
     *  <li> nPr -> {@link PermutationGenerator} </li>
     *  <li> n! -> {@link FactorialGenerator} </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class CaseGenerator {
        /**
         * Size, the number of all cases.
         */
        protected size_: number;
        /**
         * N, size of the candidates.
         */
        protected n_: number;
        /**
         * R, size of elements of each case.
         */
        protected r_: number;
        /**
         * Construct from size of N and R.
         *
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number);
        /**
         * Get size of all cases.
         *
         * @return Get a number of the all cases.
         */
        size(): number;
        /**
         * Get size of the N.
         */
        n(): number;
        /**
         * Get size of the R.
         */
        r(): number;
        /**
         * Get index'th case.
         *
         * @param index Index number
         * @return The row of the index'th in combined permuation case
         */
        abstract at(index: number): number[];
    }
    /**
     * A combined-permutation case generator.
     *
     * <sub>n</sub>��<sub>r</sub>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class CombinedPermutationGenerator extends CaseGenerator {
        /**
         * An array using for dividing each element index.
         */
        private divider_array;
        /**
         * Construct from size of N and R.
         *
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number);
        at(index: number): number[];
    }
    /**
     * A permutation case generator.
     *
     * <sub>n</sub>P<sub>r</sub>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class PermuationGenerator extends CaseGenerator {
        /**
         * Construct from size of N and R.
         *
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number);
        /**
         * @inheritdoc
         */
        at(index: number): number[];
    }
    /**
     * Factorial case generator.
     *
     * n! = <sub>n</sub>P<sub>n</sub>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class FactorialGenerator extends PermuationGenerator {
        /**
         * Construct from factorial size N.
         *
         * @param n Factoria size N.
         */
        constructor(n: number);
    }
}
declare namespace samchon.library {
    type BasicEventListener = (event: BasicEvent) => void;
    /**
     * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific
     * types of event listeners are registered, and dispatches events.
     *
     * The event target serves as the local point for how events flow through the display list hierarchy. When an
     * event such as a mouse click or a key press occurs, an event object is dispatched into the event flow from the
     * root of the display list. The event object makes a round-trip journey to the event target, which is
     * conceptually divided into three phases: the capture phase includes the journey from the root to the last node
     * before the event target's node; the target phase includes only the event target node; and the bubbling phase
     * includes any subsequent nodes encountered on the return trip to the root of the display list.
     *
     * In general, the easiest way for a user-defined class to gain event dispatching capabilities is to extend
     * {@link EventDispatcher}. If this is impossible (that is, if the class is already extending another class), you
     * can instead implement the {@link IEventDispatcher} interface, create an {@link EventDispatcher} member, and
     * write simple hooks to route calls into the aggregated {@link EventDispatcher}.
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/IEventDispatcher.html
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-EventDispatcher
     * @author Migrated by Jeongho Nam <http://samchon.org>
     */
    interface IEventDispatcher {
        /**
         * Checks whether the {@link EventDispatcher} object has any listeners registered for a specific type of event.
         * This allows you to determine where an {@link EventDispatcher} object has altered handling of an event type
         * in the event flow hierarchy. To determine whether a specific event type actually triggers an event listener,
         * use {@link willTrigger willTrigger()}.
         *
         * The difference between {@link hasEventListener hasEventListener()} and {@link willTrigger willTrigger()} is
         * that {@link hasEventListener} examines only the object to which it belongs, whereas {@link willTrigger}
         * examines the entire event flow for the event specified by the type parameter.
         *
         * @param type The type of event.
         */
        hasEventListener(type: string): boolean;
        /**
         * Dispatches an event into the event flow.
         *
         * The event target is the {@link EventDispatcher} object upon which the {@link dispatchEvent dispatchEvent()}
         * method is called.
         *
         * @param event The {@link BasicEvent} object that is dispatched into the event flow. If the event is being
         *				redispatched, a clone of the event is created automatically. After an event is dispatched, its
         *				target property cannot be changed, so you must create a new copy
         *				of the event for redispatching to work.
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * Registers an event listener object with an {@link EventDispatcher} object so that the listener receives
         * notification of an event. You can register event listeners on all nodes in the display list for a specific
         * type of event, phase, and priority.
         *
         * After you successfully register an event listener, you cannot change its priority through additional calls
         * to {@link addEventListener addEventListener()|} To change a listener's priority, you must first call
         * {@link removeEventListener removeEventListener()}. Then you can register the listener again with the new
         * priority level.
         *
         * Keep in mind that after the listener is registered, subsequent calls to {@link addEventListener} with a
         * different type or useCapture value result in the creation of a separate listener registration. For example,
         * if you first register a listener with useCapture set to true, it listens only during the capture phase. If
         * you call {@link addEventListener} again using the same listener object, but with useCapture set to false,
         * you have two separate listeners: one that listens during the capture phase and another that listens during
         * the target and bubbling phases.
         *
         * You cannot register an event listener for only the target phase or the bubbling phase. Those phases are
         * coupled during registration because bubbling applies only to the ancestors of the target node.
         *
         * If you no longer need an event listener, remove it by calling {@link removeEventListener}, or memory
         * problems could result. Event listeners are not automatically removed from memory because the garbage
         * collector does not remove the listener as long as the dispatching object exists (unless the
         * useWeakReference parameter is set to true).
         *
         * Copying an {@link EventDispatcher} instance does not copy the event listeners attached to it. (If your n
         * ewly created node needs an event listener, you must attach the listener after creating the node.) However,
         * if you move an {@link EventDispatcher} instance, the event listeners attached to it move along with it.
         *
         * If the event listener is being registered on a node while an event is also being processed on this node,
         * the event listener is not triggered during the current phase but may be triggered during a later phase in
         * the event flow, such as the bubbling phase.
         *
         * If an event listener is removed from a node while an event is being processed on the node, it is still
         * triggered by the current actions. After it is removed, the event listener is never invoked again (unless it
         * is registered again for future processing).
         *
         * @param event The type of event.
         * @param listener The listener function that processes the event.
         *				 This function must accept an Event object as its only parameter and must return
         *				 nothing.
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        /**
         * Registers an event listener object with an {@link EventDispatcher} object so that the listener receives
         * notification of an event. You can register event listeners on all nodes in the display list for a specific
         * type of event, phase, and priority.
         *
         * After you successfully register an event listener, you cannot change its priority through additional calls
         * to {@link addEventListener addEventListener()|} To change a listener's priority, you must first call
         * {@link removeEventListener removeEventListener()}. Then you can register the listener again with the new
         * priority level.
         *
         * Keep in mind that after the listener is registered, subsequent calls to {@link addEventListener} with a
         * different type or useCapture value result in the creation of a separate listener registration. For example,
         * if you first register a listener with useCapture set to true, it listens only during the capture phase. If
         * you call {@link addEventListener} again using the same listener object, but with useCapture set to false,
         * you have two separate listeners: one that listens during the capture phase and another that listens during
         * the target and bubbling phases.
         *
         * You cannot register an event listener for only the target phase or the bubbling phase. Those phases are
         * coupled during registration because bubbling applies only to the ancestors of the target node.
         *
         * If you no longer need an event listener, remove it by calling {@link removeEventListener}, or memory
         * problems could result. Event listeners are not automatically removed from memory because the garbage
         * collector does not remove the listener as long as the dispatching object exists (unless the
         * useWeakReference parameter is set to true).
         *
         * Copying an {@link EventDispatcher} instance does not copy the event listeners attached to it. (If your n
         * ewly created node needs an event listener, you must attach the listener after creating the node.) However,
         * if you move an {@link EventDispatcher} instance, the event listeners attached to it move along with it.
         *
         * If the event listener is being registered on a node while an event is also being processed on this node,
         * the event listener is not triggered during the current phase but may be triggered during a later phase in
         * the event flow, such as the bubbling phase.
         *
         * If an event listener is removed from a node while an event is being processed on the node, it is still
         * triggered by the current actions. After it is removed, the event listener is never invoked again (unless it
         * is registered again for future processing).
         *
         * @param event The type of event.
         * @param listener The listener function that processes the event.
         *				 This function must accept an Event object as its only parameter and must return
         *				 nothing.
         * @param thisArg The object to be used as the **this** object.
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        /**
         * Removes a listener from the {@link EventDispatcher} object. If there is no matching listener registered
         * with the {@link EventDispatcher} object, a call to this method has no effect.
         *
         * @param type The type of event.
         * @param listener The listener object to remove.
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        /**
         * Removes a listener from the {@link EventDispatcher} object. If there is no matching listener registered
         * with the {@link EventDispatcher} object, a call to this method has no effect.
         *
         * @param type The type of event.
         * @param listener The listener object to remove.
         * @param thisArg The object to be used as the **this** object.
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
    }
    /**
     * The {@link EventDispatcher} class is the base class for all classes that dispatch events. The
     * {@link EventDispatcher} class implements the {@link IEventDispatcher} interface and is the base class for the
     * {@link DisplayObject} class. The {@link EventDispatcher} class allows any object on the display list to be an
     * event target and as such, to use the methods of the {@link IEventDispatcher} interface.
     *
     * The event target serves as the local point for how events flow through the display list hierarchy. When an
     * event such as a mouse click or a key press occurs, an event object is dispatched into the event flow from the
     * root of the display list. The event object makes a round-trip journey to the event target, which is
     * conceptually divided into three phases: the capture phase includes the journey from the root to the last node
     * before the event target's node; the target phase includes only the event target node; and the bubbling phase
     * includes any subsequent nodes encountered on the return trip to the root of the display list.
     *
     * In general, the easiest way for a user-defined class to gain event dispatching capabilities is to extend
     * {@link EventDispatcher}. If this is impossible (that is, if the class is already extending another class), you
     * can instead implement the {@link IEventDispatcher} interface, create an {@link EventDispatcher} member, and
     * write simple hooks to route calls into the aggregated {@link EventDispatcher}.
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html
     * @author Migrated by Jeongho Nam <http://samchon.org>
     */
    class EventDispatcher implements IEventDispatcher {
        /**
         * @hidden
         */
        private event_dispatcher_;
        /**
         * @hidden
         */
        private event_listeners_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Construct from the origin event dispatcher.
         *
         * @param dispatcher The origin object who issuing events.
         */
        constructor(dispatcher: IEventDispatcher);
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: library.BasicEvent): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener): void;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
    }
}
declare namespace samchon.library {
    /**
     * The {@link FileReference} class provides a means to load and save files in browser level.
     *
     * The {@link FileReference} class provides a means to {@link load} and {@link save} files in browser level. A
     * browser-system dialog box prompts the user to select a file to {@link load} or a location for {@link svae}. Each
     * {@link FileReference} object refers to a single file on the user's disk and has properties that contain
     * information about the file's size, type, name, creation date, modification date, and creator type (Macintosh only).
     *
     *
     * FileReference instances are created in the following ways:
     * <ul>
     *	<li>
     *		When you use the new operator with the {@link FileReference} constructor:
     *		<code>let myFileReference: FileReference = new FileReference();</code>
     *	</li>
     *	<li>
     *		When you call the {@link FileReferenceList.browse} method, which creates an array of {@link FileReference}
     *		objects.
     *	</li>
     * </ul>
     *
     * During a load operation, all the properties of a {@link FileReference} object are populated by calls to the
     * {@link FileReference.browse} or {@link FileReferenceList.browse} methods. During a save operation, the name
     * property is populated when the select event is dispatched; all other properties are populated when the complete
     * event is dispatched.
     *
     * The {@link browse browse()} method opens an browser-system dialog box that prompts the user to select a file
     * for {@link load}. The {@link FileReference.browse} method lets the user select a single file; the
     * {@link FileReferenceList.browse} method lets the user select multiple files. After a successful call to the
     * {@link browse browse()} method, call the {@link FileReference.load} method to load one file at a time. The
     * {@link FileReference.save} method prompts the user for a location to save the file and initiates downloading from
     * a binary or string data.
     *
     * The {@link FileReference} and {@link FileReferenceList} classes do not let you set the default file location
     * for the dialog box that the {@link browse} or {@link save} methods generate. The default location shown in the
     * dialog box is the most recently browsed folder, if that location can be determined, or the desktop. The classes do
     * not allow you to read from or write to the transferred file. They do not allow the browser that initiated the
     * {@link load} or {@link save} to access the loaded or saved file or the file's location on the user's disk.
     *
     * @references http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/FileReference.html
     * @author Jeongho Nam <http://samchon.org>
     */
    class FileReference extends EventDispatcher {
        /**
         * @hidden
         */
        private file_;
        /**
         * @hidden
         */
        private data_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * The data from the loaded file after a successful call to the {@link load load()} method.
         *
         * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
         * an {@link LogicError exception} will be thrown when you try to get the value of this property.
         *
         * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
         *
         */
        readonly data: any;
        /**
         * The name of the file on the local disk.
         *
         * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
         * an {@link LogicError exception} will be thrown when you try to get the value of this property.
         *
         * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
         *
         */
        readonly name: string;
        /**
         * The filename extension.
         *
         * A file's extension is the part of the name following (and not including) the final dot (&quot;.&quot;). If
         * there is no dot in the filename, the extension is <code>null</code>.
         *
         * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
         * an {@link LogicError exception} will be thrown when you try to get the value of this property.
         *
         * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
         *
         */
        readonly extension: string;
        /**
         * The file type, metadata of the {@link extension}.
         *
         * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
         * an {@link LogicError exception} will be thrown when you try to get the value of this property.
         *
         * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
         *
         */
        readonly type: string;
        /**
         * The size of the file on the local disk in bytes.
         *
         * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
         * an {@link LogicError exception} will be thrown when you try to get the value of this property.
         *
         * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
         *
         */
        readonly size: number;
        /**
         * The date that the file on the local disk was last modified.
         *
         * If the {@link FileReference} object was not populated (by a valid call to {@link FileReference.browse}),
         * an {@link LogicError exception} will be thrown when you try to get the value of this property.
         *
         * All the properties of a {@link FileReference} object are populated by calling the {@link browse browse()}.
         *
         */
        readonly modificationDate: Date;
        /**
         * Displays a file-browsing dialog box that lets the user select a file to upload. The dialog box is native
         * to the user's browser system. The user can select a file on the local computer or from other systems, for
         * example, through a UNC path on Windows.
         *
         * When you call this method and the user successfully selects a file, the properties of this
         * {@link FileReference} object are populated with the properties of that file. Each subsequent time that the
         * {@link FileReference.browse} method is called, the {@link FileReference} object's properties are reset to
         * the file that the user selects in the dialog box. Only one {@link browse browse()} can be performed at a time
         * (because only one dialog box can be invoked at a time).
         *
         * Using the *typeFilter parameter*, you can determine which files the dialog box displays.
         *
         * @param typeFilter An array of filter strings used to filter the files that are displayed in the dialog box.
         *					 If you omit this parameter, all files are displayed.
         */
        browse(...typeFilter: string[]): void;
        /**
         * Starts the load of a local file selected by a user.
         *
         * You must call the {@link FileReference.browse} or {@link FileReferenceList.browse} method before you call
         * the {@link load load()} method.
         *
         * Listeners receive events to indicate the progress, success, or failure of the load. Although you can use
         * the {@link FileReferenceList} object to let users select multiple files to load, you must {@link load} the
         * {@link FileReferenceList files} one by one. To {@link load} the files one by one, iterate through the
         * {@link FileReferenceList.fileList} array of {@link FileReference} objects.
         *
         * If the file finishes loading successfully, its contents are stored in the {@link data} property.
         */
        load(): void;
        /**
         * Save a file to local filesystem.
         *
         * {@link FileReference.save} implemented the save function by downloading a file from a hidden anchor tag.
         * However, the plan, future's {@link FileReference} will follow such rule:
         *
         * Opens a dialog box that lets the user save a file to the local filesystem.
         *
         * The {@link save save()} method first opens an browser-system dialog box that asks the user to enter a
         * filename and select a location on the local computer to save the file. When the user selects a location and
         * confirms the save operation (for example, by clicking Save), the save process begins. Listeners receive events
         * to indicate the progress, success, or failure of the save operation. To ascertain the status of the dialog box
         * and the save operation after calling {@link save save()}, your code must listen for events such as cancel,
         * open, progress, and complete.
         *
         * When the file is saved successfully, the properties of the {@link FileReference} object are populated with
         * the properties of the local file. The complete event is dispatched if the save is successful.
         *
         * Only one {@link browse browse()} or {@link save()} session can be performed at a time (because only one
         * dialog box can be invoked at a time).
         *
         * @param data The data to be saved. The data can be in one of several formats, and will be treated appropriately.
         * @param fileName File name to be saved.
         */
        save(data: string, fileName: string): void;
        /**
         * Save a file to local filesystem.
         *
         * {@link FileReference.save} implemented the save function by downloading a file from a hidden anchor tag.
         * However, the plan, future's {@link FileReference} will follow such rule:
         *
         * Opens a dialog box that lets the user save a file to the local filesystem.
         *
         * The {@link save save()} method first opens an browser-system dialog box that asks the user to enter a
         * filename and select a location on the local computer to save the file. When the user selects a location and
         * confirms the save operation (for example, by clicking Save), the save process begins. Listeners receive events
         * to indicate the progress, success, or failure of the save operation. To ascertain the status of the dialog box
         * and the save operation after calling {@link save save()}, your code must listen for events such as cancel,
         * open, progress, and complete.
         *
         * When the file is saved successfully, the properties of the {@link FileReference} object are populated with
         * the properties of the local file. The complete event is dispatched if the save is successful.
         *
         * Only one {@link browse browse()} or {@link save()} session can be performed at a time (because only one
         * dialog box can be invoked at a time).
         *
         * @param data The data to be saved. The data can be in one of several formats, and will be treated appropriately.
         * @param fileName File name to be saved.
         */
        static save(data: string, fileName: string): void;
    }
    /**
     * The {@link FileReferenceList} class provides a means to let users select one or more files for
     * {@link FileReference.load loading}. A {@link FileReferenceList} object represents a group of one or more local
     * files on the user's disk as an array of {@link FileReference} objects. For detailed information and important
     * considerations about {@link FileReference} objects and the FileReference class, which you use with
     * {@link FileReferenceList}, see the {@link FileReference} class.
     *
     * To work with the {@link FileReferenceList} class:
     * <ul>
     *	<li> Instantiate the class: <code>var myFileRef = new FileReferenceList();</code> </li>
     *	<li>
     *		Call the {@link FileReferenceList.browse} method, which opens a dialog box that lets the user select one or
     *		more files for upload: <code>myFileRef.browse();</code>
     *	</li>
     *	<li>
     *		After the {@link browse browse()} method is called successfully, the {@link fileList} property of the
     *		{@link FileReferenceList} object is populated with an array of {@link FileReference} objects.
     *	</li>
     *	<li> Call {@link FileReference.load} on each element in the {@link fileList} array. </li>
     * </ul>
     *
     * The {@link FileReferenceList} class includes a {@link browse browse()} method and a {@link fileList} property
     * for working with multiple files.
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/FileReferenceList.html
     * @author Jeongho Nam <http://samchon.org>
     */
    class FileReferenceList extends EventDispatcher {
        /**
         * @hidden
         */
        file_list: std.Vector<FileReference>;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * An array of {@link FileReference} objects.
         *
         * When the {@link FileReferenceList.browse} method is called and the user has selected one or more files
         * from the dialog box that the {@link browse browse()} method opens, this property is populated with an array of
         * {@link FileReference} objects, each of which represents the files the user selected.
         *
         * The {@link fileList} property is populated anew each time {@link browse browse()} is called on that
         * {@link FileReferenceList} object.
         */
        readonly fileList: std.Vector<FileReference>;
        /**
         * Displays a file-browsing dialog box that lets the user select one or more local files to upload. The
         * dialog box is native to the user's browser system.
         *
         * When you call this method and the user successfully selects files, the {@link fileList} property of this
         * {@link FileReferenceList} object is populated with an array of {@link FileReference} objects, one for each
         * file that the user selects. Each subsequent time that the {@link FileReferenceList.browse} method is called,
         * the {@link FileReferenceList.fileList} property is reset to the file(s) that the user selects in the dialog
         * box.
         *
         * Using the *typeFilter* parameter, you can determine which files the dialog box displays.
         *
         * Only one {@link FileReference.browse}, {@link FileReference.load}, or {@link FileReferenceList.browse}
         * session can be performed at a time on a {@link FileReferenceList} object (because only one dialog box can be
         * opened at a time).
         *
         * @param typeFilter An array of filter strings used to filter the files that are displayed in the dialog box.
         *					 If you omit this parameter, all files are displayed.
         */
        browse(...typeFilter: string[]): void;
    }
}
declare namespace samchon.library {
    /**
     * A genetic algorithm class.
     *
     * In the field of artificial intelligence, a genetic algorithm (GA) is a search heuristic that mimics the
     * process of natural selection. This heuristic (also sometimes called a metaheuristic) is routinely used to generate
     * useful solutions to optimization and search problems.
     *
     * Genetic algorithms belong to the larger class of evolutionary algorithms (EA), which generate solutions to
     * optimization problems using techniques inspired by natural evolution, such as inheritance, {@link mutate mutation},
     * {@link selection}, and {@link crossover}.
     *
     * @reference https://en.wikipedia.org/wiki/Genetic_algorithm
     * @author Jeongho Nam <http://samchon.org>
     */
    class GeneticAlgorithm {
        /**
         * Whether each element (Gene) is unique in their GeneArray.
         */
        private unique_;
        /**
         * Rate of mutation.
         *
         * The {@link mutation_rate} determines the percentage of occurence of mutation in GeneArray.
         *
         * <ul>
         *	<li> When {@link mutation_rate} is too high, it is hard to ancitipate studying on genetic algorithm. </li>
         *	<li>
         *		When {@link mutation_rate} is too low and initial set of genes (GeneArray) is far away from optimal, the
         *		evolution tends to wandering outside of he optimal.
         *	</li>
         * </ul>
         */
        private mutation_rate_;
        /**
         * Number of tournaments in selection.
         */
        private tournament_;
        /**
         * Initialization Constructor.
         *
         * @param unique Whether each Gene is unique in their GeneArray.
         * @param mutation_rate Rate of mutation.
         * @param tournament Number of tournaments in selection.
         */
        constructor(unique?: boolean, mutation_rate?: number, tournament?: number);
        /**
         * Evolove *GeneArray*.
         *
         * Convenient method accessing to {@link evolvePopulation evolvePopulation()}.
         *
         * @param individual An initial set of genes; sequence listing.
         * @param population Size of population in a generation.
         * @param generation Size of generation in evolution.
         * @param compare A comparison function returns whether left gene is more optimal.
         *
         * @return An evolved *GeneArray*, optimally.
         *
         * @see {@link GAPopulation.compare}
         */
        evolveGeneArray<T, GeneArray extends std.base.IArrayContainer<T>>(individual: GeneArray, population: number, generation: number, compare?: (left: T, right: T) => boolean): GeneArray;
        /**
         * Evolve *population*, a mass of *GeneArraies*.
         *
         * @param population An initial population.
         * @param compare A comparison function returns whether left gene is more optimal.
         *
         * @return An evolved population.
         *
         * @see {@link GAPopulation.compare}
         */
        evolvePopulation<T, GeneArray extends std.base.IArrayContainer<T>>(population: GAPopulation<T, GeneArray>, compare?: (left: T, right: T) => boolean): GAPopulation<T, GeneArray>;
        /**
         * Select the best GeneArray in *population* from tournament.
         *
         * {@link selection Selection} is the stage of a genetic algorithm in which individual genomes are chosen
         * from a population for later breeding (using {@linlk crossover} operator). A generic {@link selection}
         * procedure may be implemented as follows:
         *
         * <ol>
         *	<li>
         *		The fitness function is evaluated for each individual, providing fitness values, which are then
         *		normalized. ization means dividing the fitness value of each individual by the sum of all fitness
         *		values, so that the sum of all resulting fitness values equals 1.
         *	</li>
         *	<li> The population is sorted by descending fitness values. </li>
         *	<li>
         *		Accumulated normalized fitness values are computed (the accumulated fitness value of an individual is the
         *		sum of its own fitness value plus the fitness values of all the previous individuals). The accumulated
         *		fitness of the last individual should be 1 (otherwise something went wrong in the normalization step).
         *	</li>
         *	<li> A random number R between 0 and 1 is chosen. </li>
         *	<li> The selected individual is the first one whose accumulated normalized value is greater than R. </li>
         * </ol>
         *
         * @param population The target of tournament.
         * @return The best genes derived by the tournament.
         *
         * @reference https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)
         */
        private selection<T, GeneArray>(population);
        /**
         * Create a new GeneArray by crossing over two *GeneArray*(s).
         *
         * {@link crossover} is a genetic operator used to vary the programming of a chromosome or chromosomes from
         * one generation to the next. It is analogous to reproduction and biological crossover, upon which genetic
         * algorithms are based.
         *
         * {@link crossover Cross over} is a process of taking more than one parent solutions and producing a child
         * solution from them. There are methods for selection of the chromosomes.
         *
         * @param parent1 A parent sequence listing
         * @param parent2 A parent sequence listing
         *
         * @reference https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)
         */
        private crossover<T, GeneArray>(parent1, parent2);
        /**
         * Cause a mutation on the *GeneArray*.
         *
         * {@link mutate Mutation} is a genetic operator used to maintain genetic diversity from one generation of a
         * population of genetic algorithm chromosomes to the next. It is analogous to biological mutation.
         *
         * {@link mutate Mutation} alters one or more gene values in a chromosome from its initial state. In
         * {@link mutate mutation}, the solution may change entirely from the previous solution. Hence GA can come to
         * better solution by using {@link mutate mutation}.
         *
         * {@link mutate Mutation} occurs during evolution according to a user-definable mutation probability. This
         * probability should be set low. If it is set too high, the search will turn into a primitive random search.
         *
         * <h4> Note </h4>
         * Muttion is pursuing diversity. Mutation is useful for avoiding the following problem.
         *
         * When initial set of genes(GeneArray) is far away from optimail, without mutation (only with selection and
         * crossover), the genetic algorithm has a tend to wandering outside of the optimal.
         *
         * Genes in the GeneArray will be swapped following percentage of the {@link mutation_rate}.
         *
         * @param individual A container of genes to mutate
         *
         * @reference https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)
         * @see {@link mutation_rate}
         */
        private mutate<T, GeneArray>(individual);
    }
    /**
     * A population in a generation.
     *
     * {@link GAPopulation} is a class representing population of candidate genes (sequence listing) having an array
     * of GeneArray as a member. {@link GAPopulation} also manages initial set of genes and handles fitting test direclty
     * by the method {@link fitTest fitTest()}.
     *
     * The success of evolution of genetic algorithm is depend on the {@link GAPopulation}'s initial set and fitting
     * test. (*GeneArray* and {@link compare}.)
     *
     * <h4> Warning </h4>
     * Be careful for the mistakes of direction or position of the {@link compare}.
     * Most of logical errors failed to access optimal solution are occured from those mistakes.
     *
     * @param <T> Type of gene elements.
     * @param <GeneArray> An array containing genes as elments; sequnce listing.
     *
     * @author Jeongho Nam <http://samcho.org>
     */
    class GAPopulation<T, GeneArray extends std.base.IArrayContainer<T>> {
        /**
         * Genes representing the population.
         */
        private children_;
        /**
         * A comparison function returns whether left gene is more optimal, greater.
         *
         * Default value of this {@link compare} is {@link std.greater}. It means to compare two array
         * (GeneArray must be a type of {@link std.base.IArrayContainer}). Thus, you've to keep follwing rule.
         *
         * <ul>
         *	<li> GeneArray is implemented from {@link std.base.IArrayContainer}. </li>
         *	<ul>
         *		<li> {@link std.Vector} </li>
         *		<li> {@link std.Deque} </li>
         *	</ul>
         *	<li> GeneArray has custom <code>public less(obj: T): boolean;</code> function. </li>
         * </ul>
         *
         * If you don't want to follow the rule or want a custom comparison function, you have to realize a
         * comparison function.
         */
        private compare_;
        /**
         * Private constructor with population.
         *
         * Private constructor of GAPopulation does not create {@link children}. (candidate genes) but only assigns
         * *null* repeatedly following the *population size*.
         *
         * This private constructor is designed only for {@link GeneticAlgorithm}. Don't create {@link GAPopulation}
         * with this constructor, by yourself.
         *
         * @param size Size of the population.
         */
        constructor(size: number);
        /**
         * Construct from a {@link GeneArray} and *size of the population*.
         *
         * This public constructor creates *GeneArray(s)* as population (size) having shuffled genes which are
         * came from the initial set of genes (*geneArray*). It uses {@link std.greater} as default comparison function.
         *
         *
         * @param geneArray An initial sequence listing.
         * @param size The size of population to have as children.
         */
        constructor(geneArray: GeneArray, size: number);
        /**
         * Constructor from a GeneArray, size of the poluation and custom comparison function.
         *
         * This public constructor creates *GeneArray(s)* as population (size) having shuffled genes which are
         * came from the initial set of genes (*geneArray*). The *compare* is used for comparison function.
         *
         *
         * @param geneArray An initial sequence listing.
         * @param size The size of population to have as children.
         * @param compare A comparison function returns whether left gene is more optimal.
         */
        constructor(geneArray: GeneArray, size: number, compare: (left: GeneArray, right: GeneArray) => boolean);
        children(): std.Vector<GeneArray>;
        /**
         * Test fitness of each *GeneArray* in the {@link population}.
         *
         * @return The best *GeneArray* in the {@link population}.
         */
        fitTest(): GeneArray;
        /**
         * @hidden
         */
        private clone(obj);
    }
}
declare namespace samchon.library {
    /**
     * A utility class supporting static methods of string.
     *
     * The {@link StringUtil} utility class is an all-static class with methods for working with string objects.
     * You do not create instances of {@link StringUtil}; instead you call methods such as the
     * ```StringUtil.substitute()``` method.
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/utils/StringUtil.html
     * @author Jeongho Nam <http://samchon.org>
     */
    class StringUtil {
        /**
         * Generate a substring.
         *
         * Extracts a substring consisting of the characters from specified start to end.
         * It's same with str.substring( ? = (str.find(start) + start.size()), str.find(end, ?) )
         *
         * ```typescript
         * let str: string = StringUtil.between("ABCD(EFGH)IJK", "(", ")");
         * console.log(str); // PRINTS "EFGH"
         * ```
         *
         * - If start is not specified, extracts from begin of the string to end. </li>
         * - If end is not specified, extracts from start to end of the string. </li>
         * - If start and end are all omitted, returns str, itself. </li>
         *
         * @param str Target string to be applied between.
         * @param start A string for separating substring at the front.
         * @param end A string for separating substring at the end.
         *
         * @return substring by specified terms.
         */
        static between(str: string, start?: string, end?: string): string;
        /**
         * Fetch substrings.
         *
         * Splits a string into an array of substrings dividing by specified delimeters of start and end.
         * It's the array of substrings adjusted the between.
         *
         * <ul>
         *	<li> If startStr is omitted, it's same with the split by endStr not having last item. </li>
         *	<li> If endStr is omitted, it's same with the split by startStr not having first item. </li>
         *	<li> If startStr and endStar are all omitted, returns *str*. </li>
         * </ul>
         *
         * @param str Target string to split by between.
         * @param start A string for separating substring at the front.
         *				If omitted, it's same with split(end) not having last item.
         * @param end A string for separating substring at the end.
         *			  If omitted, it's same with split(start) not having first item.
         * @return An array of substrings.
         */
        static betweens(str: string, start?: string, end?: string): Array<string>;
        /**
         * An array containing whitespaces.
         */
        private static SPACE_ARRAY;
        /**
         * Remove all designated characters from the beginning and end of the specified string.
         *
         * @param str The string whose designated characters should be trimmed.
         * @param args Designated character(s).
         *
         * @return Updated string where designated characters was removed from the beginning and end.
         */
        static trim(str: string, ...args: string[]): string;
        /**
         * Remove all designated characters from the beginning of the specified string.
         *
         * @param str The string should be trimmed.
         * @param delims Designated character(s).
         *
         * @return Updated string where designated characters was removed from the beginning
         */
        static ltrim(str: string, ...args: string[]): string;
        /**
         * Remove all designated characters from the end of the specified string.
         *
         * @param str The string should be trimmed.
         * @param delims Designated character(s).
         *
         * @return Updated string where designated characters was removed from the end.
         */
        static rtrim(str: string, ...args: string[]): string;
        /**
         * Substitute <code>{n}</code> tokens within the specified string.
         *
         * @param format The string to make substitutions in. This string can contain special tokens of the form
         *				 <code>{n}</code>, where <code>n</code> is a zero based index, that will be replaced with the
         *				 additional parameters found at that index if specified.
         * @param args Additional parameters that can be substituted in the *format* parameter at each
         *			   <code>{n}</code> location, where <code>n</code> is an integer (zero based) index value into
         *			   the array of values specified.
         *
         * @return New string with all of the <code>{n}</code> tokens replaced with the respective arguments specified.
         */
        static substitute(format: string, ...args: any[]): string;
        /**
         * Returns a string specified word is replaced.
         *
         * @param str Target string to replace
         * @param before Specific word you want to be replaced
         * @param after Specific word you want to replace
         *
         * @return A string specified word is replaced
         */
        static replaceAll(str: string, before: string, after: string): string;
        /**
         * Returns a string specified words are replaced.
         *
         * @param str Target string to replace
         * @param pairs A specific word's pairs you want to replace and to be replaced
         *
         * @return A string specified words are replaced
         */
        static replaceAll(str: string, ...pairs: std.Pair<string, string>[]): string;
        /**
         * Replace all HTML spaces to a literal space.
         *
         * @param str Target string to replace.
         */
        static removeHTMLSpaces(str: string): string;
        /**
         * Repeat a string.
         *
         * Returns a string consisting of a specified string concatenated with itself a specified number of times.
         *
         * @param str The string to be repeated.
         * @param n The repeat count.
         *
         * @return The repeated string.
         */
        static repeat(str: string, n: number): string;
        /**
         * Number to formatted string with &quot;,&quot; sign.
         *
         * Returns a string converted from the number rounded off from specified precision with &quot;,&quot; symbols.
         *
         * @param val A number wants to convert to string.
         * @param precision Target precision of round off.
         *
         * @return A string who represents the number with roundoff and &quot;,&quot; symbols.
         */
        static numberFormat(val: number, precision?: number): string;
        static percentFormat(val: number, precision?: number): string;
    }
}
declare namespace samchon.library {
    /**
     * URLVariables class is for representing variables of HTTP.
     *
     * {@link URLVariables} class allows you to transfer variables between an application and server.
     *
     * When transfering, {@link URLVariables} will be converted to a *URI* string.
     * - URI: Uniform Resource Identifier
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/net/URLVariables.html
     * @author Migrated by Jeongho Nam <http://samchon.org>
     */
    class URLVariables extends std.HashMap<string, string> {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Construct from a URL-encoded string.
         *
         * The {@link decode decode()} method is automatically called to convert the string to properties of the {@link URLVariables} object.
         *
         * @param str A URL-encoded string containing name/value pairs.
         */
        constructor(str: string);
        /**
         * Converts the variable string to properties of the specified URLVariables object.
         *
         * @param str A URL-encoded query string containing name/value pairs.
         */
        decode(str: string): void;
        /**
         * Returns a string containing all enumerable variables, in the MIME content encoding application/x-www-form-urlencoded.
         */
        toString(): string;
    }
}
declare namespace samchon.library {
    /**
     * A tree-structured XML object.
     *
     * The {@link XML| class contains methods and properties for working with XML objects. The {@link XML} class (along
     * with the {@link XMLList}) implements the powerful XML-handling standards defined in ECMAScript for XML (E4X)
     * specification (ECMA-357 edition 2).
     *
     * An XML object, it is composed with three members; {@link getTag tag}, {@link getProperty properties} and
     * {@link getValue value}. As you know, XML is a tree structured data expression method. The tree-stucture;
     * {@link XML} class realizes it by extending ```std.HashMap<string, XMLList>```. Child {@link XML} objects are
     * contained in the matched {@link XMLList} object being grouped by their {@link getTag tag name}. The
     * {@link XMLList} objects, they're stored in the {@link std.HashMap} ({@link XML} itself) with its **key**; common
     * {@link getTag tag name} of children {@link XML} objects.
     *
     * ```typescript
     * class XML extends std.HashMap<string, XMLList>
     * {
     *	private tag_: string;
     *	private properties_: std.HashMap<string, string>;
     *	private value_: string;
     * }
     * ```
     *
     * ```xml
     * <?xml version="1.0" ?>
     * <TAG property_name={property_value}>
     *	<!--
     *		The cchild XML objects with "CHILD_TAG", They're contained in an XMLList object.
     *		The XMLList object, it is stored in std.HashMap (XML class itself) with its key "CHILD_TAG"
     *	-->
     *	<CHILD_TAG property_name={property_value}>{value}</CHILD_TAG>
     *  <CHILD_TAG property_name={property_value}>{value}</CHILD_TAG>
     *	<CHILD_TAG property_name={property_value}>{value}</CHILD_TAG>
     *
     *	<!--
     *		The child XML object named "ANOTHER_TAG", it also belonged to an XMLList ojbect.
     *		And the XMLList is also being contained in the std.HashMap with its key "ANOTHER_TAG"
     *	-->
     *	<ANOTHER_TAG />
     * </TAG>
     * ```
     *
     * Use the {@link toString toString()} method to return a string representation of the {@link XML} object regardless
     * of whether the {@link XML} object has simple content or complex content.
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/XML.html
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-XML
     * @author Jeongho Nam <http://samchon.org>
     */
    class XML extends std.HashMap<string, XMLList> {
        /**
         * @hidden
         */
        private tag_;
        /**
         * @hidden
         */
        private value_;
        /**
         * @hidden
         */
        private property_map_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Construct from string.
         *
         * Creates {@link XML} object by parsing a string who represents xml structure.
         *
         * @param str A string represents XML structure.
         */
        constructor(str: string);
        /**
         * @hidden
         */
        private parse(str);
        /**
         * @hidden
         */
        private parse_tag(str);
        /**
         * @hidden
         */
        private parse_properties(str);
        /**
         * @hidden
         */
        private parse_value(str);
        /**
         * @hidden
         */
        private parse_children(str);
        /**
         * Get tag.
         *
         * ```xml
         * <TAG property_key={property_value}>{value}</TAG>
         * ```
         *
         * @return tag.
         */
        getTag(): string;
        /**
         * Get value.
         *
         * ```xml
         * <tag property_key={property_value}>{VALUE}</tag>
         * ```
         *
         * @return value.
         */
        getValue(): string;
        /**
         * Test whether a property exists.
         *
         * ```xml
         * <tag PROPERTY_KEY={property_value}>{value}</tag>
         * ```
         *
         * @return Whether a property has the *key* exists or not.
         */
        hasProperty(key: string): boolean;
        /**
         * Get property.
         *
         * Get property by its *key*, property name. If the matched *key* does not exist, then exception
         * {@link std.OutOfRange} is thrown. Thus, it would better to test whether the *key* exits or not by calling the
         * {@link hasProperty hasProperty()} method before calling this {@link getProperty getProperty()}.
         *
         * This method can be substituted by {@link getPropertyMap getPropertyMap()} such below:
         * - ```getPropertyMap().get(key, value);```
         * - ```getPropertyMap().find(key).second;```
         *
         * ```xml
         * <tag PROPERTY_KEY={PROPERTY_VALUE}>{value}</tag>
         * ```
         *
         * @return Value of the matched property.
         */
        getProperty(key: string): string;
        /**
         * Get property map.
         *
         * ```xml
         * <tag PROPERTY_KEY1={PROPERTY_VALUE1}
         *		PROPERTY_KEY2={PROPERTY_VALUE2}
         *		PROPERTY_KEY3={PROPERTY_VALUE3}>{value}</tag>
         * ```
         *
         * @return {@link HashMap} containing properties' keys and values.
         */
        getPropertyMap(): std.HashMap<string, string>;
        /**
         * Set tag.
         *
         * Set tag name, identifier of this {@link XML} object.
         *
         * If this {@link XML} object is belonged to, a child of, an {@link XMLList} and its related {@link XML} objects,
         * then calling this {@link setTag setTag()} method direclty is not recommended. Erase this {@link XML} object
         * from parent objects and insert this object again.
         *
         * ```xml
         * <TAG property_key={property_value}>{value}</TAG>
         * ```
         *
         * @param val To be new {@link getTag tag}.
         */
        setTag(val: string): void;
        /**
         * Set value.
         *
         * ```xml
         * <tag property_key={property_value}>{VALUE}</tag>
         * ```
         *
         * @param val To be new {@link getValue value}.
         */
        setValue(val: string): void;
        /**
         * Set property.
         *
         * Set a property *value* with its *key*. If the *key* already exists, then the *value* will be overwritten to
         * the property. Otherwise the *key* is not exist yet, then insert the *key* and *value* {@link Pair pair} to
         * {@link getPropertyMao property map}.
         *
         * This method can be substituted by {@link getPropertyMap getPropertyMap()} such below:
         * - ```getPropertyMap().set(key, value);```
         * - ```getPropertyMap().emplace(key, value);```
         * - ```getPropertyMap().insert([key, value]);```
         * - ```getPropertyMap().insert(std.make_pair(key, value));```
         *
         * ```xml
         * <tag PROPERTY_KEY={PROPERTY_VALUE}>{value}</tag>
         * ```
         *
         * @param key Key, identifier of property to be newly inserted.
         * @param value Value of new property to be newly inserted.
         */
        setProperty(key: string, value: string): void;
        /**
         * Erase property.
         *
         * Erases a property by its *key*, property name. If the matched *key* does not exist, then exception
         * {@link std.OutOfRange} is thrown. Thus, it would better to test whether the *key* exits or not by calling the
         * {@link hasProperty hasProperty()} method before calling this {@link eraseProperty eraseProperty()}.
         *
         * This method can be substituted by ``getPropertyMap().erase(key)````.
         *
         * ```xml
         * <tag PROPERTY_KEY={property_value}>{value}</tag>
         * ```
         *
         * @param key Key of the property to erase
         * @throw {@link std.OutOfRange}
         */
        eraseProperty(key: string): void;
        /**
         * @hidden
         */
        push(...args: std.Pair<string, XMLList>[]): number;
        /**
         * @hidden
         */
        push(...args: [string, XMLList][]): number;
        push(...xmls: XML[]): number;
        push(...xmlLists: XMLList[]): number;
        /**
         * Add all properties from other {@link XML} object.
         *
         * All the properties in the *obj* are copied to this {@link XML} object. If this {@link XML} object has same
         * property key in the *obj*, then value of the property will be replaced to *obj*'s own. If you don't want to
         * overwrite properties with same key, then use {@link getPropertyMap getPropertyMap()} method.
         *
         * ```typescript
         * let x: library.XML;
         * let y: library.XML;
         *
         * x.addAllProperties(y); // duplicated key exists, then overwrites
         * x.getPropertyMap().insert(y.getPropertyMap().begin(), y.getPropertyMap().end());
         *	// ducpliated key, then ignores. only non-duplicateds are copied.
         * ```
         *
         * ```xml
         * <tag PROPERTY_KEY1={property_value1}
         *		PROPERTY_KEY2={property_value2}
         *		PROPERTY_KEY3={property_value3}>{value}</tag>
         * ```
         *
         * @param obj Target {@link XML} object to copy properties.
         */
        addAllProperties(obj: XML): void;
        /**
         * Clear properties.
         *
         * Remove all properties. It's same with calling ```getPropertyMap().clear()```.
         *
         * ```xml
         * <tag PROPERTY_KEY1={property_value1}
         *		PROPERTY_KEY2={property_value2}
         *		PROPERTY_KEY3={property_value3}>{value}</tag>
         * ```
         */
        clearProperties(): void;
        /**
         * @hidden
         */
        private compute_min_index(...args);
        /**
         * @hidden
         */
        private decode_value(str);
        /**
         * @hidden
         */
        private encode_value(str);
        /**
         * @hidden
         */
        private decode_property(str);
        /**
         * @hidden
         */
        private encode_property(str);
        /**
         * {@link XML} object to xml string.
         *
         * Returns a string representation of the {@link XML} object.
         *
         * @param tab Number of tabs to spacing.
         * @return The string representation of the {@link XML} object.
         */
        toString(tab?: number): string;
    }
}
declare namespace samchon.library {
    /**
     * List of {@link XML} objects with same tag.
     *
     * @reference http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/XMLList.html
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-Library-XML
     * @author Jeongho Nam <http://samchon.org>
     */
    class XMLList extends std.Deque<XML> {
        /**
         * Get tag.
         */
        getTag(): string;
        /**
         * {@link XMLList XML objects} to string.
         *
         * Returns a string representation of the {@link XMLList XML objects}.
         *
         * @param tab Number of tabs to spacing.
         * @return The string representation of the {@link XMLList XML objects}.
         */
        toString(level?: number): string;
    }
}
declare namespace samchon.protocol {
    /**
     * An interface of entity.
     *
     * Entity is a class for standardization of expression method using on network I/O by XML. If
     * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a
     * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
     * Entity is not imposed but encouraged.
     *
     * As we could get advantages from standardization of message for network I/O with Invoke,
     * we can get additional advantage from standardizing expression method of data class with Entity.
     * We do not need to know a part of network communication. Thus, with the Entity, we can only
     * concentrate on entity's own logics and relationships between another entities. Entity does not
     * need to how network communications are being done.
     *
     * I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
     * protocol for network I/O but not a essential protocol must be kept. The expression method of
     * Entity, using on network I/O, is expressed by XML string.
     *
     * If your own network system has a critical performance issue on communication data class,
     * it would be better to using binary communication (with ByteArray).
     * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray).
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IEntity {
        /**
         * Construct data of the Entity from a XML object.
         *
         * Overrides the construct() method and fetch data of member variables from the XML.
         *
         * By recommended guidance, data representing member variables are contained in properties
         * of the put XML object.
         *
         * @param xml An xml used to contruct data of entity.
         */
        construct(xml: library.XML): void;
        /**
         * Get a key that can identify the Entity uniquely.
         *
         * If identifier of the Entity is not atomic value, returns a paired or tuple object
         * that can represents the composite identifier.
         *
         * <code>
         * class Point extends Entity
         * {
         *     private x: number;
         *     private y: number;
         *
         *     public key(): std.Pair<number, number>
         *     {
         *         return std.make_pair(this.x, this.y);
         *     }
         * }
         * </code>
         */
        key(): any;
        /**
         * A tag name when represented by XML.
         *
         * <code> <TAG {...properties} /> </code>
         */
        TAG(): string;
        /**
         * Get a XML object represents the Entity.
         *
         * A member variable (not object, but atomic value like number, string or date) is categorized
         * as a property within the framework of entity side. Thus, when overriding a toXML() method and
         * archiving member variables to an XML object to return, puts each variable to be a property
         * belongs to only a XML object.
         *
         * Don't archive the member variable of atomic value to XML::value causing enormouse creation
         * of XML objects to number of member variables. An Entity must be represented by only a XML
         * instance (tag).
         *
         * <h4> Standard Usage. </h4>
         * <code>
         * <memberList>
         *	<member id='jhnam88' name='Jeongho Nam' birthdate='1988-03-11' />
         *	<member id='master' name='Administartor' birthdate='2011-07-28' />
         * </memberList>
         * </code>
         *
         * <h4> Non-standard usage abusing value. </h4>
         * <code>
         * <member>
         *	<id>jhnam88</id>
         *	<name>Jeongho Nam</name>
         *	<birthdate>1988-03-11</birthdate>
         * </member>
         * <member>
         *	<id>master</id>
         *	<name>Administartor</name>
         *	<birthdate>2011-07-28</birthdate>
         * </member>
         * </code>
         *
         * @return An XML object representing the Entity.
         */
        toXML(): library.XML;
    }
    /**
     * @hidden
     */
    namespace IEntity {
        function construct(entity: IEntity, xml: library.XML, ...prohibited_names: string[]): void;
        function toXML(entity: IEntity, ...prohibited_names: string[]): library.XML;
    }
    /**
     * An entity, a standard data class.
     *
     * Entity is a class for standardization of expression method using on network I/O by XML. If
     * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a
     * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
     * Entity is not imposed but encouraged.
     *
     * As we could get advantages from standardization of message for network I/O with Invoke,
     * we can get additional advantage from standardizing expression method of data class with Entity.
     * We do not need to know a part of network communication. Thus, with the Entity, we can only
     * concentrate on entity's own logics and relationships between another entities. Entity does not
     * need to how network communications are being done.
     *
     * I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
     * protocol for network I/O but not a essential protocol must be kept. The expression method of
     * Entity, using on network I/O, is expressed by XML string.
     *
     * If your own network system has a critical performance issue on communication data class,
     * it would be better to using binary communication (with ByteArray).
     * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray).
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class Entity implements IEntity {
        /**
         * Default Constructor.
         */
        constructor();
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * An interface taking full charge of network communication.
     *
     * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
     * remote system, without reference to whether the remote system is a server or a client. Type of the
     * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
     * is a server (that I've to connect) or a client (a client connected to my server).
     *
     * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
     * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
     * {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link IClientDriver}, {@link IServerConnector}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
     * @author Jeongho Nam <http://samchon.org>
     */
    interface ICommunicator extends IProtocol {
        /**
         * Callback function for connection closed.
         */
        onClose: Function;
        /**
         * Close connection.
         */
        close(): void;
        /**
         * Test connection.
         *
         * Test whether this {@link ICommunicator communicator} object is connected with the remote system. If the
         * connection is alive, then returns ```true```. Otherwise, the connection is not alive or this
         * {@link ICommunicator communicator has not connected with the remote system yet, then returns ```false```.
         *
         * @return true if connected, otherwise false.
         */
        isConnected(): boolean;
        /**
         * Send message.
         *
         * Send {@link Invoke} message to remote system.
         *
         * @param invoke An {@link Invoke} message to send.
         */
        sendData(invoke: protocol.Invoke): void;
        /**
         * Handle replied message.
         *
         * Handles replied {@link Invoke} message recived from remove system. The {@link Invoke} message will be shifted
         * to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} by this method.
         *
         * @param invoke An {@link Invoke} message received from remote system.
         */
        replyData(invoke: protocol.Invoke): void;
    }
}
declare namespace samchon.protocol {
    /**
     * An abstract, basic class for communicators.
     *
     * {@link CommunicatorBase} is an abstract class implemented from the {@link ICommunicator}. Mechanism of converting
     * raw data to {@link Invoke} messag has realized in this abstract class. Type of this {@link CommunicatorBase} class
     * is specified to as below following which protocol is used.
     *
     * - {@link Communicator}: Samchon Framework's own protocool.
     * - {@link WebCommunicator}: Web-socket protocol
     * - {@link SharedWorkerCommunicator}: SharedWorker's message protocol.
     *
     * #### [Inherited] {@link ICommunicator}
     * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
     * remote system, without reference to whether the remote system is a server or a client. Type of the
     * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
     * is a server (that I've to connect) or a client (a client connected to my server).
     *
     * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
     * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
     * {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link IClientDriver}, {@link IServerConnector}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class CommunicatorBase implements ICommunicator {
        /**
         * @hidden
         */
        protected listener_: IProtocol;
        /**
         * @inheritdoc
         */
        onClose: Function;
        /**
         * @hidden
         */
        protected connected_: boolean;
        /**
         * @hidden
         */
        private binary_invoke_;
        /**
         * @hidden
         */
        private binary_parameters_;
        /**
         * @hidden
         */
        private unhandled_invokes;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Construct from *listener*.
         *
         * @param listener An {@link IProtocol} object to listen {@link Invoke} messages.
         */
        constructor(listener: IProtocol);
        /**
         * @inheritdoc
         */
        abstract close(): void;
        /**
         * @inheritdoc
         */
        isConnected(): boolean;
        /**
         * @hidden
         */
        protected is_binary_invoke(): boolean;
        /**
         * @inheritdoc
         */
        abstract sendData(invoke: Invoke): void;
        /**
         * @inheritdoc
         */
        replyData(invoke: Invoke): void;
        /**
         * @hidden
         */
        protected handle_string(str: string): void;
        /**
         * @hidden
         */
        protected handle_binary(binary: Uint8Array): void;
    }
}
declare namespace samchon.protocol {
    /**
     * A communicator following Samchon Framework's own protocol.
     *
     * {@link Communicator} is an abstract class following Samchon Framework's own protocol. This {@link Communicator}
     * class is specified to {@link ServerConnector} and {@link ClientDriver} whether the remote system is a server (that
     * my system is connecting to) or a client (a client conneting to to my server).
     *
     * Note that, if one of this or remote system is web-browser based, then you don't have to use this
     * {@link Communicator} class who follows Samchon Framework's own protocol. Web-browser supports only Web-socket
     * protocol. Thus in that case, you have to use {@link WebCommunicator} instead.
     *
     * #### [Inherited] {@link ICommunicator}
     * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
     * remote system, without reference to whether the remote system is a server or a client. Type of the
     * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
     * is a server (that I've to connect) or a client (a client connected to my server).
     *
     * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
     * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
     * {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link ClientDriver}, {@link ServerConnector}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class Communicator extends CommunicatorBase {
        /**
         * @hidden
         */
        protected socket_: socket.socket;
        /**
         * @hidden
         */
        private header_bytes_;
        /**
         * @hidden
         */
        private data_;
        /**
         * @hidden
         */
        private data_index_;
        /**
         * @hidden
         */
        private listening_;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @hidden
         */
        protected start_listen(): void;
        /**
         * @hidden
         */
        private handle_error();
        /**
         * @hidden
         */
        private handle_close();
        /**
         * @inheritdoc
         */
        sendData(invoke: Invoke): void;
        /**
         * @hidden
         */
        private listen_piece(piece);
        /**
         * @hidden
         */
        private listen_header(piece, piece_index);
        /**
         * @hidden
         */
        private listen_data(piece, piece_index);
    }
}
declare namespace samchon.protocol {
    /**
     * A communicator following Web-socket protocol.
     *
     * {@link WebCommunicator} is an abstract class following Web-socket protocol. This {@link WebCommunicator} class is
     * specified to {@link WebServerConnector} and {@link WebClientDriver} whether the remote system is a server (that my
     * system is connecting to) or a client (a client conneting to to my server).
     *
     * Note that, one of this or remote system is web-browser based, then there's not any alternative choice. Web browser
     * supports only Web-socket protocol. In that case, you've use this {@link WebCommunicator} class.
     *
     * #### [Inherited] {@link ICommunicator}
     * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
     * remote system, without reference to whether the remote system is a server or a client. Type of the
     * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
     * is a server (that I've to connect) or a client (a client connected to my server).
     *
     * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
     * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
     * {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link WebClientDriver}, {@link WebServerConnector}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class WebCommunicator extends CommunicatorBase {
        /**
         * @hidden
         */
        protected connection_: websocket.connection;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @inheritdoc
         */
        sendData(invoke: Invoke): void;
        /**
         * @hidden
         */
        protected handle_message(message: websocket.IMessage): void;
        /**
         * @hidden
         */
        protected handle_close(): void;
    }
}
declare namespace samchon.protocol {
    /**
     * A communicator for shared worker.
     *
     * {@link SharedWorkerCommunicator} is an abstract class for communication between SharedWorker and Web-browser. This
     * {@link SharedWorkerCommunicator} is specified to {@link SharedWorkerServerConnector} and
     * {@link SharedWorkerClientDriver} whether the remote system is a server (that my system is connecting to) or a client
     * (a client conneting to to my server).
     *
     * Note that, SharedWorker is a conception only existed in web-browser. This {@link SharedWorkerCommunicator} is not
     * supported in NodeJS. Only web-browser environment can utilize this {@link SharedWorkerCommunicator}.
     *
     * #### Why SharedWorker be a server?
     * SharedWorker, it allows only an instance (process) to be created whether the SharedWorker is declared in a browser
     * or multiple browsers. To integrate them, messages are being sent and received. Doesn't it seem like a relationship
     * between a server and clients? Thus, Samchon Framework consider the SharedWorker as a server and browsers as
     * clients.
     *
     * The class {@link SharedWorkerCommunicator} is designed make such relationship. From now on, SharedWorker is a
     * {@link SharedWorkerServer server} and {@link SharedWorkerServerConnector browsers} are clients. Integrate the
     * server and clients with this {@link SharedWorkerCommunicator}.
     *
     * #### [Inherited] {@link ICommunicator}
     * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
     * remote system, without reference to whether the remote system is a server or a client. Type of the
     * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
     * is a server (that I've to connect) or a client (a client connected to my server).
     *
     * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
     * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
     * {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link SharedWorkerClientDriver}, {@link SharedWorkerServerConnector}, {@link IProtocol}
     * @reference https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class SharedWorkerCommunicator extends CommunicatorBase {
        /**
         * @hidden
         */
        protected port_: MessagePort;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @inheritdoc
         */
        sendData(invoke: Invoke): void;
        /**
         * @hidden
         */
        protected handle_message(event: MessageEvent): void;
    }
}
declare namespace samchon.protocol {
    /**
     * An interface for communicator with remote client.
     *
     * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
     * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
     *
     * The {@link IClientDriver} object is created and delivered from {@link IServer} and
     * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
     * created by the matched {@link IServer} object.
     *
     * Protocol | Derived Type | Created By
     * ---------|--------------|------------
     * Samchon Framework's own | {@link ClientDriver} | {@link Server}
     * Web-socket protocol | {@link WebClientDriver} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerClientDriver} | {@link SharedWorkerServer}
     *
     * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
     * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
     * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
     * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     * Below code is an example specifying and managing the {@link IProtocol listener} objects.
     *
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link IServer}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IClientDriver extends ICommunicator {
        /**
         * Listen message from the newly connected client.
         *
         * Starts listening message from the newly connected client. Replied message from the connected client will be
         * converted to {@link Invoke} classes and shifted to the *listener*'s {@link IProtocol.replyData replyData()}
         * method.
         *
         * @param listener A listener object to listen replied message from newly connected client in
         *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
         */
        listen(listener: IProtocol): void;
    }
}
declare namespace samchon.protocol {
    /**
     * Communicator with remote client.
     *
     * {@link ClientDriver} is a class taking full charge of network communication with remote client who follows Samchon
     * Framework's own protocol. This {@link ClientDriver} object is always created by {@link Server} class. When you got
     * this {@link ClientDriver} object from the {@link Server.addClient Server.addClient()}, then specify
     * {@link IProtocol listener} with the {@link ClientDriver.listen ClientDriver.listen()} method.
     *
     * #### [Inherited] {@link IClientDriver}
     * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
     * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
     *
     * The {@link IClientDriver} object is created and delivered from {@link IServer} and
     * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
     * created by the matched {@link IServer} object.
     *
     * Protocol | Derived Type | Created By
     * ---------|--------------|------------
     * Samchon Framework's own | {@link ClientDriver} | {@link Server}
     * Web-socket protocol | {@link WebClientDriver} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerClientDriver} | {@link SharedWorkerServer}
     *
     * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
     * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
     * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
     * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     * Below code is an example specifying and managing the {@link IProtocol listener} objects.
     *
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link Server}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
     * @author Jeongho Nam <http://samchon.org>
     */
    class ClientDriver extends Communicator implements IClientDriver {
        /**
         * Construct from a socket.
         */
        constructor(socket: socket.socket);
        /**
         * @inheritdoc
         */
        listen(listener: IProtocol): void;
    }
}
declare namespace samchon.protocol {
    /**
     * Communicator with remote web-client.
     *
     * {@link WebClientDriver} is a class taking full charge of network communication with remote client who follows
     * Web-socket protocol. This {@link WebClientDriver} object is always created by {@link WebServer} class. When you
     * got this {@link WebClientDriver} object from the {@link WebServer.addClient WebServer.addClient()}, then specify
     * {@link IProtocol listener} with the {@link WebClientDriver.listen WebClientDriver.listen()} method.
     *
     * Unlike other protocol, Web-socket protocol's clients notify two parameters on their connection;
     * {@link getSessionID session-id} and {@link getPath path}. The {@link getSessionID session-id} can be used to
     * identify *user* of each client, and the {@link getPath path} can be used which type of *service* that client wants.
     * In {@link service} module, you can see the best utilization case of them.
     * - {@link service.User}: utlization of the {@link getSessionID session-id}.
     * - {@link service.Service}: utilization of the {@link getPath path}.
     *
     * #### [Inherited] {@link IClientDriver}
     * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
     * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
     *
     * The {@link IClientDriver} object is created and delivered from {@link IServer} and
     * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
     * created by the matched {@link IServer} object.
     *
     * Protocol | Derived Type | Created By
     * ---------|--------------|------------
     * Samchon Framework's own | {@link ClientDriver} | {@link Server}
     * Web-socket protocol | {@link WebClientDriver} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerClientDriver} | {@link SharedWorkerServer}
     *
     * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
     * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
     * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
     * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     * Below code is an example specifying and managing the {@link IProtocol listener} objects.
     *
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link WebServer}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
     * @author Jeongho Nam <http://samchon.org>
     */
    class WebClientDriver extends WebCommunicator implements IClientDriver {
        /**
         * @hidden
         */
        private path_;
        /**
         * @hidden
         */
        private session_id_;
        /**
         * @hidden
         */
        private listening_;
        /**
         * Initialization Constructor.
         *
         * @param connection Connection driver, a socket for web-socket.
         * @param path Requested path.
         * @param session_id Session ID, an identifier of the remote client.
         */
        constructor(connection: websocket.connection, path: string, session_id: string);
        /**
         * @inheritdoc
         */
        listen(listener: IProtocol): void;
        /**
         * Get requested path.
         */
        getPath(): string;
        /**
         * Get session ID, an identifier of the remote client.
         */
        getSessionID(): string;
    }
}
declare namespace samchon.protocol {
    /**
     * Communicator with remote web-browser.
     *
     * {@link SharedWorkerClientDriver} is a class taking full charge of network communication with web browsers. This
     * {@link SharedWorkerClientDriver} object is always created by {@link SharedWorkerServer} class. When you got this
     * {@link SharedWorkerClientDriver} object from {@link SharedWorkerServer.addClient SharedWorkerServer.addClient()},
     * then specify {@link IProtocol listener} with the
     * {@link SharedWorkerClientDriver.listen SharedWorkerClientDriver.listen()} method.
     *
     * #### Why SharedWorker be a server?
     * SharedWorker, it allows only an instance (process) to be created whether the SharedWorker is declared in a browser
     * or multiple browsers. To integrate them, messages are being sent and received. Doesn't it seem like a relationship
     * between a server and clients? Thus, Samchon Framework consider the SharedWorker as a server and browsers as
     * clients.
     *
     * The class {@link SharedWorkerCommunicator} is designed make such relationship. From now on, SharedWorker is a
     * {@link SharedWorkerServer server} and {@link SharedWorkerServerConnector browsers} are clients. Integrate the
     * server and clients with this {@link SharedWorkerCommunicator}.
     *
     * #### [Inherited] {@link IClientDriver}
     * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
     * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
     *
     * The {@link IClientDriver} object is created and delivered from {@link IServer} and
     * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
     * created by the matched {@link IServer} object.
     *
     * Protocol | Derived Type | Created By
     * ---------|--------------|------------
     * Samchon Framework's own | {@link ClientDriver} | {@link Server}
     * Web-socket protocol | {@link WebClientDriver} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerClientDriver} | {@link SharedWorkerServer}
     *
     * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
     * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
     * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
     * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     * Below code is an example specifying and managing the {@link IProtocol listener} objects.
     *
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link SharedWorkerServer}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
     * @author Jeongho Nam <http://samchon.org>
     */
    class SharedWorkerClientDriver extends SharedWorkerCommunicator implements IClientDriver {
        private listening_;
        /**
         * Construct from a MessagePort object.
         */
        constructor(port: MessagePort);
        /**
         * @inheritdoc
         */
        listen(listener: IProtocol): void;
    }
}
declare namespace samchon.protocol {
    abstract class DedicatedWorker implements IProtocol {
        private communicator_;
        /**
         * Default Constructor.
         */
        constructor();
        abstract replyData(invoke: protocol.Invoke): void;
        sendData(invoke: Invoke): void;
    }
}
declare namespace samchon.protocol {
    class DedicatedWorkerConnector extends CommunicatorBase implements IServerConnector {
        private worker;
        /**
         * @inheritdoc
         */
        onConnect: Function;
        /**
         * @inheritdoc
         */
        onClose: Function;
        constructor(listener: IProtocol);
        /**
         * @inheritdoc
         */
        connect(jsFile: string): void;
        /**
         * @inheritdoc
         */
        close(): void;
        sendData(invoke: Invoke): void;
        replyData(invoke: Invoke): void;
        private handle_message(event);
    }
}
declare namespace samchon.protocol.external {
    /**
     * A role of an external system.
     *
     * The {@link ExternalSystemRole} class represents a role, *what to do* in an {@link ExternalSystem}.
     * Extends this class and writes some methods related to the role.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Proxy Pattern </h4>
     * The {@link ExternalSystemRole} class can be an *logical proxy*. In framework within user, which
     * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalSystemRole extends Entity implements IProtocol {
        /**
         * An {@link ExternalSystem external system} containing this {@link ExternalSystemRole role}.
         */
        private system;
        /**
         * A name, represents and identifies this {@link ExternalSystemRole role}.
         *
         * This {@link name} is an identifier represents this {@link ExternalSystemRole role}. This {@link name} is
         * used in {@link ExternalSystemArray.getRole} and {@link ExternalSystem.get}, as a key elements. Thus, this
         * {@link name} should be unique in an {@link ExternalSystemArray}.
         */
        protected name: string;
        /**
         * Constructor from a system.
         *
         * @param system An external system containing this role.
         */
        constructor(system: ExternalSystem);
        /**
         * Identifier of {@link ExternalSystemRole} is its {@link name}.
         */
        key(): string;
        /**
         * Get external system, this role is belonged to.
         */
        getSystem(): ExternalSystem;
        /**
         * Get name, who represents and identifies this role.
         */
        getName(): string;
        /**
         * Send an {@link Invoke} message to the external system via {@link system}.
         *
         * @param invoke An {@link Invoke} message to send to the external system.
         */
        sendData(invoke: Invoke): void;
        /**
         * Handle replied {@link Invoke message} from the {@link system external system} belonged to.
         *
         * This {@link replyData replyData()} will call a member method named following {@link Invoke.listener}.
         * in the *invoke*.
         *
         * @param invoke An {@link Invoke} message received from the {@link system external system}.
         */
        replyData(invoke: Invoke): void;
        /**
         * Tag name of the {@link ExternalSytemRole} in {@link XML}.
         *
         * @return *role*.
         */
        TAG(): string;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedSystemRole extends external.ExternalSystemRole {
        private system_array_;
        private progress_list_;
        private history_list_;
        protected resource: number;
        constructor(systemArray: DistributedSystemArray);
        getSystemArray(): DistributedSystemArray;
        getResource(): number;
        setResource(val: number): void;
        private compute_average_elapsed_time();
        sendData(invoke: protocol.Invoke): void;
        private complete_history(history);
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    interface IEntityCollection<T extends IEntity> extends IEntityGroup<T>, collection.ICollection<T> {
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    abstract class EntityArrayCollection<T extends IEntity> extends collection.ArrayCollection<T> implements IEntityCollection<T> {
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        abstract createChild(xml: library.XML): T;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        has(key: any): boolean;
        /**
         * @inheritdoc
         */
        count(key: any): number;
        /**
         * @inheritdoc
         */
        get(key: any): T;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        abstract CHILD_TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    abstract class EntityListCollection<T extends IEntity> extends collection.ListCollection<T> implements IEntityCollection<T> {
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        abstract createChild(xml: library.XML): T;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        has(key: any): boolean;
        /**
         * @inheritdoc
         */
        count(key: any): number;
        /**
         * @inheritdoc
         */
        get(key: any): T;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        abstract CHILD_TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    abstract class EntityDequeCollection<T extends IEntity> extends collection.DequeCollection<T> implements IEntityCollection<T> {
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        abstract createChild(xml: library.XML): T;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        has(key: any): boolean;
        /**
         * @inheritdoc
         */
        count(key: any): number;
        /**
         * @inheritdoc
         */
        get(key: any): T;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        abstract CHILD_TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
/**
 * [[include: https://raw.githubusercontent.com/samchon/framework/master/handbook/TypeScript-Protocol-External_System.md]]
 */
declare namespace samchon.protocol.external {
    /**
     * An array and manager of {@link ExternalSystem external systems}.
     *
     * {@link ExternalSystemArray} is an abstract class contains and manages external system drivers,
     * {@link ExternalSystem} objects. You can specify this {@link ExternalSystemArray} to be a server accepting
     * {@link ExternalSystem external clients} or a client connecting to {@link IExternalServer external servers}. Even
     * both of them is also possible.
     *
     * <ul>
     *	<li> A server accepting external clients: {@link IExternalClientArray} </li>
     *	<li> A client connecting to external servers: {@link IExternalServerArray} </li>
     *	<li>
     *		Accepts external clients & Connects to external servers at the same time:
     *		{@link IExternalServerClientArray}
     *	</li>
     * </ul>
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Proxy Pattern </h4>
     * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
     * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalSystemArray extends EntityDequeCollection<ExternalSystem> implements IProtocol {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @hidden
         */
        private handle_system_erase(event);
        /**
         * Test whether this system array has the role.
         *
         * @param name Name, identifier of target {@link ExternalSystemRole role}.
         *
         * @return Whether the role has or not.
         */
        hasRole(name: string): boolean;
        /**
         * Get a role.
         *
         * @param name Name, identifier of target {@link ExternalSystemRole role}.
         *
         * @return The specified role.
         */
        getRole(name: string): ExternalSystemRole;
        /**
         * Send an {@link Invoke} message.
         *
         * @param invoke An {@link Invoke} message to send.
         */
        sendData(invoke: Invoke): void;
        /**
         * Handle an {@Invoke} message have received.
         *
         * @param invoke An {@link Invoke} message have received.
         */
        replyData(invoke: Invoke): void;
        /**
         * Tag name of the {@link ExternalSytemArray} in {@link XML}.
         *
         * @return *systemArray*.
         */
        TAG(): string;
        /**
         * Tag name of {@link ExternalSystem children elements} belonged to the {@link ExternalSytemArray} in {@link XML}.
         *
         * @return *system*.
         */
        CHILD_TAG(): string;
    }
}
declare namespace samchon.protocol.parallel {
    /**
     * A manager containing {@link ParallelSystem} objects.
     *
     *
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ParallelSystemArray extends external.ExternalSystemArray {
        /**
         * @hidden
         */
        private history_sequence_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @inheritdoc
         */
        at(index: number): ParallelSystem;
        /**
         *
         * @param invoke An invoke message requesting parallel process.
         * @param size Number of pieces.
         */
        sendSegmentData(invoke: Invoke, size: number): void;
        /**
         *
         *
         * @param invoke An invoke message requesting parallel process.
         * @param first Initial piece's index in a section.
         * @param last Final piece's index in a section. The ranged used is [*first*, *last*), which contains
         *			   all the pieces' indices between *first* and *last*, including the piece pointed by index
         *			   *first*, but not the piece pointed by the index *last*.
         */
        sendPieceData(invoke: Invoke, first: number, last: number): void;
        /**
         * @hidden
         */
        protected _Complete_history(history: InvokeHistory): boolean;
        /**
         * @hidden
         */
        protected _Normalize_performance(): void;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedSystemArray extends parallel.ParallelSystemArray {
        /**
         * @hidden
         */
        private role_map_;
        /**
         * Default Constructor.
         */
        constructor();
        construct(xml: library.XML): void;
        protected abstract createRole(xml: library.XML): DistributedSystemRole;
        /**
         * @inheritdoc
         */
        at(index: number): DistributedSystem;
        getRoleMap(): std.HashMap<string, DistributedSystemRole>;
        /**
         * @inheritdoc
         */
        hasRole(name: string): boolean;
        /**
         * @inheritdoc
         */
        getRole(name: string): DistributedSystemRole;
        insertRole(role: DistributedSystemRole): void;
        eraseRole(name: string): void;
        /**
         * @hidden
         */
        protected _Complete_history(history: InvokeHistory): boolean;
        /**
         * @hidden
         */
        private estimate_role_performance(history);
        /**
         * @hidden
         */
        private estimate_system_performance(history);
        /**
         * @hidden
         */
        protected _Normalize_performance(): void;
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedClientArray extends DistributedSystemArray implements external.IExternalClientArray {
        /**
         * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
         */
        private server_base_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method creating {@link IServerBase} object.
         *
         * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
         * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who
         * may connect to {@link ExternalClientArray this server} must follow the specified protocol.
         *
         * Creates and returns one of them:
         * <ul>
         *	<li> {@link ServerBase} </li>
         *	<li> {@link WebServerBase} </li>
         *	<li> {@link SharedWorkerServerBase} </li>
         * </ul>
         *
         * @return A new {@link IServerBase} object.
         */
        protected abstract createServerBase(): IServerBase;
        addClient(driver: IClientDriver): void;
        createChild(xml: library.XML): DistributedSystem;
        protected abstract createExternalClient(driver: IClientDriver): DistributedSystem;
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedSystemArrayMediator extends DistributedSystemArray {
        private mediator_;
        /**
         * Default Constructor.
         */
        constructor();
        protected abstract createMediator(): parallel.MediatorSystem;
        protected startMediator(): void;
        getMediator(): parallel.MediatorSystem;
        protected _Complete_history(history: parallel.PRInvokeHistory): boolean;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedClientArrayMediator extends DistributedSystemArrayMediator implements external.IExternalClientArray {
        /**
         * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
         */
        private server_base_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method creating {@link IServerBase} object.
         *
         * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
         * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who
         * may connect to {@link ExternalClientArray this server} must follow the specified protocol.
         *
         * Creates and returns one of them:
         * <ul>
         *	<li> {@link ServerBase} </li>
         *	<li> {@link WebServerBase} </li>
         *	<li> {@link SharedWorkerServerBase} </li>
         * </ul>
         *
         * @return A new {@link IServerBase} object.
         */
        protected abstract createServerBase(): IServerBase;
        addClient(driver: IClientDriver): void;
        createChild(xml: library.XML): DistributedSystem;
        protected abstract createExternalClient(driver: IClientDriver): DistributedSystem;
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
    }
}
declare namespace samchon.protocol.external {
    /**
     * An external system driver.
     *
     * The {@link ExternalSystem} class represents an external system, connected and interact with this system.
     * {@link ExternalSystem} takes full charge of network communication with external system have connected.
     * Replied {@link Invoke messages} from the external system is shifted to and processed in, children elements of this
     * class, {@link ExternalSystemRole} objects.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Bridge & Proxy Pattern </h4>
     * The {@link ExternalSystem} class can be a *bridge* for *logical proxy*. In framework within user,
     * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Bridge Pattern* and *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalSystem extends EntityDequeCollection<ExternalSystemRole> implements IProtocol {
        /**
         * The name represents external system have connected.
         */
        protected name: string;
        /**
         * @hidden
         */
        private system_array_;
        /**
         * @hidden
         */
        private communicator_;
        constructor(systemArray: ExternalSystemArray);
        constructor(systemArray: ExternalSystemArray, communicator: IClientDriver);
        /**
         * Default Destructor.
         */
        destructor(): void;
        /**
         * @hidden
         */
        private handle_close();
        getSystemArray(): ExternalSystemArray;
        /**
         * Identifier of {@link ExternalSystem} is its {@link name}.
         */
        key(): string;
        /**
         * Get {@link name}.
         */
        getName(): string;
        protected communicator: protocol.ICommunicator;
        close(): void;
        /**
         * Send {@link Invoke} message to external system.
         *
         * @param invoke An {@link Invoke} message to send.
         */
        sendData(invoke: Invoke): void;
        /**
         * Handle an {@Invoke} message has received.
         *
         * @param invoke An {@link Invoke} message have received.
         */
        replyData(invoke: Invoke): void;
        /**
         * Tag name of the {@link ExternalSytem} in {@link XML}.
         *
         * @return *system*.
         */
        TAG(): string;
        /**
         * Tag name of {@link ExternalSystemRole children elements} belonged to the {@link ExternalSytem} in {@link XML}.
         *
         * @return *role*.
         */
        CHILD_TAG(): string;
    }
}
declare namespace samchon.protocol.parallel {
    /**
     * An external parallel system driver.
     *
     *
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ParallelSystem extends external.ExternalSystem {
        /**
         * @hidden
         */
        private progress_list_;
        /**
         * @hidden
         */
        private history_list_;
        /**
         * @hidden
         */
        private enforced_;
        /**
         * @hidden
         */
        private exclude_;
        /**
         * Performance index.
         *
         * A performance index that indicates how much fast the connected parallel system is.
         *
         * If this {@link ParallelSystem parallel system} hasn't any {@link Invoke} message had handled, then the
         * {@link performance performance index} will be 1, which means default and average value between all
         * {@link ParallelSystem} instances (belonged to a same {@link ParallelSystemArray} object).
         *
         * You can specify this {@link performance} by yourself, but notice that, if the
         * {@link performance performance index} is higher then other {@link ParallelSystem} objects, then this
         * {@link ParallelSystem parallel system} will ordered to handle more processes than other
         * {@link ParallelSystem} objects. Otherwise, the {@link performance performance index) is lower than others,
         * of course, less processes will be delivered.
         *
         * This {@link performance index} is always re-calculated whenever {@link ParallelSystemArray} calls one of
         * them below.
         *
         * <ul>
         *	<li> {@link ParallelSystemArray.sendSegmentData ParallelSystemArray.sendSegmentData()} </li>
         *	<li> {@link ParallelSystemArray.sendPieceData ParallelSystemArray.sendPieceData()} </li>
         * </ul>
         *
         * If this class is a type of {@link DistributedSystem} derived class from the {@link ParallelSystem},
         * then {@link DistributedSystemRole.sendData DistributedSystemRole.sendData()} also cause the re-calculation.
         *
         */
        private performance;
        constructor(systemArray: ParallelSystemArray);
        constructor(systemArray: ParallelSystemArray, communicator: IClientDriver);
        destructor(): void;
        /**
         * Get manager of this object, {@link systemArray}.
         *
         * @return A manager containing this {@link ParallelSystem} object.
         */
        getSystemArray(): ParallelSystemArray;
        /**
         * Get {@link performant performance index}.
         *
         * A performance index that indicates how much fast the connected parallel system is.
         */
        getPerformance(): number;
        setPerformance(val: number): void;
        enforcePerformance(val: number): void;
        /**
         * @hidden
         */
        private send_piece_data(invoke, first, last);
        /**
         * @hidden
         */
        private _replyData(invoke);
        /**
         * @hidden
         */
        protected _Report_history(xml: library.XML): void;
        /**
         * @hidden
         */
        protected _Send_back_history(invoke: Invoke, history: InvokeHistory): void;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedSystem extends parallel.ParallelSystem {
        createChild(xml: library.XML): external.ExternalSystemRole;
        /**
         * Get manager of this object.
         *
         * @return A manager containing this {@link DistributedSystem} objects.
         */
        getSystemArray(): DistributedSystemArray;
        /**
         * @inheritdoc
         */
        has(key: string): boolean;
        /**
         * @inheritdoc
         */
        get(key: string): DistributedSystemRole;
        private compute_average_elapsed_time();
        replyData(invoke: protocol.Invoke): void;
        /**
         * @hidden
         */
        protected _Report_history(xml: library.XML): void;
        /**
         * @hidden
         */
        protected _Send_back_history(invoke: Invoke, history: InvokeHistory): void;
    }
}
declare namespace samchon.protocol.distributed {
    interface IDistributedServer extends DistributedSystem, external.IExternalServer {
        /**
         * @inheritdoc
         */
        getSystemArray(): DistributedSystemArray;
        /**
         * @inheritdoc
         */
        has(key: string): boolean;
        /**
         * @inheritdoc
         */
        get(key: string): DistributedSystemRole;
    }
    abstract class DistributedServer extends DistributedSystem implements external.IExternalServer {
        protected ip: string;
        protected port: number;
        constructor(systemArray: DistributedSystemArray);
        protected abstract createServerConnector(): IServerConnector;
        connect(): void;
        getIP(): string;
        getPort(): number;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedServerArray extends DistributedSystemArray implements external.IExternalServerArray {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedServerArrayMediator extends DistributedSystemArrayMediator implements external.IExternalServerArray {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedServerClientArray extends DistributedClientArray implements external.IExternalServerClientArray {
        /**
         * Default Constructor.
         */
        constructor();
        createChild(xml: library.XML): DistributedSystem;
        protected abstract createExternalServer(xml: library.XML): IDistributedServer;
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol.distributed {
    abstract class DistributedServerClientArrayMediator extends DistributedClientArrayMediator implements external.IExternalServerClientArray {
        /**
         * Default Constructor.
         */
        constructor();
        createChild(xml: library.XML): DistributedSystem;
        protected abstract createExternalServer(xml: library.XML): IDistributedServer;
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol {
    /**
     * A container of entity, and it's a type of entity, too.
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IEntityGroup<T extends IEntity> extends IEntity, std.base.IContainer<T> {
        /**
         * Construct data of the Entity from an XML object.
         *
         * Constructs the EntityArray's own member variables only from the input XML object.
         *
         * Do not consider about constructing children Entity objects' data in EntityArray::construct().
         * Those children Entity objects' data will constructed by their own construct() method. Even insertion
         * of XML objects representing children are done by abstract method of EntityArray::toXML().
         *
         * Constructs only data of EntityArray's own.
         */
        construct(xml: library.XML): void;
        /**
         * Factory method of a child Entity.
         *
         * EntityArray::createChild() is a factory method creating a new child Entity which is belonged
         * to the EntityArray. This method is called by EntityArray::construct(). The children construction
         * methods Entity::construct() will be called by abstract method of the EntityArray::construct().
         *
         * @return A new child Entity belongs to EntityArray.
         */
        createChild(xml: library.XML): T;
        /**
         * Get iterator to element.
         *
         * Searches the container for an element with a identifier equivalent to *key* and returns an
         * iterator to it if found, otherwise it returns an iterator to {@link end end()}.
         *
         * Two keys are considered equivalent if the container's comparison object returns false reflexively
         * (i.e., no matter the order in which the elements are passed as arguments).
         *
         * Another member functions, {@link has has()} and {@link count count()}, can be used to just check
         * whether a particular *key* exists.
         *
         * @param key Key to be searched for
         * @return An iterator to the element, if an element with specified *key* is found, or
         *		   {@link end end()} otherwise.
         */
        /**
         * Whether have the item or not.
         *
         * Indicates whether a map has an item having the specified identifier.
         *
         * @param key Key value of the element whose mapped value is accessed.
         *
         * @return Whether the map has an item having the specified identifier.
         */
        has(key: any): boolean;
        /**
         * Count elements with a specific key.
         *
         * Searches the container for elements whose key is *key* and returns the number of elements found.
         *
         * @param key Key value to be searched for.
         *
         * @return The number of elements in the container with a *key*.
         */
        count(key: any): number;
        /**
         * Get an element
         *
         * Returns a reference to the mapped value of the element identified with *key*.
         *
         * @param key Key value of the element whose mapped value is accessed.
         *
         * @throw exception out of range
         *
         * @return A reference object of the mapped value (_Ty)
         */
        get(key: any): T;
        /**
         * A tag name of children objects.
         */
        CHILD_TAG(): string;
        /**
         * Get an XML object represents the EntityArray.
         *
         * Archives the EntityArray's own member variables only to the returned XML object.
         *
         * Do not consider about archiving children Entity objects' data in EntityArray::toXML().
         * Those children Entity objects will converted to XML object by their own toXML() method. The
         * insertion of XML objects representing children are done by abstract method of
         * EntityArray::toXML().
         *
         * Archives only data of EntityArray's own.
         */
        toXML(): library.XML;
    }
    /**
     * @hidden
     */
    namespace IEntityGroup {
        /**
         * @hidden
         */
        function construct<T extends IEntity>(entityGroup: IEntityGroup<T>, xml: library.XML, ...prohibited_names: string[]): void;
        /**
         * @hidden
         */
        function toXML<T extends IEntity>(entityGroup: IEntityGroup<T>, ...prohibited_names: string[]): library.XML;
        function has<T extends IEntity>(entityGroup: IEntityGroup<T>, key: any): boolean;
        function count<T extends IEntity>(entityGroup: IEntityGroup<T>, key: any): number;
        function get<T extends IEntity>(entityGroup: IEntityGroup<T>, key: any): T;
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    abstract class EntityArray<T extends IEntity> extends std.Vector<T> implements IEntityGroup<T> {
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        abstract createChild(xml: library.XML): T;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        has(key: any): boolean;
        /**
         * @inheritdoc
         */
        count(key: any): number;
        /**
         * @inheritdoc
         */
        get(key: any): T;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        abstract CHILD_TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    abstract class EntityList<T extends IEntity> extends std.List<T> implements IEntityGroup<T> {
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        abstract createChild(xml: library.XML): T;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        has(key: any): boolean;
        /**
         * @inheritdoc
         */
        count(key: any): number;
        /**
         * @inheritdoc
         */
        get(key: any): T;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        abstract CHILD_TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * @inheritdoc
     */
    abstract class EntityDeque<T extends IEntity> extends std.Deque<T> implements IEntityGroup<T> {
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        /**
         * @inheritdoc
         */
        abstract createChild(xml: library.XML): T;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * @inheritdoc
         */
        has(key: any): boolean;
        /**
         * @inheritdoc
         */
        count(key: any): number;
        /**
         * @inheritdoc
         */
        get(key: any): T;
        /**
         * @inheritdoc
         */
        abstract TAG(): string;
        /**
         * @inheritdoc
         */
        abstract CHILD_TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    class InvokeHistory extends Entity {
        /**
         *
         */
        private uid;
        /**
         * @see {@link Invoke.listener}
         */
        private listener;
        /**
         *
         */
        private start_time_;
        /**
         *
         */
        private end_time_;
        /**
         * Default Constructor.
         */
        constructor();
        constructor(invoke: Invoke);
        construct(xml: library.XML): void;
        complete(): void;
        key(): number;
        getUID(): number;
        getListener(): string;
        getStartTime(): Date;
        getEndTime(): Date;
        computeElapsedTime(): number;
        /**
         * @inheritdoc
         */
        TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
        toInvoke(): Invoke;
    }
}
declare namespace samchon.protocol.distributed {
    class DSInvokeHistory extends InvokeHistory {
        private system_;
        private role_;
        /**
         * Construct from a DistributedSystem.
         *
         * @param system
         */
        constructor(system: DistributedSystem);
        /**
         * Initilizer Constructor.
         *
         * @param system
         * @param role
         * @param invoke
         */
        constructor(system: DistributedSystem, role: DistributedSystemRole, invoke: Invoke);
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        getSystem(): DistributedSystem;
        getRole(): DistributedSystemRole;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol.external {
    /**
     * An interface for an {@link ExternalSystemArray} accepts {@link ExternalSystem external clients} as a
     * {@link IServer server}.
     *
     * The easiest way to defining an {@link ExternalSystemArray} who opens server and accepts
     * {@link ExternalSystem external clients} is to extending one of below, who are derived from this interface
     * {@link IExternalClientArray}. However, if you can't specify an {@link ExternalSystemArray} to be whether server or
     * client, then make a class (let's name it as **BaseSystemArray**) extending {@link ExternalSystemArray} and make
     * a new class (now, I name it **BaseClientArray**) extending **BaseSystemArray** and implementing this
     * interface {@link IExternalClientArray}. Define the **BaseClientArray** following those codes on below:
     *
     * <ul>
     *	<li> {@link ExternalClientArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalClientArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link ParallelClientArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelClientArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link DistributedClientArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedClientArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IExternalClientArray extends ExternalSystemArray, IServer {
    }
    /**
     * An {@link ExternalSystemArray} acceepts {@link ExternalSystem external clients} as a {@link IServer server}.
     *
     * {@link ExternalServerArray} is an abstract class contains, manages and accepts external server drivers,
     * {@link IExternalServer} objects, as a {@link IServer server}.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Proxy Pattern </h4>
     * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
     * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalClientArray extends ExternalSystemArray implements IExternalClientArray {
        /**
         * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
         */
        private server_base_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method creating {@link IServerBase} object.
         *
         * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
         * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who
         * may connect to {@link ExternalClientArray this server} must follow the specified protocol.
         *
         * Creates and returns one of them:
         * <ul>
         *	<li> {@link ServerBase} </li>
         *	<li> {@link WebServerBase} </li>
         *	<li> {@link SharedWorkerServerBase} </li>
         * </ul>
         *
         * @return A new {@link IServerBase} object.
         */
        protected abstract createServerBase(): IServerBase;
        addClient(driver: IClientDriver): void;
        /**
         * This method is deprecated. Don't use and override this.
         *
         * @return null.
         */
        createChild(xml: library.XML): ExternalSystem;
        /**
         * Factory method creating {@link ExternalSystem} object.
         *
         * @param driver A communicator with connected client.
         * @return A newly created {@link ExternalSystem} object.
         */
        protected abstract createExternalClient(driver: IClientDriver): ExternalSystem;
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
    }
}
declare namespace samchon.protocol.external {
    /**
     * An interface for an external server driver.
     *
     * The easiest way to defining an external server driver is to extending one of below, who are derived from this
     * interface {@link IExternalServer}. However, if you've to interact with an external system who can be both server
     * and client, then make a class (let's name it as **BaseSystem**) extending {@link ExternalSystem} and make a
     * new class (now, I name it **BaseServer**) extending **BaseSystem** and implementing this interface
     * {@link IExternalServer}. Define the **BaseServer** following those codes on below:
     *
     * <ul>
     *	<li> {@link ExternalServer}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalServer.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link ParallelServer}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedServer.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link DistributedServer}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelServer.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IExternalServer extends ExternalSystem {
        connect(): void;
    }
    /**
     * An external server driver.
     *
     * The {@link ExternalServer} class represents an external server, connected and interact with this system.
     * {@link ExternalServer} takes full charge of network communication with external server have connected.
     * Replied {@link Invoke messages} from the external system is shifted to and processed in, children elements of this
     * class, {@link ExternalSystemRole} objects.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Bridge & Proxy Pattern </h4>
     * The {@link ExternalSystem} class can be a *bridge* for *logical proxy*. In framework within user,
     * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Bridge Pattern* and *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalServer extends ExternalSystem implements IExternalServer {
        /**
         * IP address of target external system to connect.
         */
        protected ip: string;
        /**
         * Port number of target external system to connect.
         */
        protected port: number;
        /**
         * Default Constructor.
         */
        constructor(systemArray: ExternalSystemArray);
        /**
         * Factory method creating server connector.
         */
        protected abstract createServerConnector(): IServerConnector;
        /**
         * @inheritdoc
         */
        connect(): void;
        /**
         * @inheritdoc
         */
        getIP(): string;
        /**
         * @inheritdoc
         */
        getPort(): number;
    }
}
declare namespace samchon.protocol.external {
    /**
     * An interface for an {@link ExternalSystemArray} connects to {@link IExternalServer external servers} as a
     * **client**.
     *
     * The easiest way to defining an {@link ExternalSystemArray} who connects to
     * {@link IExternalServer external servers} is to extending one of below, who are derived from this interface
     * {@link IExternalServerArray}. However, if you can't specify an {@link ExternalSystemArray} to be whether server or
     * client, then make a class (let's name it as **BaseSystemArray**) extending {@link ExternalSystemArray} and make
     * a new class (now, I name it **BaseServerArray**) extending **BaseSystemArray** and implementing this
     * interface {@link IExternalServerArray}. Define the **BaseServerArray** following those codes on below:
     *
     * <ul>
     *	<li> {@link ExternalServerArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalServerArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link ParallelServerArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelServerArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link DistributedServerArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedServerArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IExternalServerArray extends ExternalSystemArray {
        /**
         * Connect to {@link IExternalServer external servers}.
         *
         * This method calls children elements' method {@link IExternalServer.connect} gradually.
         */
        connect(): void;
    }
    /**
     * An {@link ExternalSystemArray} connecting to {@link IExternalServer external servers} as a **client**.
     *
     * {@link ExternalServerArray} is an abstract class contains, manages and connects to external server drivers,
     * {@link IExternalServer} objects, as a **client**.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Proxy Pattern </h4>
     * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
     * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalServerArray extends ExternalSystemArray {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol.external {
    /**
     * An interface for an {@link ExternalSystemArray} accepts {@link ExternalSystem external clients} as a
     * {@link IServer server} and connects to {@link IExternalServer} as **client**, at the same time.
     *
     * The easiest way to defining an {@link IExternalServerClientArray} who opens server, accepts
     * {@link ExternalSystem external clients} and connects to {@link IExternalServer external servers} is to extending
     * one of below, who are derived from this interface {@link IExternalServerClientArray}. However, if you can't
     * specify an {@link ExternalSystemArray} to be whether server or client or even can both them, then make a class
     * (let's name it as **BaseSystemArray**) extending {@link ExternalSystemArray} and make a new class (now, I name
     * it **BaseServerClientArray**) extending **BaseSystemArray** and implementing this interface
     * {@link IExternalServerClientArray}. Define the **BaseServerClientArray** following those codes on below:
     *
     * <ul>
     *	<li> {@link ExternalServerClientArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/external/ExternalServerClientArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link ParallelServerClientArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/ParallelServerClientArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     *	<li> {@link DistributedServerClientArray}:
     *		<a href="https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/master/DistributedServerClientArray.ts"
     *		   target="_blank"> View source code on GitHub </a>
     *	</li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IExternalServerClientArray extends IExternalServerArray, IExternalClientArray {
    }
    /**
     * An {@link ExternalSystemArray} connecting to {@link IExternalServer external servers} as a **client** and
     * accepts {@link ExternalSystem external clients} as a {@link IServer server}.
     *
     * {@link ExternalServerArray} is an abstract class contains, manages and connects to external server drivers,
     * {@link IExternalServer} objects and accepts external client drivers {@link ExternalSyste} obejcts as a
     * **client** and a {@link IServer server} at the same time.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * <h4> Proxy Pattern </h4>
     * The {@link ExternalSystemArray} class can use *Proxy Pattern*. In framework within user, which
     * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
     * important. Only interested in user's perspective is *which can be done*.
     *
     * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
     * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
     * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
     *
     * <ul>
     *	<li>
     *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
     *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
     *	</li>
     *	<li>
     *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
     *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
     *		external system.
     *	</li>
     *	<li> Those strategy is called *Proxy Pattern*. </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class ExternalServerClientArray extends ExternalClientArray implements IExternalServerClientArray {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method of a child Entity.
         *
         * This method is migrated to {@link createExternalServer createExternalServer()}. Override the
         * {@link createExternalServer createExternalServer()}.
         *
         * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
         *
         * @return A new child Entity via {@link createExternalServer createExternalServer()}.
         */
        createChild(xml: library.XML): ExternalSystem;
        /**
         * Factory method creating an {@link IExternalServer} object.
         *
         * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
         *
         * @return A newly created {@link IExternalServer} object.
         */
        protected abstract createExternalServer(xml: library.XML): IExternalServer;
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol {
    /**
     * Standard message of network I/O.
     *
     * {@link Invoke} is a class used in network I/O in protocol package of Samchon Framework.
     *
     * The Invoke message has an XML structure like the result screen of provided example in below.
     * We can enjoy lots of benefits by the normalized and standardized message structure used in
     * network I/O.
     *
     * The greatest advantage is that we can make any type of network system, even how the system
     * is enourmously complicated. As network communication message is standardized, we only need to
     * concentrate on logical relationships between network systems. We can handle each network system
     * like a object (class) in OOD. And those relationships can be easily designed by using design
     * pattern.
     *
     * In Samchon Framework, you can make any type of network system with basic componenets
     * (IProtocol, IServer and ICommunicator) by implemens or inherits them, like designing
     * classes of S/W architecture.
     *
     * @see IProtocol
     * @author Jeongho Nam <http://samchon.org>
     */
    class Invoke extends EntityArray<InvokeParameter> {
        /**
         * Listener, represent function's name.
         */
        private listener;
        /**
         * Default Constructor.
         */
        constructor();
        constructor(listener: string);
        /**
         * Copy Constructor.
         *
         * @param invoke
         */
        constructor(invoke: Invoke);
        /**
         * Construct from listener and parametric values.
         *
         * @param listener
         * @param parameters
         */
        constructor(listener: string, ...parameters: Array<number | string | library.XML>);
        /**
         * @inheritdoc
         */
        createChild(xml: library.XML): InvokeParameter;
        /**
         * Get listener.
         */
        getListener(): string;
        /**
         * Get arguments for Function.apply().
         *
         * @return An array containing values of the contained parameters.
         */
        getArguments(): Array<any>;
        /**
         * Apply to a matched function.
         */
        apply(obj: IProtocol): boolean;
        /**
         * @inheritdoc
         */
        TAG(): string;
        /**
         * @inheritdoc
         */
        CHILD_TAG(): string;
    }
}
declare namespace samchon.protocol {
    /**
     * A parameter belongs to an Invoke.
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class InvokeParameter extends Entity {
        /**
         * Name of the parameter.
         *
         * @details Optional property, can be omitted.
         */
        protected name: string;
        /**
         * Type of the parameter.
         */
        protected type: string;
        /**
         * Value of the parameter.
         */
        protected value: string | number | library.XML | Uint8Array;
        /**
         * Default Constructor.
         */
        constructor();
        constructor(val: number);
        constructor(val: string);
        constructor(val: library.XML);
        constructor(val: Uint8Array);
        /**
         * Construct from variable name and number value.
         *
         * @param name
         * @param val
         */
        constructor(name: string, val: number);
        constructor(name: string, val: string);
        constructor(name: string, val: library.XML);
        constructor(name: string, val: Uint8Array);
        /**
         * @inheritdoc
         */
        construct(xml: library.XML): void;
        setValue(value: number): void;
        setValue(value: string): void;
        setValue(value: library.XML): void;
        setValue(value: Uint8Array): void;
        /**
         * @inheritdoc
         */
        key(): any;
        /**
         * Get name.
         */
        getName(): string;
        /**
         * Get type.
         */
        getType(): string;
        /**
         * Get value.
         */
        getValue(): any;
        /**
         * @inheritdoc
         */
        TAG(): string;
        /**
         * @inheritdoc
         */
        toXML(): library.XML;
    }
}
declare namespace samchon.protocol {
    /**
     * An interface for {@link Invoke} message chain.
     *
     * {@link IProtocol} is an interface for {@link Invoke} message, which is standard message of network I/O in
     * *Samchon Framework*, chain. The {@link IProtocol} interface is used to network drivers and some classes which are
     * in a relationship of *Chain of Responsibility Pattern* with those network drivers.
     *
     * Implements {@link IProtocol} if the class sends and handles {@link Invoke} messages. Looking around source codes of
     * the *Samchon Framework*, especially *System Templates*, you can find out that all the classes and modules handling
     * {@link Invoke} messages are always implementing this {@link IProtocol}.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link Invoke}
     * @handbook https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iprotocol
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IProtocol {
        /**
         * Sending message.
         * Sends message to related system or shifts the responsibility to chain.
         *
         * @param invoke Invoke message to send
         */
        replyData(invoke: Invoke): void;
        /**
         * Handling replied message.
         * Handles replied message or shifts the responsibility to chain.
         *
         * @param invoke An {@link Invoke} message has received.
         */
        sendData(invoke: Invoke): void;
    }
}
declare namespace samchon.protocol.slave {
    abstract class SlaveSystem implements protocol.IProtocol {
        protected communicator_: ICommunicator;
        /**
         * Default Constructor.
         */
        constructor();
        sendData(invoke: Invoke): void;
        protected _replyData(invoke: Invoke): void;
        replyData(invoke: Invoke): void;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class MediatorSystem extends slave.SlaveSystem {
        private system_array_;
        private progress_list_;
        constructor(systemArray: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator);
        abstract start(): void;
        getSystemArray(): ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator;
        private complete_history(uid);
        protected _replyData(invoke: Invoke): void;
        replyData(invoke: protocol.Invoke): void;
    }
}
declare namespace samchon.protocol.parallel {
    class MediatorServer extends MediatorSystem implements slave.ISlaveServer {
        private server_base_;
        private port;
        constructor(systemArray: ParallelSystemArrayMediator, port: number);
        protected createServerBase(): IServerBase;
        addClient(driver: IClientDriver): void;
        start(): void;
        open(port: number): void;
        close(): void;
    }
    class MediatorWebServer extends MediatorServer {
        /**
         * @inheritdoc
         */
        protected createServerBase(): IServerBase;
    }
    class MediatorSharedWorkerServer extends MediatorServer {
        /**
         * @inheritdoc
         */
        protected createServerBase(): IServerBase;
    }
}
declare namespace samchon.protocol.parallel {
    class MediatorClient extends MediatorSystem implements slave.ISlaveClient {
        protected ip: string;
        protected port: number;
        constructor(systemArray: ParallelSystemArrayMediator, ip: string, port: number);
        protected createServerConnector(): IServerConnector;
        getIP(): string;
        getPort(): number;
        start(): void;
        connect(): void;
    }
    class MediatorWebClient extends MediatorClient {
        /**
         * @inheritdoc
         */
        protected createServerConnector(): IServerConnector;
    }
    class MediatorSharedWorkerClient extends MediatorClient {
        /**
         * @inheritdoc
         */
        protected createServerConnector(): IServerConnector;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelClientArray extends ParallelSystemArray implements external.IExternalClientArray {
        /**
         * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
         */
        private server_base_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method creating {@link IServerBase} object.
         *
         * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
         * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who
         * may connect to {@link ExternalClientArray this server} must follow the specified protocol.
         *
         * Creates and returns one of them:
         * <ul>
         *	<li> {@link ServerBase} </li>
         *	<li> {@link WebServerBase} </li>
         *	<li> {@link SharedWorkerServerBase} </li>
         * </ul>
         *
         * @return A new {@link IServerBase} object.
         */
        protected abstract createServerBase(): IServerBase;
        addClient(driver: IClientDriver): void;
        createChild(xml: library.XML): ParallelSystem;
        protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelSystemArrayMediator extends ParallelSystemArray {
        private mediator_;
        /**
         * Default Constructor.
         */
        constructor();
        protected abstract createMediator(): MediatorSystem;
        protected start_mediator(): void;
        getMediator(): MediatorSystem;
        protected _Complete_history(history: PRInvokeHistory): boolean;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelClientArrayMediator extends ParallelSystemArrayMediator implements external.IExternalClientArray {
        /**
         * A subrogator of {@link IServer server}'s role instead of this {@link ExternalClientArray}.
         */
        private server_base_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method creating {@link IServerBase} object.
         *
         * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
         * {@link ExternalClientArray}. If the protocol is determined, then {@link ExternalSystem external clients} who
         * may connect to {@link ExternalClientArray this server} must follow the specified protocol.
         *
         * Creates and returns one of them:
         * <ul>
         *	<li> {@link ServerBase} </li>
         *	<li> {@link WebServerBase} </li>
         *	<li> {@link SharedWorkerServerBase} </li>
         * </ul>
         *
         * @return A new {@link IServerBase} object.
         */
        protected abstract createServerBase(): IServerBase;
        addClient(driver: IClientDriver): void;
        createChild(xml: library.XML): ParallelSystem;
        protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
    }
}
declare namespace samchon.protocol.parallel {
    interface IParallelServer extends external.IExternalServer, ParallelSystem {
        /**
         * @inheritdoc
         */
        getSystemArray(): ParallelSystemArray;
    }
    abstract class ParallelServer extends ParallelSystem implements external.IExternalServer {
        protected ip: string;
        protected port: number;
        constructor(systemArray: ParallelSystemArray);
        protected abstract createServerConnector(): IServerConnector;
        connect(): void;
        getIP(): string;
        getPort(): number;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelServerArray extends ParallelSystemArray implements external.IExternalServerArray {
        constructor();
        connect(): void;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelServerArrayMediator extends ParallelSystemArrayMediator implements external.IExternalServerArray {
        constructor();
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelServerClientArray extends ParallelClientArray implements external.IExternalServerClientArray {
        /**
         * Default Constructor.
         */
        constructor();
        createChild(xml: library.XML): ParallelSystem;
        protected abstract createExternalServer(xml: library.XML): IParallelServer;
        connect(): void;
    }
}
declare namespace samchon.protocol.parallel {
    abstract class ParallelServerClientArrayMediator extends ParallelClientArrayMediator implements external.IExternalServerClientArray {
        /**
         * Default Constructor.
         */
        constructor();
        createChild(xml: library.XML): ParallelSystem;
        protected abstract createExternalServer(xml: library.XML): IParallelServer;
        /**
         * @inheritdoc
         */
        connect(): void;
    }
}
declare namespace samchon.protocol.parallel {
    class PRInvokeHistory extends InvokeHistory {
        /**
         * Index number of initial piece.
         */
        private first;
        /**
         * Index number of final piece.
         */
        private last;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Construct from an Invoke message.
         *
         * @param invoke
         */
        constructor(invoke: Invoke);
        getFirst(): number;
        getLast(): number;
        /**
         * Compute number of allocated pieces.
         */
        computeSize(): number;
    }
}
declare namespace samchon.protocol {
    /**
     * An interface for a server.
     *
     * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
     * {@link IClientDriver accepting clients}.
     *
     * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
     * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
     * object. Then at last, call {@link open()} method with specified port number.
     *
     * Protocol | Derived Type | Related {@link IClientDriver}
     * ---------|--------------|-------------------------------
     * Samchon Framework's own | {@link Server} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerClientDriver}
     *
     * Below codes and classes will be good examples for comprehending how to open a server and handleremote clients.
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
     * - {@link service.Server}
     * - {@link external.ExternalClientArray}
     * - {@link slave.SlaveServer}
     *
     * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link IClientDriver}, {@link IServerBase}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IServer {
        /**
         * Open server.
         *
         * @param port Port number to open.
         */
        open(port: number): void;
        /**
         * Close server.
         *
         * Close opened server. All remote clients, have connected with this server, are also closed and their call back
         * functions, for closed connection, {@link IClientDriver.onClose} are also called.
         */
        close(): void;
        /**
         * Add a newly connected remote client.
         *
         * Overrides this method and defines what to do with the *driver*, a newly connected remote client. Below methods
         * and example codes may be good for comprehending how to utilize this {@link addClient addClient()} method.
         *
         * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
         * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
         * - {@link service.Server.addClient}
         * - {@link external.ExternalClientArray.addClient}
         * - {@link slave.SlaveServer.addClient}
         *
         * @param driver A {@link ICommunicator communicator} with (newly connected) remote client.
         */
        addClient(driver: IClientDriver): void;
    }
}
declare namespace samchon.protocol {
    /**
     * A server.
     *
     * The {@link Server} is an abstract class designed to open a server and accept clients who are following Samchon
     * Framework's own protocol. Extends this {@link Server} class and overrides {@link addClient addClient()} method to
     * define what to do with newly connected {@link ClientDriver remote clients}.
     *
     * #### [Inherited] {@link IServer}
     * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
     * {@link IClientDriver accepting clients}.
     *
     * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
     * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
     * object. Then at last, call {@link open()} method with specified port number.
     *
     * Protocol | Derived Type | Related {@link IClientDriver}
     * ---------|--------------|-------------------------------
     * Samchon Framework's own | {@link Server} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerClientDriver}
     *
     * Below codes and classes will be good examples for comprehending how to open a server and handleremote clients.
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
     * - {@link service.Server}
     * - {@link external.ExternalClientArray}
     * - {@link slave.SlaveServer}
     *
     * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link ClientDriver}, {@link ServerBase}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class Server implements IServer {
        /**
         * @hidden
         */
        private server;
        /**
         * @inheritdoc
         */
        abstract addClient(driver: ClientDriver): void;
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @hidden
         */
        private handle_connect(socket);
    }
}
declare namespace samchon.protocol {
    /**
     * A web server.
     *
     * The {@link WebServer} is an abstract class designed to open a server and accept clients who are following
     * web-socket protocol. Extends this {@link WebServer} class and overrides {@link addClient addClient()} method to
     * define what to do with newly connected {@link WebClientDriver remote clients}.
     *
     * #### [Inherited] {@link IServer}
     * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
     * {@link IClientDriver accepting clients}.
     *
     * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
     * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
     * object. Then at last, call {@link open()} method with specified port number.
     *
     * Protocol | Derived Type | Related {@link IClientDriver}
     * ---------|--------------|-------------------------------
     * Samchon Framework's own | {@link Server} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerClientDriver}
     *
     * Below codes and classes will be good examples for comprehending how to open a server and handleremote clients.
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
     * - {@link service.Server}
     * - {@link external.ExternalClientArray}
     * - {@link slave.SlaveServer}
     *
     * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link WebClientDriver}, {@link WebServerBase}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class WebServer implements IServer {
        /**
         * @hidden
         */
        private http_server_;
        /**
         * @hidden
         */
        private sequence_;
        /**
         * @hidden
         */
        private my_port_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @inheritdoc
         */
        open(port: number): void;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @inheritdoc
         */
        abstract addClient(driver: WebClientDriver): void;
        /**
         * @hidden
         */
        private handle_request(request);
        /**
         * @hidden
         */
        private get_session_id(cookies);
        /**
         * @hidden
         */
        private issue_session_id();
    }
}
declare namespace samchon.protocol {
    /**
     * A SharedWorker server.
     *
     * The {@link SharedWorker} is an abstract class is realized to open a SharedWorker server and accept web-browser
     * clients. Extends this {@link SharedWorkerServer} class and overrides {@link addClient addClient()} method to
     * define what to do with newly connected {@link ClientDriver remote clients}.
     *
     * #### Why SharedWorker be a server?
     * SharedWorker, it allows only an instance (process) to be created whether the SharedWorker is declared in a browser
     * or multiple browsers. To integrate them, messages are being sent and received. Doesn't it seem like a relationship
     * between a server and clients? Thus, Samchon Framework consider the SharedWorker as a server and browsers as
     * clients.
     *
     * The class {@link SharedWorkerCommunicator} is designed make such relationship. From now on, SharedWorker is a
     * {@link SharedWorkerServer server} and {@link SharedWorkerServerConnector browsers} are clients. Integrate the
     * server and clients with this {@link SharedWorkerCommunicator}.
     *
     * #### [Inherited] {@link IServer}
     * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
     * {@link IClientDriver accepting clients}.
     *
     * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
     * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
     * object. Then at last, call {@link open()} method with specified port number.
     *
     * Protocol | Derived Type | Related {@link IClientDriver}
     * ---------|--------------|-------------------------------
     * Samchon Framework's own | {@link Server} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerClientDriver}
     *
     * Below codes and classes will be good examples for comprehending how to open a server and handleremote clients.
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
     * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
     * - {@link service.Server}
     * - {@link external.ExternalClientArray}
     * - {@link slave.SlaveServer}
     *
     * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link SharedWorkerClientDriver}, {@link SharedWorkerServerBase}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class SharedWorkerServer implements IServer {
        /**
         * @inheritdoc
         */
        abstract addClient(driver: SharedWorkerClientDriver): void;
        /**
         * @inheritdoc
         */
        open(): void;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @hidden
         */
        private handle_connect(event);
    }
}
declare namespace samchon.protocol {
    /**
     * An interface for substitute server classes.
     *
     * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
     *
     * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
     * However, it is impossible (that is, if the class is already extending another class), you can instead implement
     * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
     * the aggregated {@link IServerBase}.
     *
     * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
     * ---------|-----------------|---------------------|-----------------------
     * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
     *
     * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
     * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open()} method with
     * specified port number.
     *
     * ```typescript
     * class MyServer extends Something implements IServer
     * {
     * 	private server_base_: IServerBase = new WebServerBase(this);
     *
     * 	public addClient(driver: IClientDriver): void
     * 	{
     * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
     * 	}
     *
     * 	public open(port: number): void
     * 	{
     * 		this.server_base_.open();
     * 	}
     * 	public close(): void
     * 	{
     * 		this.server_base_.close();
     * 	}
     * }
     * ```
     *
     * @see {@link IServer}, {@link IClientDriver}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IServerBase extends IServer {
    }
}
declare namespace samchon.protocol {
    /**
     * A substitute {@link Server}.
     *
     * The {@link ServerBase} is a substitute class who subrogates {@link Server}'s responsibility.
     *
     * #### [Inherited] {@link IServerBase}
     * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
     *
     * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
     * However, it is impossible (that is, if the class is already extending another class), you can instead implement
     * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
     * the aggregated {@link IServerBase}.
     *
     * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
     * ---------|-----------------|---------------------|-----------------------
     * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
     *
     * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
     * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open()} method with
     * specified port number.
     *
     * ```typescript
     * class MyServer extends Something implements IServer
     * {
     * 	private server_base_: IServerBase = new WebServerBase(this);
     *
     * 	public addClient(driver: IClientDriver): void
     * 	{
     * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
     * 	}
     *
     * 	public open(port: number): void
     * 	{
     * 		this.server_base_.open();
     * 	}
     * 	public close(): void
     * 	{
     * 		this.server_base_.close();
     * 	}
     * }
     * ```
     *
     * @see {@link Server}, {@link ClientDriver}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
     * @author Jeongho Nam <http://samchon.org>
     */
    class ServerBase extends Server implements IServerBase {
        /**
         * @hidden
         */
        private hooker_;
        /**
         * Construct from a *hooker*.
         *
         * @param hooker A hooker throwing responsibility of server's role.
         */
        constructor(hooker: IServer);
        /**
         * @inheritdoc
         */
        addClient(driver: IClientDriver): void;
    }
}
declare namespace samchon.protocol {
    /**
     * A substitute {@link WebServer}.
     *
     * The {@link WebServerBase} is a substitute class who subrogates {@link WebServer}'s responsibility.
     *
     * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
     *
     * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
     * However, it is impossible (that is, if the class is already extending another class), you can instead implement
     * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
     * the aggregated {@link IServerBase}.
     *
     * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
     * ---------|-----------------|---------------------|-----------------------
     * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
     *
     * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
     * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open()} method with
     * specified port number.
     *
     * ```typescript
     * class MyServer extends Something implements IServer
     * {
     * 	private server_base_: IServerBase = new WebServerBase(this);
     *
     * 	public addClient(driver: IClientDriver): void
     * 	{
     * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
     * 	}
     *
     * 	public open(port: number): void
     * 	{
     * 		this.server_base_.open();
     * 	}
     * 	public close(): void
     * 	{
     * 		this.server_base_.close();
     * 	}
     * }
     * ```
     *
     * @see {@link WebServer}, {@link WebClientDriver}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
     * @author Jeongho Nam <http://samchon.org>
     */
    class WebServerBase extends WebServer implements IServerBase {
        /**
         * @hidden
         */
        private hooker_;
        /**
         * Construct from a *hooker*.
         *
         * @param hooker A hooker throwing responsibility of server's role.
         */
        constructor(hooker: IServer);
        /**
         * @inheritdoc
         */
        addClient(driver: IClientDriver): void;
    }
}
declare namespace samchon.protocol {
    /**
     * A substitute {@link SharedWorkerServer}.
     *
     * The {@link SharedWorkerServerBase} is a substitute class who subrogates {@link SharedWorkerServer}'s
     * responsibility.
     *
     * {@link IServerBase} is an interface for substitue server classes who subrogate server's role.
     *
     * The easiest way to defining a server class is to extending one of them below, who implemented the {@link IServer}.
     * However, it is impossible (that is, if the class is already extending another class), you can instead implement
     * the {@link IServer} interface, create an {@link IServerBase} member, and write simple hooks to route calls into
     * the aggregated {@link IServerBase}.
     *
     * Protocol | {@link IServer} | {@link IServerBase} | {@link IClientDriver}
     * ---------|-----------------|---------------------|-----------------------
     * Samchon Framework's own | {@link Server} | {@link ServerBase} | {@link ClientDriver}
     * Web-socket protocol | {@link WebServer} | {@link WebServerBase} | {@link WebClientDriver}
     * SharedWorker | {@link SharedWorkerServer} | {@link SharedWorkerServerBase} | {@link SharedWorkerClientDriver}
     *
     * After the hooking to aggregated {@link IServerBase} object, overrides {@link addClient addClient()} method who
     * accepts a newly connected client as an {@link IClientDriver} object. At last, call {@link open()} method with
     * specified port number.
     *
     * ```typescript
     * class MyServer extends Something implements IServer
     * {
     * 	private server_base_: IServerBase = new WebServerBase(this);
     *
     * 	public addClient(driver: IClientDriver): void
     * 	{
     * 		// WHAT TO DO WHEN A CLIENT HAS CONNECTED
     * 	}
     *
     * 	public open(port: number): void
     * 	{
     * 		this.server_base_.open();
     * 	}
     * 	public close(): void
     * 	{
     * 		this.server_base_.close();
     * 	}
     * }
     * ```
     *
     * @see {@link SharedWorkerServer}, {@link SharedWorkerClientDriver}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverbase)
     * @author Jeongho Nam <http://samchon.org>
     */
    class SharedWorkerServerBase extends SharedWorkerServer implements IServerBase {
        /**
         * @hidden
         */
        private hooker_;
        /**
         * Construct from a *hooker*.
         *
         * @param hooker A hooker throwing responsibility of server's role.
         */
        constructor(hooker: IServer);
        /**
         * @inheritdoc
         */
        addClient(driver: IClientDriver): void;
    }
}
declare namespace samchon.protocol {
    /**
     * An interface for server connector.
     *
     * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
     * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
     * charge of network communication with the remote server.
     *
     * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
     * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
     * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
     * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method. Below code is an example
     * connecting to remote server and interacting with it.
     *
     * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-application.ts
     *
     * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
     * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
     *
     * Protocol | Derived Type | Connect to
     * ---------|--------------|---------------
     * Samchon Framework's own | {@link ServerConnector} | {@link Server}
     * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link IServer}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
     * @author Jeongho Nam <http://samchon.org>
     */
    interface IServerConnector extends ICommunicator {
        /**
         * Callback function for connection completed.
         *
         * When you call {@link connect connect()} and the connection has completed, then this call back function
         * {@link onConnect} will be called. Note that, if the listener of this {@link onConnect} is a member method of
         * some class, then you've use the ```bind```.
         */
        onConnect: Function;
        /**
         * Connect to a server.
         *
         * Connects to a server with specified *host* address and *port* number. After the connection has
         * succeeded, callback function {@link onConnect} is called. Listening data from the connected server also begins.
         * Replied messages from the connected server will be converted to {@link Invoke} classes and will be shifted to
         * the {@link WebCommunicator.listener listener}'s {@link IProtocol.replyData replyData()} method.
         *
         * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error
         * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise,
         * the status of the connection is reported by an event. If the socket is already connected, the existing
         * connection is closed first.
         *
         * @param ip The name or IP address of the host to connect to.
         *			 If no host is specified, the host that is contacted is the host where the calling file resides.
         *			 If you do not specify a host, use an event listener to determine whether the connection was
         *			 successful.
         * @param port The port number to connect to.
         */
        connect(ip: string, port: number): void;
    }
}
declare namespace samchon.protocol {
    /**
     * Server connnector.
     *
     * {@link ServerConnector} is a class connecting to remote server who follows Samchon Framework's own protocol and
     * taking full charge of network communication with the remote server. Create a {@link ServerConnector} instance from
     * the {@IProtocol listener} and call the {@link connect connect()} method.
     *
     * #### [Inherited] {@link IServerConnector}
     * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
     * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
     * charge of network communication with the remote server.
     *
     * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
     * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
     * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
     * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
     * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
     *
     * Protocol | Derived Type | Connect to
     * ---------|--------------|---------------
     * Samchon Framework's own | {@link ServerConnector} | {@link Server}
     * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link Server}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
     * @author Jeongho Nam <http://samchon.org>
     */
    class ServerConnector extends Communicator implements IServerConnector {
        /**
         * @inheritdoc
         */
        onConnect: Function;
        /**
         * Construct from *listener*.
         *
         * @param listener A listener object to listen replied message from newly connected client in
         *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
         */
        constructor(listener: IProtocol);
        /**
         * @inheritdoc
         */
        connect(ip: string, port: number): void;
        /**
         * @hidden
         */
        private handle_connect(...arg);
    }
}
declare namespace samchon.protocol {
    /**
     * A server connector for web-socket protocol.
     *
     * {@link WebServerConnector} is a class connecting to remote server who follows Web-socket protocol and taking full
     * charge of network communication with the remote server. Create an {@link WebServerConnector} instance from the
     * {@IProtocol listener} and call the {@link connect connect()} method.
     *
     * #### [Inherited] {@link IServerConnector}
     * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
     * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
     * charge of network communication with the remote server.
     *
     * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
     * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
     * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
     * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
     * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
     *
     * Protocol | Derived Type | Connect to
     * ---------|--------------|---------------
     * Samchon Framework's own | {@link ServerConnector} | {@link Server}
     * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link WebServer}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
     * @author Jeongho Nam <http://samchon.org>
     */
    class WebServerConnector extends WebCommunicator implements IServerConnector {
        /**
         * @hidden
         */
        private browser_socket_;
        /**
         * @hidden
         */
        private node_client_;
        /**
         * @inheritdoc
         */
        onConnect: Function;
        /**
         * Construct from *listener*.
         *
         * @param listener A listener object to listen replied message from newly connected client in
         *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
         */
        constructor(listener: IProtocol);
        /**
         * Connect to a web server.
         *
         * Connects to a server with specified *host* address, *port* number and *path*. After the connection has
         * succeeded, callback function {@link onConnect} is called. Listening data from the connected server also begins.
         * Replied messages from the connected server will be converted to {@link Invoke} classes and will be shifted to
         * the {@link WebCommunicator.listener listener}'s {@link IProtocol.replyData replyData()} method.
         *
         * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error
         * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise,
         * the status of the connection is reported by an event. If the socket is already connected, the existing
         * connection is closed first.
         *
         * @param ip The name or IP address of the host to connect to.
         *			 If no host is specified, the host that is contacted is the host where the calling file resides.
         *			 If you do not specify a host, use an event listener to determine whether the connection was
         *			 successful.
         * @param port The port number to connect to.
         * @param path Path of service which you want.
         */
        connect(ip: string, port: number, path?: string): void;
        /**
         * @inheritdoc
         */
        close(): void;
        /**
         * @inheritdoc
         */
        sendData(invoke: Invoke): void;
        /**
         * @hidden
         */
        private handle_browser_connect(event);
        /**
         * @hidden
         */
        private handle_browser_message(event);
        /**
         * @hidden
         */
        private handle_node_connect(connection);
    }
}
declare namespace samchon.protocol {
    /**
     * A server connector for SharedWorker.
     *
     * {@link SharedWorkerServerConnector} is a class connecting to SharedWorker and taking full charge of network
     * communication with the SharedWorker. Create an {@link SharedWorkerServerConnector} instance from the
     * {@IProtocol listener} and call the {@link connect connect()} method.
     *
     * #### Why SharedWorker be a server?
     * SharedWorker, it allows only an instance (process) to be created whether the SharedWorker is declared in a browser
     * or multiple browsers. To integrate them, messages are being sent and received. Doesn't it seem like a relationship
     * between a server and clients? Thus, Samchon Framework consider the SharedWorker as a server and browsers as
     * clients.
     *
     * The class {@link SharedWorkerCommunicator} is designed make such relationship. From now on, SharedWorker is a
     * {@link SharedWorkerServer server} and {@link SharedWorkerServerConnector browsers} are clients. Integrate the
     * server and clients with this {@link SharedWorkerCommunicator}.
     *
     * #### [Inherited] {@link IServerConnector}
     * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
     * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
     * charge of network communication with the remote server.
     *
     * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
     * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
     * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
     * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
     *
     * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
     * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
     *
     * Protocol | Derived Type | Connect to
     * ---------|--------------|---------------
     * Samchon Framework's own | {@link ServerConnector} | {@link Server}
     * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
     * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
     *
     * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		  target="_blank">
     *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
     *		 style="max-width: 100%" />
     * </a>
     *
     * @see {@link SharedWorkerServer}, {@link IProtocol}
     * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
     * @author Jeongho Nam <http://samchon.org>
     */
    class SharedWorkerServerConnector extends SharedWorkerCommunicator implements IServerConnector {
        /**
         * @inheritdoc
         */
        onConnect: Function;
        /**
         * Construct from *listener*.
         *
         * @param listener A listener object to listen replied message from newly connected client in
         *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
         */
        constructor(listener: IProtocol);
        /**
         * Connect to a SharedWorker.
         *
         * Connects to a server with specified *jstFile* path. If a SharedWorker instance of the *jsFile* is not
         * constructed yet, then the SharedWorker will be newly constructed. Otherwise the SharedWorker already exists,
         * then connect to the SharedWorker. After those processes, callback function {@link onConnect} is called.
         * Listening data from the connected server also begins. Replied messages from the connected server will be
         * converted to {@link Invoke} classes and will be shifted to the {@link WebCommunicator.listener listener}'s
         * {@link IProtocol.replyData replyData()} method.
         *
         * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error
         * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise,
         * the status of the connection is reported by an event. If the socket is already connected, the existing
         * connection is closed first.
         *
         * @param jsFile Path of JavaScript file to execute who defines SharedWorker.
         */
        connect(jsFile: string): void;
    }
}
declare namespace samchon.protocol.service {
    abstract class Client implements protocol.IProtocol {
        private user_;
        private no_;
        private communicator_;
        private service_;
        /**
         * Construct from an User and WebClientDriver.
         */
        constructor(user: User, driver: WebClientDriver);
        /**
         * Default Destructor.
         */
        destructor(): void;
        /**
         * Factory method creating {@link Service} object.
         *
         * @param path Requested path.
         * @return A new {@link Service} typed object or ```null```.
         */
        protected abstract createService(path: string): Service;
        /**
         * Close connection.
         */
        close(): void;
        getUser(): User;
        getService(): Service;
        getNo(): number;
        /**
         * @inheritdoc
         */
        sendData(invoke: protocol.Invoke): void;
        /**
         * @inheritdoc
         */
        replyData(invoke: protocol.Invoke): void;
        protected changeService(path: string): void;
    }
}
declare namespace samchon.protocol.service {
    abstract class Server extends protocol.WebServer implements IProtocol {
        private session_map_;
        private account_map_;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Factory method creating {@link User} object.
         *
         * @return A newly created {@link User} object.
         */
        protected abstract createUser(): User;
        has(account: string): boolean;
        get(account: string): User;
        sendData(invoke: protocol.Invoke): void;
        replyData(invoke: protocol.Invoke): void;
        addClient(driver: WebClientDriver): void;
        private erase_user(user);
    }
}
declare namespace samchon.protocol.service {
    abstract class Service implements protocol.IProtocol {
        private client_;
        private path_;
        /**
         * Default Constructor.
         */
        constructor(client: Client, path: string);
        destructor(): void;
        /**
         * Get client.
         */
        getClient(): Client;
        /**
         * Get path.
         */
        getPath(): string;
        sendData(invoke: protocol.Invoke): void;
        replyData(invoke: protocol.Invoke): void;
    }
}
declare namespace samchon.protocol.service {
    abstract class User extends collection.HashMapCollection<number, Client> implements protocol.IProtocol {
        private server_;
        private session_id_;
        private sequence_;
        private account_id_;
        private authority_;
        /**
         * Construct from a Server.
         */
        constructor(server: Server);
        destructor(): void;
        protected abstract createClient(driver: WebClientDriver): Client;
        /**
         * @hidden
         */
        private handle_erase_client(event);
        getServer(): Server;
        getAccountID(): string;
        getAuthority(): number;
        setAccount(id: string, authority: number): void;
        sendData(invoke: protocol.Invoke): void;
        replyData(invoke: protocol.Invoke): void;
    }
}
declare namespace samchon.protocol.slave {
    interface ISlaveClient extends SlaveSystem {
        connect(ip: string, port: number): void;
    }
    abstract class SlaveClient extends SlaveSystem implements ISlaveClient {
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * @inheritdoc
         */
        protected abstract createServerConnector(): IServerConnector;
        /**
         * @inheritdoc
         */
        connect(ip: string, port: number): void;
    }
}
declare namespace samchon.protocol.slave {
    interface ISlaveServer extends SlaveSystem, IServer {
    }
    abstract class SlaveServer extends SlaveSystem implements ISlaveServer {
        private server_base_;
        constructor();
        protected abstract createServerBase(): IServerBase;
        open(port: number): void;
        close(): void;
        addClient(driver: IClientDriver): void;
    }
}
declare namespace samchon.protocol {
    /**
     * @hidden
     */
    namespace socket {
        type socket = any;
        type server = any;
        type http_server = any;
    }
    /**
     * @hidden
     */
    namespace websocket {
        type connection = any;
        type request = any;
        type IMessage = any;
        type ICookie = any;
        type client = any;
    }
}
declare namespace samchon.test {
    function test_collection(): void;
}
