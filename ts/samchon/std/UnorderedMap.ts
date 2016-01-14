/// <reference path="Container.ts" />
/// <reference path="IMap.ts" />

/// <reference path="Iterator.ts" />

/// <reference path="Vector.ts" />
/// <reference path="Pair.ts" />

namespace samchon.std
{
    /**
     * <p> A map containing pairs of key and value. </p>
     * <ul>
     *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
     *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
     * </ul>
     *
     * <p> Map is designed to pursuing formality in JavaScript. </p> 
     * <h4> Definition of std::unordered_map. </h4>
     * <ul>
     *  <li> Reference: http://www.cplusplus.com/reference/unordered_map/unordered_map/ </li>
     * </ul>
     *
     * <p> Unordered maps are associative containers that store elements formed by the combination of 
     * a key value and a mapped value, and which allows for fast retrieval of individual elements 
     * based on their keys. </p>
     *
     * <p> In an unordered_map, the key value is generally used to uniquely identify the element, while the 
     * mapped value is an object with the content associated to this key. Types of key and mapped value may 
     * differ. </p>
     *
     * <p> Internally, the elements in the unordered_map are not sorted in any particular order with respect to 
     * either their key or mapped values, but organized into buckets depending on their hash values to allow 
     * for fast access to individual elements directly by their key values (with a constant average time 
     * complexity on average). </p>
     *
     * <p> unordered_map containers are faster than map containers to access individual elements by their key, 
     * although they are generally less efficient for range iteration through a subset of their elements. </p>
     *
     * <p> Unordered maps implement the direct access operator (operator[]) which allows for direct access of 
     * the mapped value using its key value as argument. </p>
     *
     * <p> Iterators in the container are at least forward iterators. </p>
     *
     * <h4> Differences between std::unordered_map. </h4>
     * <ul>
     *	<li> Addicted Methods </li>
     *	<ul>
     *		<li> has := { find(key) != end(); } </li>
     *		<li> set := { insert({key, value}); } </li>
     *		<li> get := { find(key).second; } </li>
     *	</ul>
     *	<li> Depreciated Methods </li>
     *	<ul>
     *		<li> Modifier methods using iterators </li>
     *		<li> operator[] </li>
     *	</ul>
     * </ul>
     *
     * <h4> Note </h4>
     * <p> Do not use operator[] and hasOwnProperty(). Use get() and has() instead. </p>
     * <p> Do not iterate by <i>for statement</i> used for dynamic object of JavaScript; <i>for(var key in Map)</i> </p>. 
     * <p> Use <i>iterator</i> with begin() and end() instaed. </p>
     *
     * @author Jeongho Nam
     */
    export class UnorderedMap<K, T>
        extends PairContainer<K, T>
    {
	    /**
	     * <p> A data storing elements. </p>
	     * <p> Map::data_ is a list container of elements(pairs) in Map. </p>
	     */
	    private data_: Vector<Pair<K, T>>;
	
        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
	    /**
	     * <p> Default Constructor. </p>
	     */
        public constructor();

        public constructor();

	    public constructor(...args: any[])
	    {
            super();

		    this.data_ = new Vector<Pair<K, T>>();
	    }
        
        public assign(begin: PairIterator<K, T>, end: PairIterator<K, T>): void
        {

        }

        public clear(): void
        {
            this.data_.clear();
        }

	    /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
	    /**
	     * <p> Get data. </p>
	     * <p> Returns the source container of the Map. </p>
	     *
	     * <h4> Note </h4>
         * <p> Changes on the returned container influences the source Map. </p>
	     */
	    public data(): Vector<Pair<K, T>>
	    {
		    return this.data_;
	    }
	
	    /**
	     * <p> Return container size. </p>
	     * <p> Returns the number of elements in Map container. </p>
	     *
	     * @return The number of elements in the container.
	     */
	    public size(): number
	    {
            return this.data_.size();
	    }

        /**
         * <p> Get iterator to element. </p>
         * 
         * <p> Searches the container for an element with a identifier equivalent to <i>key</i> and 
         * returns an iterator to it if found, otherwise it returns an iterator to Map::end(). </p>
         *
         * <p> Two keys are considered equivalent if the container's comparison object returns false 
         * reflexively (i.e., no matter the order in which the elements are passed as arguments). </p>
         *
         * <p> Another member function, Map.has(), can be used to just check whether 
         * a particular key exists. </p>
         *
         * @param key Key to be searched for
         * @return An iterator to the element, if an element with specified key is found, or Map::end() otherwise.
         */
        public find(key: K): PairIterator<K, T>
        {
            for (var i: number = 0; i < this.data_.size(); i++)
                if (this.data_.at(i).first == key)
                    return new UnorderedMapIterator<K, T>(this, i);

            return this.end();
        }

        /* ---------------------------------------------------------
		    GETTERS
	    --------------------------------------------------------- */
	    /**
	     * <p> Whether have the item or not. </p>
	     * <p> Indicates whether a map has an item having the specified identifier. </p>
	     *
	     * @param key Key value of the element whose mapped value is accessed.
	     * @return Whether the map has an item having the specified identifier
	     */
	    public has(key: K): boolean
	    {
            for (var i: number = 0; i < this.data_.size(); i++)
			    if (this.data_.at(i).first == key)
				    return true;

		    return false;
	    }

	    /**
	     * <p> Get element by key. </p>
	     * <p> Returns a reference to the mapped value of the element identified with key. </p>
	     *
	     * @param key Key value of the element whose mapped value is accessed.
	     * @throw exception out of range.
	     *
	     * @return A reference object of the mapped value (_Ty)
	     */
	    public get(key: K): T
	    {
            for (var i: number = 0; i < this.data_.size(); i++)
			    if (this.data_.at(i).first == key)
				    return this.data_.at(i).second;
        
		    throw Error("out of range");
	    }

	    /* ---------------------------------------------------------
		    ITERATORS
	    --------------------------------------------------------- */
	    /**
	     * <p> Return iterator to beginning. </p>
	     * <p> Returns an iterator referring the first element in the Map container. </p>
         *
         * <h4> Note </h4>
	     * <p> If the container is empty, the returned iterator is same with end(). </p>
	     *
	     * @return An iterator to the first element in the container.
	     *         The iterator containes the first element's pair; key and value.
	     */
	    public begin(): PairIterator<K, T>
	    {
		    if (this.size() == 0)
			    return this.end();

		    return new UnorderedMapIterator<K, T>(this, 0);
	    }

	    /**
	     * <p> Return iterator to end. </p>
	     * <p> Returns an iterator referring to the past-the-end element in the Map container. </p>
	     *
	     * <p> The past-the-end element is the theoretical element that would follow the last element in 
	     * the Map container. It does not point to any element, and thus shall not be dereferenced. </p>
	     *
	     * <p> Because the ranges used by functions of the Map do not include the element reference 
	     * by their closing iterator, this function is often used in combination with Map::begin() to specify 
	     * a range including all the elements in the container. </p>
	     *
	     * <h4> Note </h4>
	     * <p> Returned iterator from Map.end() does not refer any element. Trying to accessing 
	     * element by the iterator will cause throwing exception (out of range). </p>
	     * <p> If the container is empty, this function returns the same as Map::begin(). </p>
         * 
         * @return An iterator to the end element in the container.
	     */
        public end(): PairIterator<K, T>
	    {
            return new UnorderedMapIterator<K, T>(this, -1);
	    }

	    /* ---------------------------------------------------------
		    ELEMENTS I/O AND MODIFIDERS
	    --------------------------------------------------------- */
        public insert(myEnd: PairIterator<K, T>, begin: PairIterator<K, T>, end: PairIterator<K, T> = null): PairIterator<K, T>
        {
            return null;
        }

        public erase(key: K): number;
        public erase(it: PairIterator<K, T>): PairIterator<K, T>;
        public erase<U extends T>(begin: PairIterator<K, U>, end: PairIterator<K, U>): PairIterator<K, T>;

        public erase(...args: any[]): any 
        {
            throw new std.AbstractMethodError("Have to be overriden.");
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
            for (var i: number = 0; i < this.data_.size(); i++)
			    if (this.data_.at(i).first == key)
			    {
				    this.data_.at(i).second = value;
				    return;
			    }
		    this.data_.push(new Pair<K, T>(key, value));
	    }

	    /**
	     * <p> Pop an element. </p>
	     * <p> Removes an element by its key(identifier) from the Map container and returns it. </p>
	     *
	     * @param key Key of the element to be removed from the Map.
	     * @throw exception out of range.
	     */
	    public pop(key: K): T
	    {
            for (var i: number = 0; i < this.data_.size(); i++)
			    if (this.data_.at(i).first == key)
				    return this.data_.splice(i, 1)[0].second;

		    throw Error("out of range");
	    }

	    /* ---------------------------------------------------------
		    COMPARE
	    --------------------------------------------------------- */
	    /**
	     * <p> Whether a Map is equal with the Map. </p>
	     *
	     * <p> Map::equals() does not compare reference(address of pointer) of Maps or elements 
	     * in the two Maps. The target of comparison are the key and value in all children elements(pairs). 
	     * It's not a matter that order sequence of children are different between two Maps. </p>
	     *
	     * <p> If stored key or value in a pair (element) in those Maps are not number or string, but an object
	     * like a class or struct, the comparison will be executed by a member method (SomeObject)::equals(). If
	     * the object does not have the member method equals(), only address of pointer will be compared. </p>
	     *
	     * @param obj A Map to compare
	     * @return Indicates whether equal or not.
	     */
	    public equals(obj: UnorderedMap<K, T>): boolean
	    {
		    if (this.size() != obj.size())
			    return false;

            for (var i: number = 0; i < this.data_.size(); i++)
			    if (this.data_.at(i).equals(obj.data_.at(i)) == false)
				    return false;

		    return true;
	    }

	    /* ---------------------------------------------------------
		    EXPORT
	    --------------------------------------------------------- */
	    /**
	     * <p> Returns a string representation of the Map. </p>
	     *
	     * <p> The returned string will follow the form of JSonObject </p>
         * <ul>
	     *	<li> {{"key": "???", "value": ???}, {"key": "?", "value": ?}, ...} </li>
         * </ul>
	     */
	    public toString(): string
	    {
		    var str: string = "{";
            for (var i: number = 0; i < this.data_.size(); i++)
		    {
			    var pair: Pair<K, T> = this.data_.at(i);
			    var key: string = "\"" + pair.first + "\"";
			    var value: string =
				    (typeof pair.second == "string")
					    ? "\"" + pair.second + "\""
					    : String(pair.second);

			    str += "{\"key\": " + key + ": value: " + value + "}";
		    }

		    str += "}";
		    return str;
	    }
    }

    /**
     * <p> A bi-directional iterator. </p>
     * <ul>
     *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
     *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
     * </ul>
     * 
     * @author Jeongho Nam
     */
    export class UnorderedMapIterator<_Kty, _Ty>
        extends PairIterator<_Kty, _Ty>
    {
	    /**
	     * <p> Sequence number of iterator in the source Map. </p>
	     */
	    private index: number;

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
	    constructor(source: UnorderedMap<_Kty, _Ty>, index: number)
	    {
            super(source);

		    if (index != -1 && index < source.size())
			    this.index = index;
		    else
			    this.index = -1;
	    }

	    /* ---------------------------------------------------------
		    GETTERS AND SETTERS
	    --------------------------------------------------------- */
        private get map(): UnorderedMap<_Kty, _Ty>
        {
            return <UnorderedMap<_Kty, _Ty>>(this.source);
        }

	    /**
	     * <p> Get first element (key). </p>
	     */
	    public get first(): _Kty
	    {
		    return this.map.data().at(this.index).first;
	    }

	    /**
	     * <p> Get second element (mapped value). </p>
	     */
	    public get second(): _Ty
	    {
		    return this.map.data().at(this.index).second;
	    }

	    /**
	     * <p> Set first element (key). </p>
	     */
	    public set first(key: _Kty)
	    {
		    this.map.data().at(this.index).first = key;
	    }

	    /**
	     * <p> Set second element (mapped value). </p>
	     */
	    public set second(val: _Ty)
	    {
		    this.map.data().at(this.index).second = val;
	    }

	    /* ---------------------------------------------------------
		    COMPARISON
	    --------------------------------------------------------- */
	    /**
	     * <p> Whether an iterator is equal with the iterator. </p>
	     * <p> Compare two iterators and returns whether they are equal or not. </p>
	     * 
	     * <h4> Note </h4> 
         * <p> Iterator's equals() only compare souce map and index number. </p>
         * <p> Although elements in a pair, key and value are equals, if the source map or
         * index number is different, then the equals() will return false. If you want to
         * compare the elements of a pair, compare them directly by yourself. </p>
	     *
	     * @param obj An iterator to compare
	     * @return Indicates whether equal or not.
	     */
        public equals(obj: PairIterator<_Kty, _Ty>): boolean
	    {
            return super.equals(obj) && this.index == (<UnorderedMapIterator<_Kty, _Ty>>obj).index;
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
	    public prev(): PairIterator<_Kty, _Ty>
	    {
		    if (this.index - 1 < 0)
			    return this.map.end();
		    else
                return new UnorderedMapIterator<_Kty, _Ty>(this.map, this.index - 1);
	    }

	    /**
	     * <p> Get iterator to next element. </p>
         * <p> If current iterator is the last item, returns end(). </p>
         *
         * @return An iterator of the next item.
	     */
        public next(): PairIterator<_Kty, _Ty>
	    {
		    if (this.index + 1 >= this.map.size())
			    return this.map.end();
		    else
                return new UnorderedMapIterator<_Kty, _Ty>(this.map, this.index + 1);
	    }
    }
}