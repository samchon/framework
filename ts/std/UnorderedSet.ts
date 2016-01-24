/// <reference path="Container.ts" />

/// <reference path="PairIterator.ts" />
/// <reference path="List.ts" />

namespace std
{
    /**
     * <p> Unordered Set. </p>
     *
     * <p> Unordered sets are containers that store unique elements in no particular order, and which allow for 
     * fast retrieval of individual elements based on their value. </p>
     *
     * <p> In an <code>UnorderedSet</code>, the value of an element is at the same time its key, that identifies 
     * it uniquely. Keys are immutable, therefore, the elements in an <code>UnorderedSet</code> cannot be modified 
     * once in the container - they can be inserted and removed, though. </p>
     *
     * <p> Internally, the elements in the <code>UnorderedSet</code> are not sorted in any particular order, but 
     * organized into buckets depending on their hash values to allow for fast access to individual elements directly 
     * by their values (with a constant average time complexity on average). </p>
     *
     * <p> <code>UnorderedSet</code> containers are faster than <codeSet<code> containers to access individual 
     * elements by their key, although they are generally less efficient for range iteration through a subset of 
     * their elements. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference: http://www.cplusplus.com/reference/unordered_set/unordered_set/ </li>
     * </ul>
     *
     * @tparam T Type of the elements. 
     *           Each element in an <code>UnorderedSet</code> is also uniquely identified by this value.
     *
     * @author Migrated by Jeongho Nam
     */
    export class UnorderedSet<T>
        extends Container<T>
    {
        private data: List<T>;

        private hashGroup: Vector<Vector<UnorderedSetIterator<T>>>;

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

        public constructor(items: Array<T>);

        public constructor(container: IContainer<T>);

        public constructor(begin: Iterator<T>, end: Iterator<T>);

        public constructor(...args: any[])
        {
            super();

            this.data = new List<T>();
            this.hashGroup = new Vector<Vector<UnorderedSetIterator<T>>>();

            if (args.length == 1 && args[0] instanceof Array && args[0] instanceof Vector == false)
                this.constructByArray(args[0]);
            else if (args.length == 1 && args[0] instanceof Container)
                this.constructByContainer(args[0]);
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
                this.constructByRange(args[0], args[1]);
        }

        private constructOfDefault(): void
        {
            this.constructHashGroup();
        }
        private constructByArray(items: Array<T>): void
        {
            this.constructHashGroup(items.length * Hash.RATIO);

            for (var i: number = 0; i < items.length; i++)
            {
                if (this.has(items[i]) == true)
                    continue;

                this.insert(items[i]);
            }
        }
        private constructByContainer(container: Container<T>): void
        {
            this.constructByRange(container.begin(), container.end());
        }
        private constructByRange(begin: Iterator<T>, end: Iterator<T>): void
        {
            this.assign(begin, end);
        }

        /* ---------------------------------------------------------
		    ASSIGN & CLEAR
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public assign<U extends T>(begin: Iterator<U>, end: Iterator<U>): void
        {
            var it: Iterator<U>;
            var size: number = 0;
            
            // REVERSE HASH_GROUP SIZE
            for (it = begin; it.equals(end) == false; it = it.next())
                size++;

            this.constructHashGroup(size * Hash.RATIO);

            // INSERT
            for (it = begin; it.equals(end) == false; it = it.next())
                this.insert(it.value);
        }

        /**
         * @inheritdoc
         */
        public clear(): void
        {
            this.data.clear();
            this.constructHashGroup();
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
                this.hashGroup.pushBack(new Vector<UnorderedSetIterator<T>>());
        }

        private reconstructHashGroup(size: number = -1): void
        {
            if (size == -1)
                size = this.size() * Hash.RATIO;

            // CONSTURCT HASH_GROUP
            this.constructHashGroup(size);

            //RE-INSERT ELEMENTS TO HASH GROUP
            for (var it = this.begin(); it.equals(this.end()) == false; it = it.next())
                this.handleInsert(<UnorderedSetIterator<T>>it);
        }

        /* =========================================================
		    ACCESSORS
	    ========================================================= */
        /**
         * @inheritdoc
         */
        public find(val: T): Iterator<T>
        {
            var hashIndex: number = this.hashIndex(val);
            var hashArray = this.hashGroup.at(hashIndex);

            for (var i: number = 0; i < hashArray.size(); i++)
                if (std.equals(hashArray.at(i).value, val))
                    return hashArray.at(i);

            return this.end();
        }

        /**
         * @inheritdoc
         */
        public begin(): Iterator<T>
        {
            return new UnorderedSetIterator<T>(this, <ListIterator<T>>this.data.begin());
        }

        /**
         * @inheritdoc
         */
        public end(): Iterator<T>
        {
            return new UnorderedSetIterator<T>(this, <ListIterator<T>>this.data.end());
        }

        /**
         * @inheritdoc
         */
        public has(val: T): boolean
        {
            return this.count(val) != 0;
        }

        /**
         * @inheritdoc
         */
        public count(val: T): number
        {
            return (this.find(val).equals(this.end()) == false) ? 1 : 0;
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
        public insert(val: T): Pair<Iterator<T>, boolean>;

        public insert(hint: Iterator<T>, val: T): Iterator<T>;

        public insert<U extends T>(begin: Iterator<U>, end: Iterator<U>): void

        public insert(...args: any[]): any
        {
            if (args.length == 1)
                return this.insertByVal(args[0]);
            else if (args.length == 2 && args[0] instanceof Iterator)
            {
                if (args[1] instanceof Iterator && args[0].getSource() != this && args[1].getSource() != this)
                    return this.insertByRange(args[0], args[1]);
                else
                    return this.insertByHint(args[0], args[1]);
            }
        }

        private insertByVal(val: T): Pair<Iterator<T>, boolean>
        {
            // TEST WHETHER EXISTS
            var it = this.find(val);
            if (it.equals(this.end()) == false)
                return new Pair<Iterator<T>, boolean>(it, false);

            // INSERT
            this.data.pushBack(val);
            it = it.prev();

            // POST-PROCESS
            this.handleInsert(<UnorderedSetIterator<T>>it);

            return new Pair<Iterator<T>, boolean>(it, true);
        }
        private insertByHint(hint: UnorderedSetIterator<T>, val: T): Iterator<T>
        {
            // INSERT
            var listIterator = <ListIterator<T>>this.data.insert(hint.getListIterator(), val);
            
            // POST-PROCESS
            var it = new UnorderedSetIterator(this, listIterator);
            this.handleInsert(it);

            return it;
        }
        private insertByRange(begin: Iterator<T>, end: Iterator<T>): void
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
                this.insertByVal(it.value);
        }

        /* ---------------------------------------------------------
		    ERASE
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public erase(val: T): number;

        /**
         * @inheritdoc
         */
        public erase(it: Iterator<T>): Iterator<T>;

        /**
         * @inheritdoc
         */
        public erase(begin: Iterator<T>, end: Iterator<T>): Iterator<T>;

        public erase(...args: any[]): any
        {
            if (args.length == 1)
                if (args[0] instanceof Iterator && args[0].getSource() == this)
                    return this.eraseByIterator(args[0]);
                else
                    return this.eraseByKey(args[0]);
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
                return this.eraseByRange(args[0], args[1]);
        }

        private eraseByKey(val: T): number
        {
            var it = this.find(val);
            if (it.equals(this.end()) == true)
                return 0;

            this.eraseByIterator(it);
            return 1;
        }
        private eraseByIterator(it: Iterator<T>): Iterator<T>
        {
            // ERASE
            var listIterator = <ListIterator<T>>this.data.erase((<UnorderedSetIterator<T>>it).getListIterator());
            
            // POST-PROCESS
            var resIt = new UnorderedSetIterator<T>(this, listIterator);
            this.handleErase(resIt);

            return resIt;
        }
        private eraseByRange(begin: Iterator<T>, end: Iterator<T>): Iterator<T>
        {
            // ERASE
            var listIterator = <ListIterator<T>>
                this.data.erase
                (
                    (<UnorderedSetIterator<T>>begin).getListIterator(), 
                    (<UnorderedSetIterator<T>>end).getListIterator()
                );
            
            // POST-PROCESS
            for (var it = begin; it.equals(this.end()) == false; it = it.next())
                this.handleErase(<UnorderedSetIterator<T>>it);

            return new UnorderedSetIterator<T>(this, listIterator);
        }

        /* ---------------------------------------------------------
		    POST-PROCESS
	    --------------------------------------------------------- */
        protected handleInsert(item: UnorderedSetIterator<T>): void
        {
            if (this.size() > this.hashGroup.size() * Hash.MAX_RATIO)
                this.reconstructHashGroup();

            var index: number = this.hashIndex(item.value);
            this.hashGroup.at(index).push(item);
        }

        protected handleErase(item: UnorderedSetIterator<T>): void
        {
            var index: number = this.hashIndex(item.value);
            var hashArray = this.hashGroup.at(index);
            
            for (var it = hashArray.begin(); it.equals(hashArray.end()) == false; it = it.next())
                if (it.value == item)
                {
                    hashArray.erase(it);
                    break;
                }
        }
        
        private hashIndex(val: any): number
        {
            return Hash.code(val) % this.hashGroup.size();
        }
    }

    /**
     * <p> An iterator of a UnorderedSet. </p>
     * 
     * @author Jeongho Nam
     */
    export class UnorderedSetIterator<T>
        extends Iterator<T>
    {
        private it: ListIterator<T>;

        /**
         * <p> Construct from source and index number. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in Map instead. </p> 
         *
         * @param map The source Set to reference.
         * @param index Sequence number of the element in the source Set.
         */
        public constructor(source: UnorderedSet<T>, it: ListIterator<T>)
        {
            super(source);

            this.it = it;
        }

        public getListIterator(): ListIterator<T>
        {
            return this.it;
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public prev(): Iterator<T>
        {
            return new UnorderedSetIterator<T>(<UnorderedSet<T>>this.source, <ListIterator<T>>this.prev());
        }

        /**
         * @inheritdoc
         */
        public next(): Iterator<T>
        {
            return new UnorderedSetIterator<T>(<UnorderedSet<T>>this.source, <ListIterator<T>>this.next());
        }

        /**
         * @inheritdoc
         */
        public advance(size: number): Iterator<T>
        {
            return new UnorderedSetIterator<T>(<UnorderedSet<T>>this.source, <ListIterator<T>>this.advance(size));
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public equals<U extends T>(obj: Iterator<U>): boolean 
        {
            return super.equals(obj) && this.it == (<UnorderedSetIterator<U>>obj).it;
        }

        /**
         * @inheritdoc
         */
        public get value(): T
        {
            return this.it.value;
        }

        /**
         * @inheritdoc
         */
        public set value(val: T)
        {
            this.it.value = val;
        }
    }
}