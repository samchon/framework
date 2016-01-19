/// <reference path="Container.ts" />

/// <reference path="Iterator.ts" />

/// <reference path="Vector.ts" />
/// <reference path="Pair.ts" />

namespace std
{
    /**
     * <p> A set containing key values. </p>
     * <ul>
     *  <li> _Ty: Type of the elements. Each element in a Set is also uniquely identified by this value.
     *            Aliased as member types unordered_set::key_type and unordered_set::value_type. </li>
     * </ul>
     *
     * <p> Set is designed to pursuing formality in JavaScript. </p> 
     * <h4> Definition of std::unordered_set. </h4>
     * <ul>
     *  <li> Reference: http://www.cplusplus.com/reference/unordered_set/unordered_set/ </li>
     * </ul>
     * 
     * <p> Unordered sets are containers that store unique elements in no particular order, and which allow 
     * for fast retrieval of individual elements based on their value. </p>
     *
     * <p> In an unordered_set, the value of an element is at the same time its key, that identifies it uniquely. 
     * Keys are immutable, therefore, the elements in an unordered_set cannot be modified once in the container - 
     * they can be inserted and removed, though. </p>
     * 
     * <p> Internally, the elements in the unordered_set are not sorted in any particular order, but organized into 
     * buckets depending on their hash values to allow for fast access to individual elements directly by their values 
     * (with a constant average time complexity on average). </p>
     * 
     * <p> unordered_set containers are faster than set containers to access individual elements by their key, 
     * although they are generally less efficient for range iteration through a subset of their elements. </p> 
     *
     * <p> Iterators in the container are at least forward iterators. </p>
     * 
     * @author Jeongho Nam
     */
    export class UnorderedSet<K>
        extends Container<K>
    {
        /**
	     * <p> A data storing elements. </p>
	     * <p> Set::data_ is a list container of elements(pairs) in Set. </p>
	     */
        private data_: Vector<K>;

        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * <p> Default Constructor. </p>
         */
        public constructor();

        public constructor(items: Array<K>);

        public constructor(container: IContainer<K>);

        public constructor(begin: Iterator<K>, end: Iterator<K>);

        public constructor(...args: any[])
        {
            super();
            this.data_ = new Vector<K>();

            if (args.length == 1 && args[0] instanceof Array)
            {
                var array: Array<K> = <Array<K>>args[0];
                
                this.data_ = new Vector<K>(array);
            }
            else if (args.length == 1 && (args[0] instanceof Vector || args[1] instanceof Container))
            {
                var container: IContainer<K> = args[0];

                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
            {
                var begin: Iterator<K> = args[0];
                var end: Iterator<K> = args[1];

                this.assign(begin, end);
            }
        }

        public assign<U extends K>(begin: Iterator<U>, end: Iterator<U>): void
        {
            this.data_.assign(begin, end);
        }

        public clear(): void
        {
            this.data_.clear();
        }

        /* ---------------------------------------------------------------
            ELEMENTS I/O
        --------------------------------------------------------------- */
        /**
         * <p> Insert an element. </p>
         * <p> Inserts a new element in the Set. </p>
         *
         * <p> Each element is inserted only if it is not equivalent to any other element already 
         * in the container (elements in an unordered_set have unique values). </p>
         * 
         * <p> This effectively increases the container size by the number of elements inserted. </p>
         */
        public insert(key: K): Pair<Iterator<K>, boolean>;
        public insert(hint: Iterator<K>, val: K): Pair<Iterator<K>, boolean>;
        public insert<U extends K>(begin: Iterator<U>, end: Iterator<U>): void;

        public insert<U extends K>(...args: any[]): Pair<Iterator<K>, boolean>
        {
            if (args.length == 1)
            {
                var key: K = args[0];

                if (this.has(key) == true)
                    return new Pair<Iterator<K>, boolean>(this.end(), false);
                else
                {
                    this.data_.push(key);
                    return new Pair<Iterator<K>, boolean>(this.end().prev(), true);
                }
            }
            else if (args.length == 2 && args[1] instanceof Iterator == false)
            {
                var position: Iterator<K> = args[0];
                var key: K = args[1];

                if (this.has(key) == true)
                    return new Pair<Iterator<K>, boolean>(this.find(key), false);
                else
                {
                    var index: number = (<UnorderedSetIterator<K>>position).getIndex();
                    this.data_.insert(this.data_.begin().advance(index), key);

                    return new Pair<Iterator<K>, boolean>(new UnorderedSetIterator<K>(this, index + 1), true);
                }
            }
            else if (args.length == 2 && args[1] instanceof Iterator == true)
            {
                var begin: Iterator<U> = args[0];
                var end: Iterator<U> = args[1];

                var index: number = (<UnorderedSetIterator<K>>position).getIndex();
                var inserted: number = 0;

                for (var it = begin; it.equals(end) == false; it = it.next())
                {
                    if (this.has(it.value) == true)
                        continue;

                    this.data_.pushBack(it.value);
                    inserted++;
                }
            }
        };

        public erase(key: K): number;
        public erase(it: Iterator<K>): Iterator<K>;
        public erase(begin: Iterator<K>, end: Iterator<K>): Iterator<K>;
        
        public erase(...args: any[]): any
        {
            if (args.length == 1 && args[0] instanceof Iterator == false)
            {
                var key: K = args[0];

                if (this.has(key) == true)
                    this.erase(this.find(key));

                return this.size();
            }
            else if (args.length == 1 && args[0] instanceof Iterator)
            {
                var it: UnorderedSetIterator<K> = args[0];
                var index: number = it.getIndex();

                this.data_.splice(index, 1);
                if (this.empty() == true)
                    index = -1;

                return new UnorderedSetIterator<K>(this, index);
            }
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
            {
                var begin: UnorderedSetIterator<K> = args[0];
                var end: UnorderedSetIterator<K> = args[1];

                var beginIndex: number = begin.getIndex();
                var endIndex: number = end.getIndex();

                this.data_.splice(beginIndex, endIndex);
                if (this.empty() == true)
                    beginIndex = -1;

                return new UnorderedSetIterator<K>(this, beginIndex);
            }
        }
    
        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public begin(): Iterator<K>
        {
            if (this.empty() == true)
                return this.end();
            else
                return new UnorderedSetIterator<K>(this, 0);
        }
        
        /**
         * @inheritdoc
         */
        public end(): Iterator<K>
        {
            return new UnorderedSetIterator<K>(this, -1);
        }

        public find(key: K): Iterator<K>
        {
            var i: number;

            if (key.hasOwnProperty("equals") == true)
            {
                for (i = 0; i < this.data_.size(); i++)
                    if (this.data_.at(i)["equals"](key) == true)
                        return new UnorderedSetIterator<K>(this, i);
            }
            else
            {
                for (i = 0; i < this.data_.size(); i++)
                    if (this.data_.at(i) == key)
                        return new UnorderedSetIterator<K>(this, i);
            }
            return this.end();
        }
        
        /**
	     * <p> Get data. </p>
	     * <p> Returns the source container of the Set. </p>
	     *
	     * <h4> Note </h4>
         * <p> Changes on the returned container influences the source Set. </p>
	     */
        public data(): Vector<K>
        {
            return this.data_;
        }

        /**
	     * <p> Return container size. </p>
	     * <p> Returns the number of elements in Set container. </p>
	     *
	     * @return The number of elements in the container.
	     */
        public size(): number
        {
            return this.data_.size();
        }

        /**
	     * <p> Whether have the item or not. </p>
	     * <p> Indicates whether a map has an item having the specified identifier. </p>
	     *
	     * @param key Key value of the element whose mapped value is accessed.
	     * @return Whether the map has an item having the specified identifier
	     */
        public has(key: K): boolean
        {
            return !this.find(key).equals(this.end());
        }

        /* ---------------------------------------------------------
		    COMPARE
	    --------------------------------------------------------- */
	    /**
	     * <p> Whether a Set is equal with the Set. </p>
	     *
	     * @param obj A Set to compare
	     * @return Indicates whether equal or not.
	     */
        public equals(obj: UnorderedSet<K>): boolean 
        {
            if (this.size() != obj.size())
                return false;

            for (var i: number = 0; i < this.data_.size(); i++)
                if (this.data_.at(i) != obj.data_.at(i))
                    return false;

            return true;
        }
    }

    /**
     * <p> An iterator of a Set. </p>
     * <ul>
     *  <li> _Ty: Type of the elements. Each element in a Set is also uniquely identified by this value.
     *            Aliased as member types unordered_set::key_type and unordered_set::value_type. </li>
     * </ul>
     * 
     * @author Jeongho Nam
     */
    export class UnorderedSetIterator<K>
        extends Iterator<K>
    {
        /**
	     * <p> Sequence number of iterator in the source Set. </p>
	     */
        private index: number;

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
        public constructor(source: UnorderedSet<K>, index: number)
        {
            super(source);

            this.index = index;
        }

        public set value(key: K)
        {
            this.set.data().set(this.index, key);
        }

        /* ---------------------------------------------------------
		    GETTERS
	    --------------------------------------------------------- */
        private get set(): UnorderedSet<K>
        {
            return <UnorderedSet<K>>this.source;
        }

        /**
         * <p> Get key value of the iterator is pointing. </p>
         * 
         * @return A key value of the iterator.
         */
        public get value(): K 
        {
            return this.set.data().at(this.index);
        }

        /**
	     * <p> Whether an iterator is equal with the iterator. </p>
	     * <p> Compare two iterators and returns whether they are equal or not. </p>
	     * 
	     * <h4> Note </h4> 
         * <p> Iterator's equals() only compare souce map and index number. </p>
         * <p> Although elements, key values are equals, if the source set or
         * index number is different, then the equals() will return false. If you want to
         * compare the key values, compare them directly by yourself. </p>
	     *
	     * @param obj An iterator to compare
	     * @return Indicates whether equal or not.
	     */
        public equals(obj: Iterator<K>): boolean 
        {
            return super.equals(obj) && this.index == (<UnorderedSetIterator<K>>obj).index;
        }

        public getIndex(): number
        {
            return this.index;
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
	    /**
	     * <p> Get iterator to previous element. </p>
         * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
         *
         * @return An iterator of the previous item. 
	     */
        public prev(): Iterator<K>
        {
            if (this.index == 0)
                return this.set.end();
            else
                return new UnorderedSetIterator<K>(this.set, this.index - 1);
        }

        /**
	     * <p> Get iterator to next element. </p>
         * <p> If current iterator is the last item, returns end(). </p>
         *
         * @return An iterator of the next item.
	     */
        public next(): Iterator<K> 
        {
            if (this.index >= this.set.data().size() - 1)
                return this.set.end();
            else
                return new UnorderedSetIterator<K>(this.set, this.index + 1);
        }
    }
}