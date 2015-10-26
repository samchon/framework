function test()
{
    /*var ws: WebSocket = new WebSocket("ws://127.0.0.1:11071");
    ws.onopen = handleOpen;
    ws.onerror = handleError;
    ws.onmessage = handleMessage;*/

    var str: string =
    "<invoke listener='setDepartment'>\
		<parameter type='string'>samchon</parameter>\
		<parameter type='XML'>\
			<memberList department='programmer'>\
				<member id='john' name='John Doe' authority='3' />\
				<member id='samchon' name='Jeongho Nam' authority='5' />\
			</memberList>\
		</parameter>\
    </invoke>";

    var xml: XML = new XML(str);

    var parameterList: XMLList = xml.get("parameter");
    var parameter: XML = parameterList[0];

    trace( parameter.getValue() );

    trace
    (
        xml.get("parameter")[1]
           .get("memberList")[0].get("member")[1]
                .getProperty("id")
    );
}
function handleOpen(event: Event): void
{
    alert("handleOpen");
}
function handleError(event: Event): void
{
    alert("handleError");
}
function handleMessage(event: MessageEvent): void
{
    alert("handleMessage: " + event.data);
}

/**
 * <p> Trace arguments on screen. </p>
 * <p> Displays arguments on screen by <i>document.write</i>. </p>
 * 
 * <p> If any argument in a trace statement includes a data type other than a string, the trace function 
 * invokes the associated toString() method for that data type. If the argument which is not a string 
 * doesn't have <i>toString()</i> method, only "[object Object]" words will be traced. </p>
 *
 * <p> Trace prints words in web page direclty. It can harm ordinary layout of the page. </p>
 *
 * @param args One or more (comma separated) expressions to evaluate. 
 *			   For multiple expressions, a space is inserted between each expression in the output.
 *
 * @author Jeongho Nam
 */
function trace(...args: any[]): void
{
	var str: string = "";
	for (var i: number = 0; i < args.length; i++)
		str += args[i] + (i < args.length - 1) ? ", " : "";

	document.write(str);
}

/* =================================================================================
	LIBRARIES
====================================================================================
	* CONTAINERS
		- PAIR<_Ty1, _Ty2>
		- VECTOR<_Ty>
		- MAP<_Kty, _Ty>
			- MAP_ITERATOR<_Kty, _Ty>
			- DICTIONARY<_Ty>
	
	* UTILITIES
		- STRING_UTIL
		- XML
		- XML_LIST
================================================================================= */
/**
 * <p> A pair of values. </p>
 * <ul>
 *  <li> _Ty1: Type of member fisrt. </li>
 *  <li> _Ty2 Type of member second. </li>
 * </ul>
 *
 * <p> This class couples together a pair of values, which may be of different types 
 * (_Ty1 and _Ty2). The individual values can be accessed through its public members 
 * first and second. </p>
 *
 * <p> Same with std::pair (http://www.cplusplus.com/reference/utility/pair/) </p>
 *
 * @author Jeongho Nam
 */
class Pair<_Ty1, _Ty2>
{
	/**
	 * <p> A first value in the Pair. </p>
	 */
	public first: _Ty1;

	/**
	 * <p> A second value in the Pair. </p>
	 */
	public second: _Ty2;

	/**
	 * <p> Construct from pair values. </p>
	 *
	 * @param first The first value of the Pair
	 * @param second The second value of the Pair
	 */
	public constructor(first: _Ty1, second: _Ty2)
	{
		this.first = first;
		this.second = second;
	}
	
	/**
	 * <p> Whether a Pair is equal with the Pair. <p>
	 * <p> Compare each first and second value of two Pair(s) and returns whether they are equal or not. </p>
	 * 
	 * <p> If stored key and value in a Pair are not number or string but an object like a class or struct, 
	 * the comparison will be executed by a member method (SomeObject)::equals(). If the object does not have 
	 * the member method equals(), only address of pointer will be compared. </p>
	 *
	 * @param obj A Map to compare
	 * @return Indicates whether equal or not.
	 */
	public equals(obj: Pair<_Ty1, _Ty2>): boolean
	{
		var first: boolean;
		var second: boolean;

		if (this.first.hasOwnProperty("equals") && this.first["equals"] instanceof Function)
			first = this.first["equals"](obj.first);
		else
			first = this.first == obj.first;

		if (this.second.hasOwnProperty("equals") && this.second["equals"] instanceof Function)
			second = this.second["equals"](obj.second);
		else
			second = this.second == obj.second;

		return first == true && second == true;
	}

	/**
	 * <p> Returns a string representation of the Map. </p>
	 *
	 * <p> The returned string will follow the form of JSonObject </p>
     * <ul>
	 *	<li> {"first": "???", "second": ???} </li>
     * </ul>
	 */
	public toString(): string
	{
		return "{first: " + this.first + ", second: " + this.second + "}";
	}
}

/**
 * <p> Vector, the dynamic array. </p>
 * <ul>
 *  <li> _Ty: Type of elements. </li>
 * </ul>
 * 
 * <p> Vector is an Array. It's not the customary expression that means inheritance but 
 * dictionary meaning of the Array, which means that Vector is the Array, itself. </p>
 *
 * <p> The reason why using Vector instead of Array although there's any difference between
 * Array and Vector is for TypeScript. In TypeScript, Array is considered as an <i>interface</i>.
 * As the reason, any class can't inherit the Array in TypeScript. </p>
 *
 * <p> Vector implements the Array and filled the methods of Array and other classes 
 * can inherit array extending Vector instead of Array. </p>
 *
 * @author Jeongho Nam
 */
class Vector<_Ty> 
	implements Array<_Ty>
{
	[n: number]: _Ty;

	/**
	 * Default Constructor.
	 */
	constructor() {}

	/* ------------------------------------------------------------------------
		ACCESSORS
	------------------------------------------------------------------------ */
	/**
     * Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.
     */
	length: number;
	
	/* ------------------------------------------------------------------------
		MODIFIERS
	------------------------------------------------------------------------ */
	/**
     * Appends new elements to an array, and returns the new length of the array.
     *
     * @param items New elements of the Array.
	 * @return New length of the array.
	 */
	public push(...items: _Ty[]): number { return 0; }
	
	/**
     * Removes the last element from an array and returns it.
     */
	public pop(): _Ty { return null; }
	
	/**
     * Combines two or more arrays.
     *
     * @param items Additional items to add to the end of array1.
     */
	public concat(...items: _Ty[]): _Ty[] { return []; }

	/**
     * Adds all the elements of an array separated by the specified separator string.
     *
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
	public join(separator?: string): string { return ""; }
	
	/**
     * Reverses the elements in an Array. 
     */
	public reverse(): _Ty[] { return []; }

	/**
	 * Removes the first element from an array and returns it.
	 */
	public shift(): _Ty { return null; }

	/** 
	 * Returns a section of an array.
	 *
	 * @param start The beginning of the specified portion of the array.
	 * @param end The end of the specified portion of the array.
	 */
	public slice(start?: number, end?: number): _Ty[] { return []; }

    /** 
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
	public sort(compareFn?: (a: _Ty, b: _Ty) => number): _Ty[] { return []; }
	
	/**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     *
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the array in place of the deleted elements.
     */
	public splice(start: number, deleteCount: number = 1, ...items: _Ty[]): _Ty[] { return []; }

	/**
	 * Inserts new elements at the start of an array.
	 *
	 * @param items Elements to insert at the start of the Array.
	 */
	public unshift(...items: _Ty[]): number { return 0; }

	/**
	 * Returns the index of the first occurrence of a value in an array.
	 *
	 * @param searchElement The value to locate in the array.
	 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
	 */
	public indexOf(searchElement: _Ty, fromIndex?: number): number { return 0; }

	/**
	 * Returns the index of the last occurrence of a specified value in an array.
	 *
	 * @param searchElement The value to locate in the array.
	 * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
	 */
	public lastIndexOf(searchElement: _Ty, fromIndex?: number): number { return 0; }

	/**
	 * Determines whether all the members of an array satisfy the specified test.
	 *
	 * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
	 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 */
	public every(callbackfn: (value: _Ty, index: number, array: _Ty[]) => boolean, thisArg?: any): boolean { return false; }

	/**
	 * Determines whether the specified callback function returns true for any element of an array.
	 *
	 * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
	 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 */
	public some(callbackfn: (value: _Ty, index: number, array: _Ty[]) => boolean, thisArg?: any): boolean { return false; }

	/**
	 * Performs the specified action for each element in an array.
	 *
	 * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. 
	 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 */
	public forEach(callbackfn: (value: _Ty, index: number, array: _Ty[]) => void, thisArg?: any): void { }

	/**
	 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
	 *
	 * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. 
	 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 */
	public map<U>(callbackfn: (value: _Ty, index: number, array: _Ty[]) => U, thisArg?: any): U[] { return []; }

	/**
	 * Returns the elements of an array that meet the condition specified in a callback function.
	 * 
	 * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array. 
	 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
	 */
	public filter(callbackfn: (value: _Ty, index: number, array: _Ty[]) => boolean, thisArg?: any): _Ty[] { return []; }

	/**
	 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     *
	 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
	 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
	 */
	public reduce(callbackfn: (previousValue: _Ty, currentValue: _Ty, currentIndex: number, array: _Ty[]) => _Ty, initialValue?: _Ty): _Ty { return null; }

	/** 
	 * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
	 *
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. 
	 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
	 */
	public reduceRight(callbackfn: (previousValue: _Ty, currentValue: _Ty, currentIndex: number, array: _Ty[]) => _Ty, initialValue?: _Ty): _Ty { return null; }

	/* ------------------------------------------------------------------------
		EXPORTERS
	------------------------------------------------------------------------ */
	/**
	 * Returns a string representation of an array.
	 */
	public toString(): string { return ""; }
	public toLocaleString(): string { return ""; }
}
Vector.prototype = new Array();

/**
 * <p> An interface of a map. </p
 * <ul>
 *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
 *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
 * </ul>
 *
 * @author Jeongho Nam
 */
interface IMap<_Kty, _Ty>
{
	/**
	 * <p> Whether have the item or not. </p>
	 *
	 * @param key Key value of the element whose mapped value is accessed.
	 * @return Whether the map has an item having the specified identifier
	 */
	has(key: _Kty): boolean;

	/**
	 * <p> Get element by key. </p>
	 * 
	 * @param key Key value of the element whose mapped value is accessed.
	 * @return A reference object of the mapped value (_Ty)
	 */
	get(key: _Kty): _Ty;

	/**
	 * <p> Set element. </p>
	 *
	 * @param key Key value of the element whose mapped value is accessed.
	 * @param val Value, the item.
	 */
	set(key: _Kty, value: _Ty): void;
}

/**
 * <p> An interface of a dictionary. </p>
 * <ul>
 *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
 * </ul>
 * 
 * @author Jeongho Nam
 */
interface IDictionary<_Ty>
	extends IMap<string, _Ty>
{
}

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
class Map<_Kty, _Ty>
	implements IMap<_Kty, _Ty>
{
	/**
	 * <p> A data storing elements. </p>
	 * <p> Map::data_ is a list container of elements(pairs) in Map. </p>
	 */
	private data_: Vector<Pair<_Kty, _Ty>>;
	
	/**
	 * <p> Default Constructor. </p>
	 */
	public constructor()
	{
		this.data_ = new Vector<Pair<_Kty, _Ty>>();
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
	public data(): Vector<Pair<_Kty, _Ty>>
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
		return this.data_.length;
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
    public find(key: _Kty): MapIterator<_Kty, _Ty>
    {
        for (var i: number = 0; i < this.data_.length; i++)
            if (this.data_[i].first == key)
                return new MapIterator<_Kty, _Ty>(this, i);

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
	public has(key: _Kty): boolean
	{
		for (var i: number = 0; i < this.data_.length; i++)
			if (this.data_[i].first == key)
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
	public get(key: _Kty): _Ty
	{
		for (var i: number = 0; i < this.data_.length; i++)
			if (this.data_[i].first == key)
				return this.data_[i].second;

		throw "out of range";
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
	public begin(): MapIterator<_Kty, _Ty>
	{
		if (this.size() == 0)
			return this.end();

		return new MapIterator<_Kty, _Ty>(this, 0);
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
	 */
	public end(): MapIterator<_Kty, _Ty>
	{
		return new MapIterator<_Kty, _Ty>(this, -1);
	}

	/* ---------------------------------------------------------
		MODIFIERS
	--------------------------------------------------------- */
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
	public set(key: _Kty, value: _Ty): void
	{
		for (var i: number = 0; i < this.data_.length; i++)
			if (this.data_[i].first == key)
			{
				this.data_[i].second = value;
				return;
			}
		this.data_.push(new Pair<_Kty, _Ty>(key, value));
	}

	/**
	 * <p> Erase an element. </p>
	 * <p> Removes an element by its key(identifier) from the Map container. </p>
	 *
	 * @param key Key of the element to be removed from the Map.
	 * @throw exception out of range.
	 */
	public erase(key: _Kty): void
	{
		for (var i: number = 0; i < this.data_.length; i++)
			if (this.data_[i].first == key)
			{
				this.data_.splice(i, 1);
				return;
			}

		throw "out of range";
	}

	/**
	 * <p> Clear content. </p>
	 *
	 * <p> Removes all elements from the map container (which are destroyed), 
	 * leaving the container with a size of 0. </p>
	 */
	public clear(): void
	{
		this.data_ = new Vector<Pair<_Kty, _Ty>>();
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
	public equals(obj: Map<_Kty, _Ty>): boolean
	{
		if (this.size() != obj.size())
			return false;

		for (var i: number = 0; i < this.data_.length; i++)
			if (this.data_[i].equals(obj.data_[i]) == false)
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
		for (var i: number = 0; i < this.data_.length; i++)
		{
			var pair: Pair<_Kty, _Ty> = this.data_[i];
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
class MapIterator<_Kty, _Ty>
{
	/**
	 * <p> The source map being referenced. </p>
	 */
	private map: Map<_Kty, _Ty>;

	/**
	 * <p> Sequence number of iterator in the source map. </p>
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
	constructor(map: Map<_Kty, _Ty>, index: number)
	{
		this.map = map;
		
		if (index != -1 && index < map.size())
			this.index = index;
		else
			this.index = -1;
	}

	/* ---------------------------------------------------------
		GETTERS AND SETTERS
	--------------------------------------------------------- */
	/**
	 * <p> Get first element (key). </p>
	 */
	public get first(): _Kty
	{
		return this.map.data()[this.index].first;
	}

	/**
	 * <p> Get second element (mapped value). </p>
	 */
	public get second(): _Ty
	{
		return this.map.data()[this.index].second;
	}

	/**
	 * <p> Set first element (key). </p>
	 */
	public set first(key: _Kty)
	{
		this.map.data()[this.index].first = key;
	}

	/**
	 * <p> Set second element (mapped value). </p>
	 */
	public set second(val: _Ty)
	{
		this.map.data()[this.index].second = val;
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
    public equals(obj: MapIterator<_Kty, _Ty>): boolean
	{
        return (this.map == obj.map && this.index == obj.index);
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
	public prev(): MapIterator<_Kty, _Ty>
	{
		if (this.index - 1 < 0)
			return this.map.end();
		else
			return new MapIterator<_Kty, _Ty>(this.map, this.index - 1);
	}

	/**
	 * <p> Get iterator to next element. </p>
     * <p> If current iterator is the last item, returns end(). </p>
     *
     * @return An iterator of the next item.
	 */
	public next(): MapIterator<_Kty, _Ty>
	{
		if (this.index + 1 >= this.map.size())
			return this.map.end();
		else
			return new MapIterator<_Kty, _Ty>(this.map, this.index + 1);
	}
}

/**
 * <p> A dictionary, Map<string, _Ty>. </p>
 *
 * @inheritDoc
 * @author Jeongho Nam
 */
class Dictionary<_Ty>
	extends Map<string, _Ty>
	implements IDictionary<_Ty>
{
	/**
	 * <p> Default Constructor. </p>
	 */
	constructor()
	{
		super();
	}
}

/**
 * <p> A utility class supporting static methods of string. </p>
 *
 * @author Jeongho Nam
 */
class StringUtil
{
	/**
	 * <p> Get a tabbed string by specified size. </p>
	 */
	public static tab(size: number): string
	{
		var str: string = "";
		for (var i: number = 0; i < size; i++)
			str += "\t";

		return str;
	}

	/**
	 * <p> Replace all patterns of a string. </p>
	 */
	public static replaceAll(str: string, pairs: Array<Pair<string, string>>): string
	{
		if (pairs.length == 0)
			return str;

		var foundPairList: Array<Pair<number, number>> = new Array<Pair<number, number>>();
		
		//FIND POSITION-INDEX IN ORIGINAL STRING
		for (var i: number = 0; i < pairs.length; i++) 
        {
			var index: number = 0;

			while (true) 
            {
				index = str.indexOf(pairs[i].first, index);
				if (index == -1)
					break;

				foundPairList.push(new Pair<number, number>(index++, i));
			}
		}

		if (foundPairList.length == 0)
			return str;

		foundPairList.sort();

		//REPLACE
		var res: string = "";
		var index: number = 0;

		while (foundPairList.length > 0) 
        {
			var foundPair = foundPairList[0];
			var before = pairs[foundPair.first].first;
			var after = pairs[foundPair.second].second;

			res += str.substring(index, foundPair.first);
			res += after;

			index = foundPair.first + before.length;
			foundPairList.splice(0, 1);
		}
		if (index <= str.length - 1)
			res += str.substr(index);

		return res;
	}
}

/**
 * <p> XML is a class representing a tree structued xml objects. </p>
 * <p> The XML class provides methods and properties for working with XML objects. </p>
 * 
 * <p> The XML class (along with the XMLList and Namespace) implements 
 * the powerful XML-handling standard defined in ECMAScript for XML (E4X) specification. </p>
 *
 * <p> XML class has a recursive, hierarchical relationship. </p>
 * 
 * <p> Relationships between XML and XMLList </p>
 * <ul>
 *	<li> XML contains XMLList from dictionary of XMLList. </li>
 *  <li> XMLList contains XML from vector of XML. </li>
 * </ul> 
 *
 * <h4> Note </h4>
 * <p> Do not abuse values for expressing member variables. </p>
 *
 * <table>
 *	<tr>
 *		<th>Standard Usage</th>
 *		<th>Non-standard usage abusing value</th>
 *	</tr>
 *	<tr>
 *		<td>
 *			&lt;memberList&gt;<br/>
 *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;member id='jhnam88' name='Jeongho+Nam' birthdate='1988-03-11' /&gt;<br/>
 *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;member id='master' name='Administartor' birthdate='2011-07-28' /&gt;<br/>
 *			&lt;/memberList&gt;
 *		</td>
 *		<td>
 *			&lt;member&gt;<br/>
 *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;id&gt;jhnam88&lt;/id&gt;<br/>
 *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;name&gt;Jeongho+Nam&lt;/name&gt;<br/>
 *			&nbsp;&nbsp;&nbsp;&nbsp; &lt;birthdate&gt;1988-03-11&lt;/birthdate&gt;<br/>
 *			&lt;/member&gt;
 *		</td>
 *	</tr>
 * </table>
 * 
 * @author Jeongho Nam
 */
class XML
	extends Dictionary<XMLList>
	implements IDictionary<XMLList>
{
	/**
	 * <p> Tag name of the XML. </p>
     *
     * <ul>
	 *	<li> \<<b>tag</b> label='property' /\>: tag => \"tag\" </li>
	 *  <li> \<<b>price</b> high='1500' low='1300' open='1450' close='1320' /\>: tag => \"price\" </li>
     * </ul>
	 */
	private tag: string;

	/**
	 * <p> Value of the XML. </p>
     * 
	 * <ul>
	 *  <li> \<parameter name='age' type='int'\><b>26</b>\</parameter\>: value => 26 </li>
	 *	<li> \<price high='1500' low='1300' open='1450' close='1320' /\>: value => null </li>
     * </ul>
	 */
	private value: string;

	/**
	 * <p> Properties belongs to the XML. </p>
     * <p> A Dictionary of properties accessing each property by its key. </p>
     *
     * <ul>
     *	<li> \<price <b>high='1500' low='1300' open='1450' close='1320'</b> /\>: 
	 *		propertyMap => {{\"high\": 1500}, {\"low\": 1300}, {\"open\": 1450}, {\"close\", 1320}} </li>
	 *	<li> \<member <b>id='jhnam88' name='Jeongho+Nam' comment='Hello.+My+name+is+Jeongho+Nam'</b> \>: 
	 *		propertyMap => {{\"id\", \"jhnam88\"}, {\"name\", \"Jeongho Nam\"}, 
     *                     {\"comment\", \"Hello. My name is Jeongho Nam\"}} </li>
     * </ul>
	 */
	private properties: Dictionary<string>;
	
	/* -------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------- */
	/**
	 * <p> Default Constructor. </p>
     *
     * <p> If the string parameter is not omitted, constructs its tag, value and 
     * properties by parsing the string. If there's children, then construct the 
     * children XML, XMLList objects, too. </p>
     *
     * <h4> Note </h4>
     * <p> Throwing exceptions on parsing are not defined yet. If there's some problem on
     * the string representing the XML object, error will be occured. </p>
     *
     * @param str A string to be parsed
	 */
	public constructor(str: string = "")
	{
		super();

		this.properties = new Dictionary<string>();

		if (str.indexOf("<") == -1)
			return;

		var start: number;
		var end: number;

		//ERASE HEADER OF XML
		if ((start = str.indexOf("<?xml")) != -1) 
        {
			end = str.indexOf("?>", start);

			if (end != -1)
				str = str.substr(end + 2);
		}

		//ERASE COMMENTS
		while ((start = str.indexOf("<!--")) != -1) 
        {
			end = str.indexOf("-->", start);
			if (end != -1)
				break;

			str = str.substr(0, start) + str.substr(end + 3);
		}
		
		//BEGIN PARSING
		this.construct(str);
	}

	/**
	 * <p> Construct XML objects by parsing a string. </p>
	 */
	private construct(str: string): void
	{
		this.parseTag(str);
		this.parseProperty(str);

		var res = this.parseValue(str);
		if (res.second == true)
			this.parseChildren(res.first);
	}

    /**
     * <p> Parse and fetch a tag. </p>
     */
	private parseTag(str: string): void
	{
		var start: number = str.indexOf("<") + 1;
		var end: number =
			this.calcMinIndex
				(
					str.indexOf(" ", start),
					str.indexOf("\r\n", start),
					str.indexOf("\n", start),
					str.indexOf("\t", start),
					str.indexOf(">", start),
					str.indexOf("/", start)
				);
		if (start == 0 || end == -1) 
			return;
		
		this.tag = str.substring(start, end);
	}

    /**
     * <p> Parse and fetch properties. </p>
     */
	private parseProperty(str: string): void
	{
		var start: number = str.indexOf("<" + this.tag) + this.tag.length + 1;
		var end: number = this.calcMinIndex(str.lastIndexOf("/"), str.indexOf(">", start));

		if (start == -1 || end == -1 || start >= end)
			return;
		
		//<comp label='ABCD' /> : " label='ABCD' "
		var line: string = str.substring(start, end);
		if (line.indexOf("=") == -1) 
			return;
		
		var label: string;
		var value: string;
		var helpers: Array<Object> = new Array<Object>();

		var inQuote: boolean = false;
		var quoteType: number;
		var equal: number;

		//INDEXING
		for (var i: number = 0; i < line.length; i++) 
        {
			//Start of quote
			if (inQuote == false && (line.charAt(i) == "'" || line.charAt(i) == "\"")) 
            {
				inQuote = true;
				start = i;

				if (line.charAt(i) == "'")
					quoteType = 1;
				else if (line.charAt(i) == "\"")
					quoteType = 2;
			}
			else if
				(
					inQuote == true &&
					(
						(quoteType == 1 && line.charAt(i) == "'") ||
						(quoteType == 2 && line.charAt(i) == "\"")
					)
				) 
            {
				helpers.push({ "type": quoteType, "start": start, "end": i });
				inQuote = false;
			}
		}

		//CONSTRUCTING
		for (var i: number = 0; i < helpers.length; i++) 
        {
			var quote = helpers[i];

			if (i == 0) 
            {
				equal = line.indexOf("=");
				label = line.substring(0, equal).trim();
			}
			else 
            {
				equal = line.indexOf("=", helpers[i - 1]["end"] + 1);
				label = line.substring(helpers[i - 1]["end"] + 1, equal).trim();
			}
			value = line.substring(helpers[i]["start"] + 1, helpers[i]["end"]);
			
			this.setProperty(label, XML.decodeProperty(value));
		}
	}

    /**
     * <p> Parse and fetch a value. </p>
     */
	private parseValue(str: string): Pair<string, boolean>
	{
		var end_slash: number = str.lastIndexOf("/");
		var end_block: number = str.indexOf(">");

		if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) 
        {
			//STATEMENT1: <TAG />
			//STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
			this.value = "";
			
			return new Pair<string, boolean>(str, false);
		}

		var start: number = end_block + 1;
		var end: number = str.lastIndexOf("<");
		str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG

		if (str.indexOf("<") == -1)
			this.value = XML.decodeValue( str.trim() );
		else
			this.value = "";

		return new Pair<string, boolean>(str, true);
	}

    /**
     * <p> Parse and construct children XML objects. </p>
     */
	private parseChildren(str: string): void
	{
		if (str.indexOf("<") == -1)
			return;
		
		var start: number = str.indexOf("<");
		var end: number = str.lastIndexOf(">") + 1;
		str = str.substring(start, end);

		var blockStart: number = 0;
		var blockEnd: number = 0;
		start = 0;

		for (var i: number = 0; i < str.length; i++) 
        {
			if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
				blockStart++;
			else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
				blockEnd++;

			if (blockStart >= 1 && blockStart == blockEnd) 
            {
				end = str.indexOf(">", i);

				var xmlList: XMLList;
				var xml: XML = new XML();
				xml.construct( str.substring(start, end + 1) );

				if (this.has(xml.tag) == true)
					xmlList = this.get(xml.tag);
				else 
                {
					xmlList = new XMLList();
					this.set(xml.tag, xmlList);
				}
				xmlList.push(xml);
				
				i = end;
				start = end + 1;
				blockStart = 0;
				blockEnd = 0;
			}
		}
	}

	/* -------------------------------------------------------------
		ACCESSORS
	------------------------------------------------------------- */
    /**
     * <p> Get tag. </p>
     */
	public getTag(): string
	{
		return this.tag;
	}
    /** 
     * <p> Get value. </p>
     */
	public getValue(): any
	{
		return this.value;
	}

    /**
	 * <p> Test wheter a property exists or not. </p>
	 */
	public hasProperty(key: string): boolean
	{
		return this.properties.has(key);
	}

    /**
     * <p> Get property by its key. </p>
     */
	public getProperty(key: string): any
	{
		return this.properties.get(key);
	}

	/* -------------------------------------------------------------
		SETTERS
	------------------------------------------------------------- */
    /**
	 * <p> Set tag (identifier) of the XML. </p>
	 */
	public setTag(str: string): void
	{
		this.tag = str;
	}

    /**
	 * <p> Set value of the XML. </p>
	 *
	 * @param val The value to set
	 *
	 * <p> Do not abuse values for expressing member variables. </p>
	 * <table>
	 *	<tr>
	 *		<th>Standard Usage</th>
	 *		<th>Non-standard usage abusing value</th>
	 *	</tr>
	 *	<tr>
	 *		<td>
	 *			\<memberList\>\n
	 *			&nbsp;&nbsp;&nbsp;&nbsp;\<member id='jhnam88' name='Jeongho+Nam' birthdate='1988-03-11' /\>\n
	 *			&nbsp;&nbsp;&nbsp;&nbsp;\<member id='master' name='Administartor' birthdate='2011-07-28' /\>\n
	 *			\</memberList\>
	 *		</td>
	 *		<td>
	 *			\<member\>\n
	 *				\<id\>jhnam88\</id\>\n
	 *				\<name\>Jeongho+Nam\</name\>\n
	 *				\<birthdate\>1988-03-11\</birthdate\>\n
	 *			\</member\>
	 *		</td>
	 *	</tr>
	 * </table>
     *
     * @param val A value to set
	 */
	public setValue(str: any): void
	{
		this.value = str;
	}

    /**
     * <p> Set a property with its key. </p>
     */
	public setProperty(key: string, value: any): void
	{
		this.properties.set(key, value);
	}

    /**
	 * <p> Erase a property by its key. </p>
	 *
	 * @param key The key of the property to erase
	 * @throw exception out of range
	 */
	public eraseProperty(key: string): void 
	{
        if(this.properties.has(key) == false)
            throw "out of range";
        else
            this.properties.erase(key);
	}

	/* -------------------------------------------------------------
		FILTERS
	------------------------------------------------------------- */
	private calcMinIndex(... args: number[]): number 
    {
		var min: number = args[0];

		for (var i: number = 1; i < args.length; i++)
		{
			if (args[i] == -1)
				continue;

			if (min == -1 || args[i] < min)
				min = args[i];
		}
		return min;
	}

	/**
	 * <p> Decode a value. </p>
	 *
	 * <table>
	 *	<tr>
	 *		<th>Encoded</th>
	 *		<th>Decoded</th>
	 *	</tr>
	 *	<tr>
	 *		<td>\&amp;</td>
	 *		<td>\&</td>
	 *	</tr>
	 *	<tr>
	 *		<td>\&lt;</td>
	 *		<td>\<</td>
	 *	</tr>
	 *	<tr>
	 *		<td>\&gt;</td>
	 *		<td>\></td>
	 *	</tr>
	 * </table>
	 *
	 * @return A decoded string represents a value
	 */
	public static decodeValue(str: string): string 
    {
		var pairs: Array<Pair<string, string>> =
			[
				new Pair("&amp;", "&"),
				new Pair("&lt;", "<"),
				new Pair("&gt;", ">")
			];
		return StringUtil.replaceAll(str, pairs);
	}

    /**
	 * <p> Encode a value. </p>
	 *
	 * <table>
	 *	<tr>
	 *		<th>Original</th>
	 *		<th>Encoded</th>
	 *	</tr>
	 *	<tr>
     *		<td>\&</td>
     *		<td>\&amp;</td>
	 *	</tr>
	 *	<tr>
     *		<td>\<</td>
	 *		<td>\&lt;</td>
	 *	</tr>
	 *	<tr>
     *		<td>\></td>
	 *		<td>\&gt;</td>
	 *	</tr>
	 * </table>
	 *
	 * @return A encoded string represents a value
	 */
	public static encodeValue(str: string): string 
    {
		var pairs: Array<Pair<string, string>> =
			[
				new Pair("&", "&amp;"),
				new Pair("<", "&lt;"),
				new Pair(">", "&gt;")
			];
		return StringUtil.replaceAll(str, pairs);
	}

   /**
	 * <p> Decode a property. </p>
	 *
	 * <table>
	 *	<tr>
	 *		<th>Encoded</th>
	 *		<th>Decoded</th>
	 *	</tr>
	 *	<tr>
	 *		<td>\&amp;</td>
	 *		<td>\&</td>
	 *	</tr>
	 *	<tr>
	 *		<td>\&lt;</td>
	 *		<td>\<</td>
	 *	</tr>
	 *	<tr>
	 *		<td>\&gt;</td>
	 *		<td>\></td>
	 *	</tr>
     *	<tr>
	 *		<td>&quot;</td>
	 *		<td>\"</td>
	 *	</tr>
     *	<tr>
	 *		<td>&apos;</td>
	 *		<td>'</td>
	 *	</tr>
	 *	<tr>
	 *		<td>&#x9;</td>
	 *		<td>'</td>
	 *	</tr>
     *	<tr>
	 *		<td>&apos;</td>
	 *		<td>\\t</td>
	 *	</tr>
     *	<tr>
	 *		<td>&#xA;</td>
	 *		<td>\\n</td>
	 *	</tr>
     *	<tr>
	 *		<td>&#xD;</td>
	 *		<td>\\r</td>
	 *	</tr>
	 * </table>
	 *
	 * @return A decoded string represents a property
	 */
    public static decodeProperty(str: string): string 
    {
		var pairs: Array<Pair<string, string>> =
			[
				new Pair("&amp;", "&"),
				new Pair("&lt;", "<"),
				new Pair("&gt;", ">"),
				new Pair("&quot;", "\""),
				new Pair("&apos;", "'"),
				new Pair("&#x9;", "\t"),
				new Pair("&#xA;", "\n"),
				new Pair("&#xD;", "\r"),
			];
		return StringUtil.replaceAll(str, pairs);
	}

    /**
	 * <p> Decode a property. </p>
	 *
	 * <table>
	 *	<tr>
	 *		<th>Original</th>
	 *		<th>Encoded</th>
	 *	</tr>
	 *	<tr>
     *		<td>\&</td>
	 *		<td>\&amp;</td>
	 *	</tr>
	 *	<tr>
     *		<td>\<</td>
	 *		<td>\&lt;</td>
	 *	</tr>
	 *	<tr>
     *		<td>\></td>
	 *		<td>\&gt;</td>
	 *	</tr>
     *	<tr>
     *		<td>\"</td>
	 *		<td>&quot;</td>
	 *	</tr>
     *	<tr>
     *		<td>'</td>
	 *		<td>&apos;</td>
	 *	</tr>
	 *	<tr>
     *		<td>'</td>
	 *		<td>&#x9;</td>
	 *	</tr>
     *	<tr>
     *		<td>\\t</td>
	 *		<td>&apos;</td>
	 *	</tr>
     *	<tr>
     *		<td>\\n</td>
	 *		<td>&#xA;</td>
	 *	</tr>
     *	<tr>
     *		<td>\\r</td>
	 *		<td>&#xD;</td>
	 *	</tr>
	 * </table>
	 *
	 * @return A encoded string represents a property
	 */
    public static encodeProperty(str: string): string 
    {
		var pairs: Array<Pair<string, string>> =
			[
				new Pair("&", "&amp;"),
				new Pair("<", "&lt;"),
				new Pair(">", "&gt;"),
				new Pair("\"", "&quot;"),
				new Pair("'", "&apos;"),
				new Pair("\t", "&#x9;"),
				new Pair("\n", "&#xA;"),
				new Pair("\r", "&#xD;"),
			];
		return StringUtil.replaceAll(str, pairs);
	}

	/* -------------------------------------------------------------
		EXPORTS
	------------------------------------------------------------- */
	/**
	 * <p> Convert the XML to a string. </p>
	 */
	public toString(level: number = 0): string
	{
		var str: string = StringUtil.tab(level) + "<" + this.tag;
		var childrenString: string = "";

		//PROPERTIES
		for (var p_it = this.properties.begin(); p_it.equals(this.properties.end()) == false; p_it = p_it.next())
			str += " " + p_it.first + "=\"" + XML.encodeProperty(String(p_it.second)) + "\"";
		
		if (this.size() == 0) 
        {
			if (this.value != "")
				str += ">" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
			else
				str += " />";
		} 
        else 
        {
			str += ">\n";

			for (var x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
				str += x_it.second.toString(level + 1);
			
			str += StringUtil.tab(level) + "</" + this.tag + ">";
		}
		return str;
	}
}

/**
 * <p> List of XML(s) having same tag. </p>
 *
 * @author Jeongho Nam
 */
class XMLList
	extends Vector<XML>
{
	/**
	 * <p> Default Constructor. </p>
	 */
	constructor() 
    {
		super();
	}

	/**
	 * <p> Convert XMLList to string. </p>
	 *
	 * @param level Level(depth) of the XMLList 
	 */
	public toString(level: number = 0): string 
    {
		var str: string = "";
		for (var i: number = 0; i < this.length; i++)
			str += this[i].toString(level) + "\n";

		return str;
	}
}

/* =================================================================================
	PROTOCOLS
==================================================================================== 
	* MESSAGE
		- INVOKE
		- INVOKE_PARAMETER

	* ENTITY
		- IENTITY
			- ENTITY
			- ENTITY_ARRAY
 
	* NETWORK I/O
		- IPROTOCOL
		- SERVER_CONNECTOR

	* UI
		- WINDOW
		- MOVIE
		- SUB_MOVIE

    * SLAVE SYSTEM
        - SLAVE_SYSTEM
        - SLAVE_SYSTEM_ROLE
        - INVOKE_HISTORY

    * PARALLEL SYSTEM
        - PARALLEL_SYSTEM
        - PR_INVOKE_HISTORY
================================================================================= */

/* =================================================================================
    PROTOCOL - NETWORK I/O MODULE
================================================================================= */
/**
 * <p> An interface for Invoke message chain. </p>
 * 
 * <p> IProtocol is an interface for Invoke message, which is standard message of network I/O 
 * in Samchon Framework, chain. The IProtocol interface is used to network drivers and some 
 * classes which are in a relationship of chain of responsibility with those network drivers. </p>
 * 
 * <p> In Samchon Framework, server side, IProtocol is one of the basic 3 + 1 components that 
 * can make any type of network system in Samchon Framework with IServer and IClient. Following 
 * the "chain of responsibility" pa1ttern, looking around classes in Samchon Framework, you 
 * can see all related classes with network I/O are implemented from the IProtocol. </p>
 *
 * @see Invoke 
 * @author Jeongho Nam
 */ 
interface IProtocol
{
    /**
	 * <p> Handling replied message. </p>
	 * <p> Handles replied message or shifts the responsibility to chain. </p>
     *
	 * @param invoke Replied invoke message 
	 */
	sendData(invoke: Invoke): void;

    /**
	 * <p> Sending message. </p>
	 * <p> Sends message to related system or shifts the responsibility to chain. </p>
     *
	 * @param invoke Invoke message to send
	 */
	replyData(invoke: Invoke): void;
}

/**
 * <p> A server connector for a physical client. </p>
 *
 * <p> ServerConnector is a class for a physical client connecting a server. If you want to connect 
 * to a server,  then implements this ServerConnector and just override some methods like 
 * getIP(), getPort() and replyData(). That's all. </p>
 *
 * <p> In Samchon Framework, package protocol, There are basic 3 + 1 components that can make any 
 * type of network system in Samchon Framework. The basic 3 components are IProtocol, IServer and
 * IClient. The last, surplus one is the ServerConnector. Looking around classes in 
 * Samchon Framework, especially module master and slave which are designed for realizing 
 * distributed processing systems and parallel processing systems, physical client classes are all 
 * derived from this ServerConnector. </p>
 *
 * <img src="interface.png" />
 *
 * @author Jeongho Nam
 */
class ServerConnector
	implements IProtocol
{
    /**
	 * <p> A parent object who listens and sends Invoke message. </p>
	 * 
	 * <ul>
	 * 	<li> ServerConnector.replyData(Invoke) -> parent.replyData(Invoke) </li>
	 * </ul>
	 */
	private parent: IProtocol;

    /**
	 * <p> A socket for network I/O. </p>
	 */
	private socket: WebSocket;

    /**
     * <p> Unused string from a server. </p>
     */
	private str: string;

    /**
     * <p> An open-event listener. </p>
     */
	public onopen: Function;

    /**
     * <p> Constructor with parent. </p>
     */
	constructor(parent: IProtocol) 
    {
		this.parent = parent;

		this.str = "";
	}

	/**
	 * <p> Connects to a cloud server with specified host and port. </p>
	 * 
	 * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown: 
	 * an error event is dispatched if a host was specified, and an exception is thrown if no host 
	 * was specified. Otherwise, the status of the connection is reported by an event. 
	 * If the socket is already connected, the existing connection is closed first. </p>
	 * 
	 * @param ip
	 * 		The name or IP address of the host to connect to. 
	 * 		If no host is specified, the host that is contacted is the host where the calling 
	 * 		file resides. If you do not specify a host, use an event listener to determine whether 
	 * 		the connection was successful.
	 * @param port 
	 * 		The port number to connect to.
	 * 
	 * @throws IOError
	 * 		No host was specified and the connection failed.
	 * @throws SecurityError
	 * 		This error occurs in SWF content for the following reasons: 
	 * 		Local untrusted SWF files may not communicate with the Internet. You can work around 
	 * 		this limitation by reclassifying the file as local-with-networking or as trusted.
	 */
	public connect(ip: string, port: number): void 
    {
        if(ip.indexOf("ws://") == -1)
        {
            if(ip.indexOf("://") != -1)
                throw "only websocket is possible";
            else
                ip = "ws://" + ip;
        }
		this.socket = new WebSocket(ip + ":" + port);

		this.socket.onopen = this.handleConnect;
		this.socket.onmessage = this.handleReply;
	}

	/* ----------------------------------------------------
		IPROTOCOL'S METHOD
	---------------------------------------------------- */
    /**
     * <p> Send data to the server. </p>
     */
	public sendData(invoke: Invoke): void 
    {
		var xml: XML = invoke.toXML();
		var str: string = xml.toString();

		this.socket.send(str);
	}

    /**
     * <p> Shift responsiblity of handling message to parent. </p>
     */
	public replyData(invoke: Invoke): void 
    {
		this.parent.replyData(invoke);
	}

	/* ----------------------------------------------------
		HANDLING CONNECTION AND MESSAGES
	---------------------------------------------------- */
	private handleConnect(event: Event): void
	{
        if(this.onopen == null)
            return;
		
        this.onopen.apply([event]);
	}

    /**
     * <p> Handling replied message. </p>
     */
	private handleReply(event: MessageEvent): void
	{
		this.str += event.data;
		var invokeArray: Array<Invoke>;

		var indexPair: Pair<number, number> = null;
		var sizePair: Pair<number, number> = new Pair<number, number>(0, 0);
		var startIndex: number = 0;
		var endIndex: number = 0;

		while (true) 
        {
			var iPair: Pair<number, number> = new Pair<number, number>
				(
					this.str.indexOf("<invoke", startIndex),
					this.str.indexOf("</invoke>", startIndex)
				); //FIND WORDS
			if (iPair.first != -1) sizePair.first++;
			if (iPair.second != -1) sizePair.second++; //AND COUNTS

			if (indexPair == null && sizePair.first == 1) //IF IT MEANS THE START,
				indexPair = new Pair(iPair.first, -1); //SPECIFY THE STARTING INDEX

			//FAILED TO FIND ANYTHING
			if (iPair.first == -1 || iPair.second == -1)
				break;

			/* FOUND SOMETHING FROM NOW ON */

			//AN INVOKE HAS FOUND
			if (indexPair != null && sizePair.first == sizePair.second)
			{
				var start: number = indexPair.first;
				var end: number = indexPair.second + ("</invoke>").length;

				var xml: XML = new XML(this.str.substring(start, end));
				var invoke: Invoke = new Invoke(xml);
				invokeArray.push(invoke);
				
				//CLEAR CURRENT'S INDEX PAIR
				endIndex = end;
				indexPair = null;
			}

			//ADJUST INDEX
			startIndex = Math.max
				(
					Math.max(iPair.first, iPair.second),
					1
				);
		}

		//ERASE USED CHARACTERS
		if (endIndex != 0)
			this.str = this.str.substr(endIndex);

		//CALL REPLY_DATA
		for (var i: number = 0; i < invokeArray.length; i++)
			this.replyData(invokeArray[i]);
	}
}

/* =================================================================================
    PROTOCOL - INVOKE MESSAGE MODULE
================================================================================= */
/**
 * <p> Standard message of network I/O. </p>
 * <p> Invoke is a class used in network I/O in protocol package of Samchon Framework.  </p>
 *
 * <p> The Invoke message has an XML structure like the result screen of provided example in below. 
 * We can enjoy lots of benefits by the normalized and standardized message structure used in
 * network I/O. </p>
 *
 * <p> The greatest advantage is that we can make any type of network system, even how the system 
 * is enourmously complicated. As network communication message is standardized, we only need to
 * concentrate on logical relationships between network systems. We can handle each network system 
 * like a object (class) in OOD. And those relationships can be easily designed by using design
 * pattern. </p>
 *
 * <p> In Samchon Framework, you can make any type of network system with basic 3 + 1 componenets
 * (IProtocol, IServer and IClient + ServerConnector), by implemens or inherits them, like designing
 * classes of S/W architecture. </p>
 *
 * @author Jeongho Nam
 */
class Invoke
	extends Vector<InvokeParameter>
{
    /**
     * <p> Listener, represent function's name. </p>
     */
	private listener: string;

	/**
	 * <p> Multiple Constructors. </p>
	 * 
	 * <h4> Construct from a lisetenr </h4>
     * <p> Construct an Invoke only with its listener. </p>
     *
     * <ul>
	 *  <li> listener := Represents who listens the Invoke message. Almost same with Function name. </li>
     * </ul>
	 *
	 * <hr /> 
	 * 
	 * <h4> Construct from arguments </h4>
	 * <p> Creates Invoke and InvokeParameter(s) at the same time by varadic template method. </p>
	 * 
	 * <p> By the varadic template constructor, you can't specify name of each InvokeParameter, but
	 * specify type and value of each InvokeParameter. If you try to record the Invoke to Database,
	 * the name of InvokeParameter will be <i>NULL</i>.</p>
	 * 
	 * <p> By the varadic template constructor, name of InovkeParameter(s) will be omitted. Because
	 * of name, an identifier of an InvokeParameter, is omitted, you can't access to InvokeParameter
	 * by Invoke::has() or Invoke::get(). </p>
	 * 
     * <ul>
	 *  <li> listener := Represents who listens the Invoke message. Almost same with Function name. </li>
	 *  <li> arguments := Arguments to be parameters of Invoke. </li>
     * </ul>
	 * 
	 * <hr />
	 * 
	 * <h4> Construct from an XML object </h4>
	 * <p> Constructs Invoke and InvokeParameter objects by an XML object. </p>
     *
     * <ul>
	 *  <li>xml := An xml object representing Invoke object. </li>
     * </ul>
	 */
	constructor(...args: any[])
	{
		super();

		if (args.length == 1)
		{
			var val: any = args[0];

			if (typeof val == "string")
				this.listener = val;
			else if (val instanceof XML)
			{
				var xml: XML = val;
				this.listener = xml.getProperty("listener");

				if (xml.has("parameter") == false)
					return;

				var xmlList: XMLList = xml.get("parameter");
				for (var i: number = 0; i < xmlList.length; i++)
					this.push(new InvokeParameter(xmlList[i]));
			}
		}
		else
		{
			this.listener = args[0];

			for (var i: number = 1; i < args.length; i++)
			{
				var value: any = args[i];

				var parameter: InvokeParameter = new InvokeParameter("", value);
				this.push(parameter);
			}
		}
	}

	/* -------------------------------------------------------------------
		GETTERS
	------------------------------------------------------------------- */
    /**
     * <p> Get listener. </p>
     */
	public getListener(): string
	{
		return this.listener;
	}

    /**
	 * <p> Whether have the item or not. </p>
	 *
	 * @param key Key value of the element whose mapped value is accessed.
	 * @return Whether the map has an item having the specified identifier
	 */
    public has(key: string): boolean
    {
        for (var i: number = 0; i < this.length; i++)
            if (this[i].getName() == key)
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
	public get(key: string): InvokeParameter
	{
		for (var i: number = 0; i < this.length; i++)
			if (this[i].getName() == key)
				return this[i];

		throw "out of range";
	}

    /**
     * <p> Get arguments for Function.apply(). </p>
     *
     * @return An array containing values of the parameters.
     */
	public getArguments(): Array<any>
	{
		var args: Array<any> = [];
		for (var i: number = 0; i < this.length; i++)
			args.push(this[i].getValue());

		return args;
	}

	 /* -------------------------------------------------------------------
		APPLY BY FUNCTION POINTER
	------------------------------------------------------------------- */
    /**
     * <p> Apply to a matched function. </p>
     */
	public apply(obj: IProtocol): boolean
	{
		if (!(obj.hasOwnProperty(this.listener) == true && obj[this.listener] instanceof Function))
			return false;
		
		var func: Function = obj[this.listener];
		var args: Array<any> = this.getArguments();

		func.apply(null, args);

		return true;
	}

	 /* -------------------------------------------------------------------
		EXPORTER
	------------------------------------------------------------------- */
	public toXML(): XML
	{
		var xml: XML = new XML();

		xml.setTag("invoke");
		xml.setProperty("listener", this.listener);

		var xmlList: XMLList = new XMLList();
		for (var i: number = 0; i < this.length; i++)
			xmlList.push(this[i].toXML());

		xml.set("parameter", xmlList);
		return xml;
	}
}

/**
 * <p> Standard message of network I/O. </p>
 * <p> Invoke is a class used in network I/O in protocol package of Samchon Framework.  </p>
 *
 * <p> The Invoke message has a XML structure like the result screen of provided example in below. 
 * We can enjoy lots of benefits by the normalized and standardized message structure used in
 * network I/O. </p>
 *
 * <p> The greatest advantage is that we can make any type of network system, even how the system 
 * is enourmously complicated. As network communication message is standardized, we only need to
 * concentrate on logical relationships between network systems. We can handle each network system 
 * like a object (class) in OOD. And those relationships can be easily designed by using design
 * pattern. </p>
 *
 * <p> In Samchon Framework, you can make any type of network system with basic 3 + 1 componenets
 * (IProtocol, IServer and IClient + ServerConnector), by implemens or inherits them, like designing
 * classes of S/W architecture. </p>
 *
 * @author Jeongho Nam
 */
class InvokeParameter
{
	/**
	 * <p> Name of the parameter. </p>
	 *
	 * @details Optional property, can be omitted.
	 */
	private name: string;

	/**
	 * <p> Type of the parameter. </p>
	 */
	private type: string;

	/** 
	 * <p> Value of the parameter. </p>
	 */
	private value: any;
	
	/**
	 * <p> Multiple Constructors. </p>
	 *
	 * <h4> InvokeParameter(XML) </h4>
     * <p> Construct from XML. </p>
     * <ul>
	 *	<li> xml := A XML instance representing InvokeParameter. </li>
     * </ul>
     *
     * <hr/>
	 *
	 * <h4> template <typename _Ty> InvokeParameter(_Ty) </h4>
     * <p> Construct from a value. </p>
	 * <ul>
     *  <li> value := Value belonged to the parameter. </li>
     * </ul>
	 *
     * <hr/>
     *
	 * <h5> template <typename _Ty> InvokeParameter(string, _Ty) </h5>
     * <p> Construct from specified type and value. </p>
     * <ul>
	 *	<li> type := Type of the parameter. </li>
	 *	<li> value := A value belongs to the parameter. </li>
     * </ul>
	 */
	constructor(...args: any[])
	{
		if (args.length == 1 && args[0] instanceof XML)
		{
			var xml: XML = args[0];
			
			this.name = xml.hasProperty("name") ? xml.getProperty("name") : "";
			this.type = xml.getProperty("type");

			if (this.type == "XML")
				this.value = xml.begin().second[0];
			else
				this.value = xml.getValue();
		}
		else if (args.length == 2)
		{
			this.name = args[0];
			var value: any = args[1];

			if (value instanceof Entity || value instanceof EntityArray)
			{
				this.type = "XML";
				this.value = value.toXML();
			}
			else if (value instanceof XML)
			{
				this.type = "XML";
				this.value = value;
			}
			else if (typeof value == "number" || typeof value == "string")
			{
				this.type = typeof value;
				this.value = value;
			}
			else
			{
				this.type = "unknown";
				this.value = value;
			}
		}
		else if (args.length == 3)
		{
			this.name = args[0];
			this.type = args[1];
			this.value = args[2];
		}
	}

	/**
	 * <p> Get name. </p>
	 */
	public getName(): string
	{
		return this.name;
	}

	/**
	 * <p> Get type. </p>
	 */
	public getType(): string
	{
		return this.type;
	}
	/**
	 * <p> Get value. </p>
	 */
	public getValue(): any
	{
		return this.value;
	}

	/**
	 * <p> Convert the parameter to XML. </p>
	 *
	 * @return An XML object represents the parameter.
	 */
	public toXML(): XML
	{
		var xml: XML = new XML();
		xml.setTag("parameter");

		if (this.name != "")
			xml.setProperty("name", this.name);
		xml.setProperty("type", this.type);

		if (this.type == "XML")
		{
			var xmlList: XMLList = new XMLList();
			xmlList.push(this.value);

			xml.set(this.value.tag, xmlList);
		}
		else
			xml.setValue(this.value);

		return xml;
	}
}

/* =================================================================================
    PROTOCOL - ENTITY MODULE
================================================================================= */
/**
 * <p> An interface of entity. </p>
 * 
 * <p> Entity is a class for standardization of expression method using on network I/O by XML. If 
 * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a 
 * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
 * Entity is not imposed but encouraged. </p>
 *
 * <p> As we could get advantages from standardization of message for network I/O with Invoke, 
 * we can get additional advantage from standardizing expression method of data class with Entity. 
 * We do not need to know a part of network communication. Thus, with the Entity, we can only 
 * concentrate on entity's own logics and relationships between another entities. Entity does not
 * need to how network communications are being done. </p>
 *  
 * <p> I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
 * protocol for network I/O but not a essential protocol must be kept. The expression method of
 * Entity, using on network I/O, is expressed by XML string. </p>
 *
 * <p> If your own network system has a critical performance issue on communication data class, 
 * it would be better to using binary communication (with ByteArray).
 * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray). </p>
 * 
 * @author Jeongho Nam
 */
interface IEntity {
    /**
	 * <p> Construct data of the Entity from a XML object. </p>
	 * 
	 * <p> Overrides the construct() method and fetch data of member variables from the XML. </p>
	 *
	 * <p> By recommended guidance, data representing member variables are contained in properties 
	 * of the put XML object. </p>
	 * 
	 * @param xml An xml used to contruct data of entity.
	 */
    construct(xml: XML): void;

    /**
* <p> Get a key that can identify the Entity uniquely. </p>
* 
* <p> If identifier of the Entity is not atomic value, returns a string or paired object
* that can represents the composite identifier. </p>
*/
    key(): any;

    /**
	 * <p> A tag name when represented by XML. </p>
	 *
	 * <ul>
	 * 	<li> &lt;TAG {...properties} /&gt; </li>
	 * </ul>
	 */
    TAG(): string;

    /**
	 * <p> Get a XML object represents the Entity. </p>
	 *
	 * <p> A member variable (not object, but atomic value like number, string or date) is categorized
	 * as a property within the framework of entity side. Thus, when overriding a toXML() method and 
	 * archiving member variables to an XML object to return, puts each variable to be a property 
	 * belongs to only a XML object. </p>
	 *
	 * <p> Don't archive the member variable of atomic value to XML::value causing enormouse creation 
	 * of XML objects to number of member variables. An Entity must be represented by only a XML
	 * instance (tag). </p>
	 *
	 * <table>
	 *	<tr>
	 *		<th> Standard Usage </th>
	 *		<th> Non-standard usage abusing value </th>
	 *	</tr>
	 *	<tr>
	 *		<td>
	 * 			<pre>
&lt;memberList&gt;
	&lt;member id='jhnam88' name='Jeongho+Nam' birthdate='1988-03-11' /&gt;
	&lt;member id='master' name='Administartor' birthdate='2011-07-28' /&gt;
&lt;/memberList\&gt;</pre>
	 *		</td>
	 *		<td>
	 * 			<pre>
&lt;member&gt;
	&lt;id&gt;jhnam88&lt;/id&gt;
	&lt;name&gt;Jeongho+Nam&lt;name&gt;
	&lt;birthdate&gt;1988-03-11&lt;/birthdate&gt;
&lt;/member&gt;</pre>
	 *		</td>
	 *	</tr>
	 * </table>
	 *
	 * @return An XML object representing the Entity.
	 */
    toXML(): XML;
}

/**
 * <p> An entity, a standard data class. </p>
 *
 * <p> Entity is a class for standardization of expression method using on network I/O by XML. If 
 * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a 
 * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
 * Entity is not imposed but encouraged. </p>
 *
 * <p> As we could get advantages from standardization of message for network I/O with Invoke, 
 * we can get additional advantage from standardizing expression method of data class with Entity. 
 * We do not need to know a part of network communication. Thus, with the Entity, we can only 
 * concentrate on entity's own logics and relationships between another entities. Entity does not
 * need to how network communications are being done. </p>
 *  
 * <p> I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
 * protocol for network I/O but not a essential protocol must be kept. The expression method of
 * Entity, using on network I/O, is expressed by XML string. </p>
 *
 * <p> If your own network system has a critical performance issue on communication data class, 
 * it would be better to using binary communication (with ByteArray).
 * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray). </p>
 *
 * @author Jeongho Nam
 */
class Entity
    implements IEntity {
    /**
     * <p> Default Constructor. </p>
     */
    constructor() {
        //NOTHING
    }
    public construct(xml: XML): void {
        //SOMETHING TO COMPOSE MEMBER DATA
    }

    public TAG(): string { return ""; }
    public key(): any { return ""; }

    public toXML(): XML {
        var xml: XML = new XML();
        xml.setTag(this.TAG());

        return xml;
    }
}

/**
 * <p> An Entity and an Array of children Entity objects. </p>
 * 
 * <p> EntityArray is a template class for containinig children Entity objects, and also another type 
 * of an Entity, too. You can realize hierarchical relationship. Although some entities have complicated
 * hierarchical relationship, you can deduct a optimal solution easily with EntityArray and Entity. </p>
 *
 * <p> If an entity has some subordinate entities of same type, they are in "Composite relationship". 
 * Make the entity to be EmntityGroup and subordinate entities to be children of the entity. When
 * those relationships are continued, continue to create classes dervied from EntityArray. When those
 * relationshiop meets a terminal node, then make the terminal node to be an Entity. </p>
 *
 * <p> <img src="inspect.png" /> </p>
 * 
 * <p> EntityArray is an Entity, and a container of children Entity objects at the same time. If
 * children type, of a class derived from an EntityArray, is itself, you can realize hierarchical
 * and recursive relationship. The relationship is called as "Composite pattern". </p>
 *
 * <ul>
 *	<li> FTFolder extends FTInstance and EntityArray&lt;FTInstance&gt;. </li>
 *	<li> NTCriteria extends EntityArray&lt;NTCriteria&gt;. </li>
 * </ul>
 *
 * <h4> Inherited </h4>
 * @copy Entity
 * 
 * @see Entity
 * @author Jeongho Nam
 */
class EntityArray
    extends Vector<IEntity>
    implements IEntity {
    /**
     * <p> Default Constructor. </p>
     */
    constructor() {
        super();
    }

    /**
	 * <p> Construct data of the Entity from an XML object. </p>
	 *
	 * <p> Constructs the EntityArray's own member variables only from the input XML object. </p>
	 *
	 * <p> Do not consider about constructing children Entity objects' data in EntityArray::construct(). 
	 * Those children Entity objects' data will constructed by their own construct() method. Even insertion 
	 * of XML objects representing children are done by abstract method of EntityArray::toXML(). </p>
	 *
	 * <p> Constructs only data of EntityArray's own. </p>
	 * 
	 * @inheritDoc
	 */
    public construct(xml: XML): void {
        this.splice(0, this.length);

        if (xml.hasOwnProperty(this.CHILD_TAG()) == false)
            return;

        var xmlList: XMLList = xml[this.CHILD_TAG()];
        for (var i: number = 0; i < xmlList.length; i++) {
            var child: IEntity = this.createChild(xmlList[i]);
            if (child != null) {
                child.construct(xmlList[i]);
                this.push(child);
            }
        }
    }

    /**
     * <p> Factory method of a child Entity. </p>
     *
     * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged 
     * to the EntityArray. This method is called by EntityArray::construct(). The children construction
     * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
     *
     * @return A new child Entity belongs to EntityArray.
     */
    protected createChild(xml: XML): IEntity {
        return null;
    }

    public TAG(): string { return ""; }

    /**
	 * <p> A tag name of children objects. </p>
	 */
    public CHILD_TAG(): string { return ""; }

    public key(): any { return ""; }
 
    /**
	 * <p> Get an XML object represents the EntityArray. </p>
	 *
	 * <p> Archives the EntityArray's own member variables only to the returned XML object. </p>
	 *
	 * <p> Do not consider about archiving children Entity objects' data in EntityArray::toXML(). 
	 * Those children Entity objects will converted to XML object by their own toXML() method. The 
	 * insertion of XML objects representing children are done by abstract method of 
	 * EntityArray::toXML(). </p>
	 *
	 * <p> Archives only data of EntityArray's own. </p>
	 *
	 * @inheritDoc
	 */
    public toXML(): XML {
        var xml: XML = new XML();
        xml.setTag(this.TAG());

        if (this.length == 0)
            return xml;

        var xmlList: XMLList = new XMLList();
        for (var i: number = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());

        xml.set(this.CHILD_TAG(), xmlList);

        return xml;
    }
}

/* =================================================================================
    PROTOCOL - APPLICATION MODULE
================================================================================= */
/**
 * <p> An application, the top class in JS-UI. </p>
 * 
 * <p> The Application is separated to three part, TopMenu, Movie and ServerConnector. </p>
 * <ul>
 * 	<li> <code>TopMenu</code>: Menu on the top. It's not an essential component. </li>
 * 	<li> <code>Movie</code>: Correspond with Service in Server. Movie has domain UI components(Movie) for the matched Service. </li>
 * 	<li> <code>ServerConnector</code>: The socket connecting to the Server. </li>
 * </ul>
 * 
 * <p> The Application and its UI-layout is not fixed, essential component for Samchon Framework in Flex, 
 * so it's okay to do not use the provided Application and make your custom Application.
 * But the custom Application, your own, has to contain the Movie and keep the construction routine. </p>
 * 
 * <p> <img src="movie.png" /> </p>
 * 
 * <h4> THE CONSTRUCTION ROUTINE </h4>
 * <ul>
 * 	<li>Socket Connection</li>
 * 	<ul>
 * 		<li>Connect to the CPP-Server</li>
 * 	</ul>
 * 	<li>Fetch authority</li>
 * 	<ul>
 * 		<li>Send a request to fetching authority</li>
 * 		<li>The window can be navigated to other page by the authority</li>
 * 	</ul>
 * 	<li>Construct Movie</li>
 * 	<ul>
 * 		<li>Determine a Movie by URLVariables::movie and construct it</li>
 * 	</ul>
 * 	<li>All the routines are done</li>
 * </ul>
 * 
 * @author Jeongho Nam
 */
class Application
	implements IProtocol
{
    /**
     * <p> Invoke Socket. </p>
     */
	protected socket: ServerConnector;

    /**
     * <p> A movie. </p>
     */
	protected movie: Movie;

    /**
     * <p> Construct from arguments. </p>
     *
     * @param movie A movie represents a service.
     * @param ip An ip address of cloud server to connect.
     * @param port A port number of cloud server to connect.
     */
	constructor(movie:Movie, ip: string, port: number)
	{
		this.movie = movie;
		this.socket = new ServerConnector(this);
		this.socket.onopen = this.handleConnect;

		this.socket.connect(ip, port);
	}
    
	private handleConnect(event: Event): void
	{
	}

    /**
     * <p> Handle replied message or shift the responsibility. </p>
     */
	public replyData(invoke: Invoke): void 
    {
		if (invoke.apply(this) == false)
			this.movie.sendData(invoke);
	}

    /**
     * <p> Send a data to server. </p>
     */
	public sendData(invoke: Invoke): void 
    {
		this.socket.sendData(invoke);
	}
}

/**
 * <p> A movie belonged to an Application
 */
class Movie
	implements IProtocol
{
    /**
     * <p> An application the movie is belonged to
     */
	protected application: Application;

    /**
     * <p> Handle replied data
     */
	public replyData(invoke: Invoke): void
	{
		invoke.apply(this) == false;
	}

    /**
     * <p> Send data to server
     */
	public sendData(invoke: Invoke): void
	{
		this.application.sendData(invoke);
	}
}

/**
 * <p> A sub-movie
 */
class SubMovie
	implements IProtocol 
{
    /**
     * <p> A parent object the SubMovie is belonged to
     */
	protected parent: IProtocol;

	public replyData(invoke: Invoke): void 
    {
		invoke.apply(this);
	}
	public sendData(invoke: Invoke): void 
    {
		this.parent.sendData(invoke);
	}
}

/* =================================================================================
    PROTOCOL - SLAVE SYSTEM MODULE
================================================================================= */
/**
 * A slave system.
 *
 * @author Jeongho Nam
 */
class SlaveSystem
    extends EntityArray
    implements IProtocol
{
    private driver: ServerConnector;

    public sendData(invoke: Invoke): void
    {
        this.driver.sendData(invoke);
    }
    public replyData(invoke: Invoke): void
    {
        invoke.apply(this);

        for (var i: number = 0; i < this.length; i++)
            invoke.apply(<SlaveSystemRole>this[i]);
    }
}

/**
 * A role of belongs to a slave system.
 *
 * @author Jeongho Nam
 */
class SlaveSystemRole
    extends Entity
    implements IProtocol
{
    protected system: SlaveSystem;

    public sendData(invoke: Invoke): void
    {
        this.system.sendData(invoke);
    }
    public replyData(invoke: Invoke): void
    {
        invoke.apply(this);
    }
}

/**
 * <p> A history of an Invoke message. </p>
 *
 * <p> InvokeHistory is a class for reporting history log of an Invoke message with elapsed time 
 * from a slave to its master.</p>
 *
 * <p> With the elapsed time, consumed time for a process of handling the Invoke message, 
 * InvokeHistory is reported to the master. The master utilizies the elapsed time to estimating
 * performances of each slave system. With the estimated performan index, master retrives the
 * optimal solution of distributing processes. </p>
 *
 * @author Jeongho Nam
 */
class InvokeHistory
    extends Entity
{
    protected uid: number;
    protected listener: string;
    protected startTime: Date;
    protected endTime: Date;
    
    constructor(uid: number, listener: string)
    {
        super();

        this.uid = uid;
        this.listener = listener;
        this.startTime = new Date();
    }
    public notifyEnd(): void
    {
        this.endTime = new Date();
    }

    public TAG(): string { return "invokeHistory"; }

    public toXML(): XML
    {
        var xml: XML = super.toXML();
        xml.setProperty("uid", this.uid);
        xml.setProperty("listener", this.listener);
        xml.setProperty("startTime", this.startTime);
        xml.setProperty("endTime", this.endTime);

        return xml;
    }
}


/* =================================================================================
    PROTOCOL - PARALLEL SYSTEM MOUDLE
================================================================================= */
class PRInvokeHistory
    extends InvokeHistory
{
    protected index: number;
    protected size: number;

    constructor(uid: number, listener: string, index: number, size: number)
    {
        super(uid, listener);

        this.index = index;
        this.size = size;
    }

    public toXML(): XML
    {
        var xml: XML = super.toXML();
        xml.setProperty("index", this.index);
        xml.setProperty("size", this.size);

        return xml;
    }
}