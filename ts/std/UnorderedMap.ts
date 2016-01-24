/// <reference path="Container.ts" />
/// <reference path="IMap.ts" />

/// <reference path="Iterator.ts" />

/// <reference path="Vector.ts" />
/// <reference path="Pair.ts" />

namespace std
{
    /**
     * <p> Unordered Map. </p>
     *
     * <p> Unordered maps are associative containers that store elements formed by the combination of a key value 
     * and a mapped value, and which allows for fast retrieval of individual elements based on their keys. </p>
     *
     * <p> In an <code>UnorderedMap</code>, the key value is generally used to uniquely identify the element, 
     * while the mapped value is an object with the content associated to this key. Types of key and mapped 
     * value may differ. </p>
     *
     * <p> Internally, the elements in the <code>UnorderedMap</code> are not sorted in any particular order with 
     * respect to either their key or mapped values, but organized into buckets depending on their hash values to 
     * allow for fast access to individual elements directly by their key values (with a constant average time 
     * complexity on average). </p>
     *
     * <p> <code>UnorderedMap</code> containers are faster than map containers to access individual elements by 
     * their key, although they are generally less efficient for range iteration through a subset of their 
     * elements. </p>
     *
     * <p> Unordered maps implement the direct access operator (<code>get()</code>) which allows for direct access 
     * of the mapped value using its key value as argument. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference: http://www.cplusplus.com/reference/unordered_map/unordered_map/ </li>
     * </ul>
     *
     * @tparam K Type of the key values. 
     *           Each element in an <code>UnorderedMap</code> is uniquely identified by its key value.
     * @tparam T Type of the mapped value. 
     *           Each element in an <code>UnorderedMap</code> is used to store some data as its mapped value.
     *
     * @author Migrated by Jeongho Nam
     */
    export class UnorderedMap<K, T>
        extends PairContainer<K, T>
        implements IMap<K, T>
    {
	    private data: List<Pair<K, T>>;

        private hashGroup: Vector<Vector<UnorderedMapIterator<K, T>>>;
	
        /* =========================================================
		    CONSTRUCTORS & SEMI-CONSTRUCTORS
                - CONSTRUCTORS
                - ASSIGN & CLEAR
                - HASH GROUP
	    ============================================================
            CONSTURCTORS
        --------------------------------------------------------- */
	    /**
	     * Default Constructor.
	     */
        public constructor();

	    public constructor(...args: any[])
	    {
            super();
            
            this.data = new List<Pair<K, T>>();
            this.hashGroup = new Vector<Vector<UnorderedMapIterator<K, T>>>();
	    }
        
        /* ---------------------------------------------------------
		    ASSIGN & CLEAR
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public assign<L extends K, U extends T>
            (begin: PairIterator<L, U>, end: PairIterator<L, U>): void
        {
            var it: PairIterator<L, U>;
            var size: number = 0;
            
            // REVERSE HASH_GROUP SIZE
            for (it = begin; it.equals(end) == false; it = it.next())
                size++;

            this.constructHashGroup(size * Hash.RATIO);

            // INSERT
            for (it = begin; it.equals(end) == false; it = it.next())
                this.insert(new Pair<K, T>(it.first, it.second));
        }

        /**
         * @inheritdoc
         */
        public clear(): void
        {
            this.data.clear();
        }

        /* ---------------------------------------------------------
		    HASH GROUP
	    --------------------------------------------------------- */
        private constructHashGroup(size: number = -1): void 
        {
            if (size < 10)
                size = 10;

            // CLEAR
            this.hashGroup.clear();

            // AND INSERTS WITHI CAPACITY SIZE
            for (var i: number = 0; i < size; i++)
                this.hashGroup.pushBack(new Vector<UnorderedMapIterator<K, T>>());
        }

        private reconstructHashGroup(size: number = -1): void
        {
            if (size == -1)
                size = this.size() * Hash.RATIO;

            // CONSTURCT HASH_GROUP
            this.constructHashGroup(size);

            // INSERT ELEMENTS TO HASH GROUP
            for (var it = this.begin(); it.equals(this.end()) == false; it = it.next())
                this.handleInsert(<UnorderedMapIterator<K, T>>it);
        }

	    /* =========================================================
		    ACCESSORS
                - ITERATORS
                - ELEMENTS
	    ============================================================
            ITERATOR
        --------------------------------------------------------- */
        /**
	     * @inheritdoc
	     */
        public find(key: K): PairIterator<K, T>
        {
            var hashIndex: number = this.hashIndex(key);
            var hashArray = this.hashGroup.at(hashIndex);

            for (var i: number = 0; i < hashArray.size(); i++)
                if (std.equals(hashArray.at(i).first, key))
                    return hashArray.at(i);

            return this.end();
        }

	    /**
	     * @inheritdoc
	     */
	    public begin(): PairIterator<K, T>
	    {
            return new UnorderedMapIterator<K, T>(this, <ListIterator<Pair<K, T>>>this.data.begin());
	    }

	    /**
	     * @inheritdoc
	     */
        public end(): PairIterator<K, T>
	    {
            return new UnorderedMapIterator<K, T>(this, <ListIterator<Pair<K, T>>>this.data.end());
	    }

        /* ---------------------------------------------------------
		    ELEMENTS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
	    public get(key: K): T
	    {
            var it = this.find(key);
            if (it.equals(this.end()) == true)
                throw new OutOfRange("cannot find the specified key");

            return it.second;
	    }

        /**
	     * <p> Set element. </p>
	     * <p> Set an item as the specified identifier. </p>
	     * 
	     * <p> If the identifier is already in map, change value of the identifier.
	     * If not, then insert the object with the identifier. </p>
	     * 
	     * @param key Key value of the element whose mapped value is accessed.
	     * @param val Value, the item.
	     */
	    public set(key: K, value: T): void
	    {
            var it = this.find(key);

            if (it.equals(this.end()) == true)
                this.insert(new Pair<K, T>(key, value));
            else
                it.second = value;
	    }

        /**
         * @inheritdoc
         */
        public has(key: K): boolean
        {
            return this.count(key) != 0;
        }

        /**
         * @inheritdoc
         */
        public count(key: K): number
        {
            return (this.find(key).equals(this.end()) == false) ? 1 : 0;
        }

        /**
         * @inheritdoc
         */
        public size(): number
        {
            return this.data.size();
        }

	    /* =========================================================
		    ELEMENTS I/O
                - INSERT
                - ERASE
                - POST-PROCESS
                - HASH CODE
	    ============================================================
		    INSERT
	    --------------------------------------------------------- */
        public insert(pair: Pair<K, T>): Pair<PairIterator<K, T>, boolean>;
        public insert(hint: PairIterator<K, T>, pair: Pair<K, T>): PairIterator<K, T>;
        public insert<L extends K, U extends T>
            (begin: PairIterator<K, U>, end: PairIterator<K, U>): void;

        public insert(...args: any[]): any
        {
            if (args.length == 1 && args[0] instanceof Pair)
                return this.insertByPair(args[0]);
            else if (args.length == 2 && args[0] instanceof PairIterator && args[1] instanceof Pair)
                return this.insertByHint(args[0], args[1]);
            else if (args.length == 2 && args[0] instanceof PairIterator && args[1] instanceof PairIterator)
                return this.insertByRange(args[0], args[1]);
        }

        private insertByPair(pair: Pair<K, T>): Pair<PairIterator<K, T>, boolean>
        {
            // TEST WHETHER EXISTS
            var it = this.find(pair.first);
            if (it.equals(this.end()) == false)
                return new Pair<PairIterator<K, T>, boolean>(it, false);

            // INSERT
            this.data.pushBack(pair);
            it = it.prev();

            // POST-PROCESS
            this.handleInsert(<UnorderedMapIterator<K, T>>it);

            return new Pair<PairIterator<K, T>, boolean>(it, true);
        }
        private insertByHint(hint: PairIterator<K, T>, pair: Pair<K, T>): PairIterator<K, T>
        {
            var list_it: ListIterator<Pair<K, T>> = (<UnorderedMapIterator<K, T>>hint).getListIterator();
            list_it = <ListIterator<Pair<K, T>>>
                this.data.insert((<UnorderedMapIterator<K, T>>hint).getListIterator(), pair);

            return new UnorderedMapIterator<K, T>(this, list_it);
        }
        private insertByRange<L extends K, U extends T>
            (begin: PairIterator<K, U>, end: PairIterator<K, U>): void
        {
            // CALCULATE INSERTING SIZE
            var size: number = 0;
            for (var it = begin; it.equals(end) == false; it = it.next())
                size++;

            // IF NEEDED, HASH_GROUP TO HAVE SUITABLE SIZE
            if (this.size() + size > this.hashGroup.size() * 2)
                this.reconstructHashGroup((this.size() + size) * Hash.RATIO);

            // INSERTS
            for (it = begin; it.equals(end) == false; it = it.next())
                this.insert(new Pair<K, T>(it.first, it.second));
        }

        /* ---------------------------------------------------------
		    ERASE
	    --------------------------------------------------------- */
        public erase(key: K): number;
        public erase(it: PairIterator<K, T>): PairIterator<K, T>;
        public erase(begin: PairIterator<K, T>, end: PairIterator<K, T>): PairIterator<K, T>;

        public erase(...args: any[]): any 
        {
            if (args.length == 1)
                if (args[0] instanceof PairIterator && args[0].getSource() == this)
                    return this.eraseByIterator(args[0]);
                else
                    return this.eraseByKey(args[0]);
            else if (args.length == 2 && args[0] instanceof PairIterator && args[1] instanceof PairIterator)
                return this.eraseByRange(args[0], args[1]);
        }

        private eraseByKey(key: K): number
        {
            var it = this.find(key);
            if (it.equals(this.end()) == true)
                return 0;

            this.eraseByIterator(it);
            return 1;
        }
        private eraseByIterator(it: PairIterator<K, T>): PairIterator<K, T>
        {
            // ERASE
            var listIterator = <ListIterator<Pair<K, T>>>
                this.data.erase((<UnorderedMapIterator<K, T>>it).getListIterator());
            
            // POST-PROCESS
            var resIt = new UnorderedMapIterator<K, T>(this, listIterator);
            this.handleErase(resIt);

            return resIt;
        }
        private eraseByRange(begin: PairIterator<K, T>, end: PairIterator<K, T>): PairIterator<K, T>
        {
            // ERASE
            var listIterator = <ListIterator<Pair<K, T>>>
                this.data.erase
                (
                    (<UnorderedMapIterator<K, T>>begin).getListIterator(), 
                    (<UnorderedMapIterator<K, T>>end).getListIterator()
                );
            
            // POST-PROCESS
            for (var it = begin; it.equals(this.end()) == false; it = it.next())
                this.handleErase(<UnorderedMapIterator<K, T>>it);

            return new UnorderedMapIterator<K, T>(this, listIterator);
        }

        /* ---------------------------------------------------------
		    POST-PROCESS
	    --------------------------------------------------------- */
        private handleInsert(it: UnorderedMapIterator<K, T>): void
        {
            if (this.hashGroup.size() > this.size() * 2)
                this.reconstructHashGroup();

            var key: K = it.first;
            var hashIndex: number = this.hashIndex(key);

            this.hashGroup.at(hashIndex).pushBack(it);
        }

        private handleErase(it: UnorderedMapIterator<K, T>): void
        {
            // FIND MATCHED HASHES
            var key: K = it.first;
            var hashIndex: number = this.hashIndex(key);
            
            var hashVector = this.hashGroup.at(hashIndex);

            // ERASE FROM THE HASHES
            for (var i: number = 0; i < hashVector.size(); i++)
            {
                if (std.equals(it.first, hashVector.at(i).first) == true)
                {
                    hashVector.erase(hashVector.begin().advance(i));
                    break;
                }
            }
        }

        private hashIndex(val: any): number
        {
            return Hash.code(val) % this.hashGroup.size();
        }

	    /* ---------------------------------------------------------
		    COMPARE
	    --------------------------------------------------------- */
	    ///**
	    // * <p> Whether a Map is equal with the Map. </p>
	    // *
	    // * <p> Map::equals() does not compare reference(address of pointer) of Maps or elements 
	    // * in the two Maps. The target of comparison are the key and value in all children elements(pairs). 
	    // * It's not a matter that order sequence of children are different between two Maps. </p>
	    // *
	    // * <p> If stored key or value in a pair (element) in those Maps are not number or string, but an object
	    // * like a class or struct, the comparison will be executed by a member method (SomeObject)::equals(). If
	    // * the object does not have the member method equals(), only address of pointer will be compared. </p>
	    // *
	    // * @param obj A Map to compare
	    // * @return Indicates whether equal or not.
	    // */
	    //public equals(obj: UnorderedMap<K, T>): boolean
	    //{
		   // return false;
	    //}
    }

    /**
     * <p> A bi-directional iterator. </p>
     * 
     * @tparam K Type of the keys. Each element in a map is uniquely identified by its key value.
     * @tparam T Type of the mapped value. Each element in a map stores some data as its mapped value.
     * 
     * @author Jeongho Nam
     */
    export class UnorderedMapIterator<K, T>
        extends PairIterator<K, T>
    {
	    private listIterator: ListIterator<Pair<K, T>>;

        /**
         * <p> Construct from source and index number. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in Map instead. </p> 
         *
         * @param map The source map to reference
         * @param index Sequence number of the element in the source map
         */
        constructor(source: UnorderedMap<K, T>, it: ListIterator<Pair<K, T>>)
	    {
            super(source);

		    this.listIterator = it;
	    }

        public getListIterator(): ListIterator<Pair<K, T>>
        {
            return this.listIterator;
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public prev(): PairIterator<K, T>
        {
            return new UnorderedMapIterator<K, T>
                (
                    <UnorderedMap<K, T>>this.source, 
                    <ListIterator<Pair<K, T>>>this.listIterator.prev()
                );
        }

        /**
         * @inheritdoc
         */
        public next(): PairIterator<K, T>
        {
            return new UnorderedMapIterator<K, T>
                (
                    <UnorderedMap<K, T>>this.source, 
                    <ListIterator<Pair<K, T>>>this.listIterator.next()
                );
        }

        /**
         * @inheritdoc
         */
        public advance(size: number): PairIterator<K, T>
        {
            return new UnorderedMapIterator<K, T>
                (
                    <UnorderedMap<K, T>>this.source, 
                    <ListIterator<Pair<K, T>>>this.listIterator.advance(size)
                );
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
	    /**
	     * @inheritdoc
	     */
        public equals(obj: PairIterator<K, T>): boolean
	    {
            return super.equals(obj) && this.listIterator == (<UnorderedMapIterator<K, T>>obj).listIterator;
	    }
        
        /**
         * @inheritdoc
         */
	    public get first(): K
	    {
		    return this.listIterator.value.first;
	    }

	    /**
         * @inheritdoc
         */
	    public get second(): T
	    {
		    return this.listIterator.value.second;
	    }
        
	    /**
         * @inheritdoc
         */
	    public set first(key: K)
	    {
		    this.listIterator.value.first = key;
	    }

	    /**
         * @inheritdoc
         */
	    public set second(val: T)
	    {
		    this.listIterator.value.second = val;
	    }
    }
}