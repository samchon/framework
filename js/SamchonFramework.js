var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function test() {
    var productArray = new ProductArray();
    productArray.push(new Product("Eraser", 500, 10, 70), new Product("Pencil", 400, 30, 35), new Product("Pencil", 400, 30, 35), new Product("Pencil", 400, 30, 35), new Product("Book", 8000, 150, 300), new Product("Book", 8000, 150, 300), new Product("Drink", 1000, 75, 250), new Product("Umbrella", 4000, 200, 1000), new Product("Notebook-PC", 800000, 150, 850), new Product("Tablet-PC", 600000, 120, 450));
    var packer = new Packer(productArray);
    packer.push(new WrapperArray(new Wrapper("Large", 100, 200, 1000)), new WrapperArray(new Wrapper("Medium", 70, 150, 500)), new WrapperArray(new Wrapper("Small", 50, 100, 250)));
    var packerSystem = new PackerSlaveSystem("127.0.0.1", 0);
    var invoke = new Invoke("optimize", packer.toXML(), 1, 400);
    invoke.apply(packerSystem);
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
function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var str = args[0];
    for (var i = 1; i < args.length; i++)
        str += ", " + args[i];
    document.write("<p>" + str + "</p>");
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

    * CASE_GENERATOR
        * CASE_GENERATOR
        * COMBINED_PERMUTATION_GENERATOR
        * PERMUTATION_GENERATOR
        * FACTORIAL_GENERATOR
================================================================================= */
/* =================================================================================
    LIBRARY - CONTAINERS
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
var Pair = (function () {
    /**
     * <p> Construct from pair values. </p>
     *
     * @param first The first value of the Pair
     * @param second The second value of the Pair
     */
    function Pair(first, second) {
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
    Pair.prototype.equals = function (obj) {
        var first;
        var second;
        if (this.first.hasOwnProperty("equals") && this.first["equals"] instanceof Function)
            first = this.first["equals"](obj.first);
        else
            first = this.first == obj.first;
        if (this.second.hasOwnProperty("equals") && this.second["equals"] instanceof Function)
            second = this.second["equals"](obj.second);
        else
            second = this.second == obj.second;
        return first == true && second == true;
    };
    /**
     * <p> Returns a string representation of the Map. </p>
     *
     * <p> The returned string will follow the form of JSonObject </p>
     * <ul>
     *	<li> {"first": "???", "second": ???} </li>
     * </ul>
     */
    Pair.prototype.toString = function () {
        return "{first: " + this.first + ", second: " + this.second + "}";
    };
    return Pair;
})();
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
var Vector = (function () {
    /**
     * Default Constructor.
     */
    function Vector() {
    }
    /* ------------------------------------------------------------------------
        MODIFIERS
    ------------------------------------------------------------------------ */
    /**
     * Appends new elements to an array, and returns the new length of the array.
     *
     * @param items New elements of the Array.
     * @return New length of the array.
     */
    Vector.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i - 0] = arguments[_i];
        }
        return 0;
    };
    /**
     * Removes the last element from an array and returns it.
     */
    Vector.prototype.pop = function () { return null; };
    /**
     * Combines two or more arrays.
     *
     * @param items Additional items to add to the end of array1.
     */
    Vector.prototype.concat = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i - 0] = arguments[_i];
        }
        return [];
    };
    /**
     * Adds all the elements of an array separated by the specified separator string.
     *
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    Vector.prototype.join = function (separator) { return ""; };
    /**
     * Reverses the elements in an Array.
     */
    Vector.prototype.reverse = function () { return []; };
    /**
     * Removes the first element from an array and returns it.
     */
    Vector.prototype.shift = function () { return null; };
    /**
     * Returns a section of an array.
     *
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    Vector.prototype.slice = function (start, end) { return []; };
    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    Vector.prototype.sort = function (compareFn) { return []; };
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
     *
     * @param start The zero-based location in the array from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the array in place of the deleted elements.
     */
    Vector.prototype.splice = function (start, deleteCount) {
        if (deleteCount === void 0) { deleteCount = 1; }
        var items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            items[_i - 2] = arguments[_i];
        }
        return [];
    };
    /**
     * Inserts new elements at the start of an array.
     *
     * @param items Elements to insert at the start of the Array.
     */
    Vector.prototype.unshift = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i - 0] = arguments[_i];
        }
        return 0;
    };
    /**
     * Returns the index of the first occurrence of a value in an array.
     *
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    Vector.prototype.indexOf = function (searchElement, fromIndex) { return 0; };
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     *
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    Vector.prototype.lastIndexOf = function (searchElement, fromIndex) { return 0; };
    /**
     * Determines whether all the members of an array satisfy the specified test.
     *
     * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.every = function (callbackfn, thisArg) { return false; };
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     *
     * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.some = function (callbackfn, thisArg) { return false; };
    /**
     * Performs the specified action for each element in an array.
     *
     * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.forEach = function (callbackfn, thisArg) { };
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     *
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.map = function (callbackfn, thisArg) { return []; };
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     *
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.filter = function (callbackfn, thisArg) { return []; };
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     *
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    Vector.prototype.reduce = function (callbackfn, initialValue) { return null; };
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     *
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    Vector.prototype.reduceRight = function (callbackfn, initialValue) { return null; };
    /* ------------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------------ */
    /**
     * Returns a string representation of an array.
     */
    Vector.prototype.toString = function () { return ""; };
    Vector.prototype.toLocaleString = function () { return ""; };
    return Vector;
})();
Vector.prototype = new Array();
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
var Set = (function () {
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * <p> Default Constructor. </p>
     */
    function Set() {
        this.data_ = new Vector();
    }
    /**
     * <p> Insert element. </p>
     * <p> Inserts a new element in the Set. </p>
     *
     * <p> Each element is inserted only if it is not equivalent to any other element already
     * in the container (elements in an unordered_set have unique values). </p>
     *
     * <p> This effectively increases the container size by the number of elements inserted. </p>
     */
    Set.prototype.insert = function (key) {
        if (this.has(key) == true)
            return;
        this.data_.push(key);
    };
    /**
     * <p> Erase an element. </p>
     * <p> Removes an element by its key(identifier) from the Set container. </p>
     *
     * @param key Key of the element to be removed from the Set.
     * @throw exception out of range.
     */
    Set.prototype.erase = function (key) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i] == key) {
                this.data_.splice(i, 1);
                return;
            }
        throw "out of range";
    };
    /**
     * <p> Clear content. </p>
     *
     * <p> Removes all elements from the map container (which are destroyed),
     * leaving the container with a size of 0. </p>
     */
    Set.prototype.clear = function () {
        this.data_ = new Vector();
    };
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    /**
     * <p> Get data. </p>
     * <p> Returns the source container of the Set. </p>
     *
     * <h4> Note </h4>
     * <p> Changes on the returned container influences the source Set. </p>
     */
    Set.prototype.data = function () {
        return this.data_;
    };
    /**
     * <p> Return container size. </p>
     * <p> Returns the number of elements in Set container. </p>
     *
     * @return The number of elements in the container.
     */
    Set.prototype.size = function () {
        return this.data.length;
    };
    /**
     * <p> Whether have the item or not. </p>
     * <p> Indicates whether a map has an item having the specified identifier. </p>
     *
     * @param key Key value of the element whose mapped value is accessed.
     * @return Whether the map has an item having the specified identifier
     */
    Set.prototype.has = function (key) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i] == key)
                return true;
        return false;
    };
    /* ---------------------------------------------------------
        COMPARE
    --------------------------------------------------------- */
    /**
     * <p> Whether a Set is equal with the Set. </p>
     *
     * @param obj A Set to compare
     * @return Indicates whether equal or not.
     */
    Set.prototype.equals = function (obj) {
        if (this.size() != obj.size())
            return false;
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i] != obj.data_[i])
                return false;
        return true;
    };
    /* ---------------------------------------------------------
        ITERATORS
    --------------------------------------------------------- */
    /**
     * <p> Return iterator to beginning. </p>
     * <p> Returns an iterator referring the first element in the Set container. </p>
     *
     * <h4> Note </h4>
     * <p> If the container is empty, the returned iterator is same with end(). </p>
     *
     * @return An iterator to the key element in the container.
     */
    Set.prototype.begin = function () {
        if (this.data_.length == 0)
            return this.end();
        else
            return new SetIterator(this, 0);
    };
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
    Set.prototype.end = function () {
        return new SetIterator(this, -1);
    };
    return Set;
})();
/**
 * <p> An iterator of a Set. </p>
 * <ul>
 *  <li> _Ty: Type of the elements. Each element in a Set is also uniquely identified by this value.
 *            Aliased as member types unordered_set::key_type and unordered_set::value_type. </li>
 * </ul>
 *
 * @author Jeongho Nam
 */
var SetIterator = (function () {
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
    function SetIterator(set_, index) {
        this.set_ = set_;
        this.index = index;
    }
    /* ---------------------------------------------------------
        GETTERS
    --------------------------------------------------------- */
    /**
     * <p> Get key value of the iterator is pointing. </p>
     *
     * @return A key value of the iterator.
     */
    SetIterator.prototype.value = function () {
        return this.set_.data()[this.index];
    };
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
    SetIterator.prototype.equals = function (obj) {
        return (this.set_ == obj.set_ && this.index == obj.index);
    };
    /* ---------------------------------------------------------
        MOVERS
    --------------------------------------------------------- */
    /**
     * <p> Get iterator to previous element. </p>
     * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
     *
     * @return An iterator of the previous item.
     */
    SetIterator.prototype.prev = function () {
        if (this.index == 0)
            return this.set_.end();
        else
            return new SetIterator(this.set_, this.index - 1);
    };
    /**
     * <p> Get iterator to next element. </p>
     * <p> If current iterator is the last item, returns end(). </p>
     *
     * @return An iterator of the next item.
     */
    SetIterator.prototype.next = function () {
        if (this.index >= this.set_.size())
            return this.set_.end();
        else
            return new SetIterator(this.set_, this.index + 1);
    };
    return SetIterator;
})();
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
var Map = (function () {
    /**
     * <p> Default Constructor. </p>
     */
    function Map() {
        this.data_ = new Vector();
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
    Map.prototype.data = function () {
        return this.data_;
    };
    /**
     * <p> Return container size. </p>
     * <p> Returns the number of elements in Map container. </p>
     *
     * @return The number of elements in the container.
     */
    Map.prototype.size = function () {
        return this.data_.length;
    };
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
    Map.prototype.find = function (key) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i].first == key)
                return new MapIterator(this, i);
        return this.end();
    };
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
    Map.prototype.has = function (key) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i].first == key)
                return true;
        return false;
    };
    /**
     * <p> Get element by key. </p>
     * <p> Returns a reference to the mapped value of the element identified with key. </p>
     *
     * @param key Key value of the element whose mapped value is accessed.
     * @throw exception out of range.
     *
     * @return A reference object of the mapped value (_Ty)
     */
    Map.prototype.get = function (key) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i].first == key)
                return this.data_[i].second;
        throw "out of range";
    };
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
    Map.prototype.begin = function () {
        if (this.size() == 0)
            return this.end();
        return new MapIterator(this, 0);
    };
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
    Map.prototype.end = function () {
        return new MapIterator(this, -1);
    };
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
    Map.prototype.set = function (key, value) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i].first == key) {
                this.data_[i].second = value;
                return;
            }
        this.data_.push(new Pair(key, value));
    };
    /**
     * <p> Erase an element. </p>
     * <p> Removes an element by its key(identifier) from the Map container. </p>
     *
     * @param key Key of the element to be removed from the Map.
     * @throw exception out of range.
     */
    Map.prototype.erase = function (key) {
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i].first == key) {
                this.data_.splice(i, 1);
                return;
            }
        throw "out of range";
    };
    /**
     * <p> Clear content. </p>
     *
     * <p> Removes all elements from the map container (which are destroyed),
     * leaving the container with a size of 0. </p>
     */
    Map.prototype.clear = function () {
        this.data_ = new Vector();
    };
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
    Map.prototype.equals = function (obj) {
        if (this.size() != obj.size())
            return false;
        for (var i = 0; i < this.data_.length; i++)
            if (this.data_[i].equals(obj.data_[i]) == false)
                return false;
        return true;
    };
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
    Map.prototype.toString = function () {
        var str = "{";
        for (var i = 0; i < this.data_.length; i++) {
            var pair = this.data_[i];
            var key = "\"" + pair.first + "\"";
            var value = (typeof pair.second == "string")
                ? "\"" + pair.second + "\""
                : String(pair.second);
            str += "{\"key\": " + key + ": value: " + value + "}";
        }
        str += "}";
        return str;
    };
    return Map;
})();
/**
 * <p> A bi-directional iterator. </p>
 * <ul>
 *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
 *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
 * </ul>
 *
 * @author Jeongho Nam
 */
var MapIterator = (function () {
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
    function MapIterator(map, index) {
        this.map = map;
        if (index != -1 && index < map.size())
            this.index = index;
        else
            this.index = -1;
    }
    Object.defineProperty(MapIterator.prototype, "first", {
        /* ---------------------------------------------------------
            GETTERS AND SETTERS
        --------------------------------------------------------- */
        /**
         * <p> Get first element (key). </p>
         */
        get: function () {
            return this.map.data()[this.index].first;
        },
        /**
         * <p> Set first element (key). </p>
         */
        set: function (key) {
            this.map.data()[this.index].first = key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapIterator.prototype, "second", {
        /**
         * <p> Get second element (mapped value). </p>
         */
        get: function () {
            return this.map.data()[this.index].second;
        },
        /**
         * <p> Set second element (mapped value). </p>
         */
        set: function (val) {
            this.map.data()[this.index].second = val;
        },
        enumerable: true,
        configurable: true
    });
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
    MapIterator.prototype.equals = function (obj) {
        return (this.map == obj.map && this.index == obj.index);
    };
    /* ---------------------------------------------------------
        MOVERS
    --------------------------------------------------------- */
    /**
     * <p> Get iterator to previous element. </p>
     * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
     *
     * @return An iterator of the previous item.
     */
    MapIterator.prototype.prev = function () {
        if (this.index - 1 < 0)
            return this.map.end();
        else
            return new MapIterator(this.map, this.index - 1);
    };
    /**
     * <p> Get iterator to next element. </p>
     * <p> If current iterator is the last item, returns end(). </p>
     *
     * @return An iterator of the next item.
     */
    MapIterator.prototype.next = function () {
        if (this.index + 1 >= this.map.size())
            return this.map.end();
        else
            return new MapIterator(this.map, this.index + 1);
    };
    return MapIterator;
})();
/**
 * <p> A dictionary, Map<string, _Ty>. </p>
 *
 * @inheritDoc
 * @author Jeongho Nam
 */
var Dictionary = (function (_super) {
    __extends(Dictionary, _super);
    /**
     * <p> Default Constructor. </p>
     */
    function Dictionary() {
        _super.call(this);
    }
    return Dictionary;
})(Map);
/* =================================================================================
    LIBRARY - UTILITIES
================================================================================= */
/**
 * <p> A utility class supporting static methods of string. </p>
 *
 * @author Jeongho Nam
 */
var StringUtil = (function () {
    function StringUtil() {
    }
    /**
     * <p> Get a tabbed string by specified size. </p>
     */
    StringUtil.tab = function (size) {
        var str = "";
        for (var i = 0; i < size; i++)
            str += "\t";
        return str;
    };
    /**
     * <p> Get a tabbed HTLM string by specified size. </p>
     */
    StringUtil.htmlTab = function (size) {
        var str = "";
        for (var i = 0; i < size; i++)
            str += "&nbsp;&nbsp;&nbsp;&nbsp;";
        return str;
    };
    /**
     * <p> Replace all patterns of a string. </p>
     */
    StringUtil.replaceAll = function (str, pairs) {
        if (pairs.length == 0)
            return str;
        var foundPairList = new Array();
        //FIND POSITION-INDEX IN ORIGINAL STRING
        for (var i = 0; i < pairs.length; i++) {
            var index = 0;
            while (true) {
                index = str.indexOf(pairs[i].first, index);
                if (index == -1)
                    break;
                foundPairList.push(new Pair(index++, i));
            }
        }
        if (foundPairList.length == 0)
            return str;
        foundPairList.sort();
        //REPLACE
        var res = "";
        var index = 0;
        while (foundPairList.length > 0) {
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
    };
    return StringUtil;
})();
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
var XML = (function (_super) {
    __extends(XML, _super);
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
    function XML(str) {
        if (str === void 0) { str = ""; }
        _super.call(this);
        this.properties = new Dictionary();
        this.value = "";
        if (str.indexOf("<") == -1)
            return;
        var start;
        var end;
        //ERASE HEADER OF XML
        if ((start = str.indexOf("<?xml")) != -1) {
            end = str.indexOf("?>", start);
            if (end != -1)
                str = str.substr(end + 2);
        }
        //ERASE COMMENTS
        while ((start = str.indexOf("<!--")) != -1) {
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
    XML.prototype.construct = function (str) {
        this.parseTag(str);
        this.parseProperty(str);
        var res = this.parseValue(str);
        if (res.second == true)
            this.parseChildren(res.first);
    };
    /**
     * <p> Parse and fetch a tag. </p>
     */
    XML.prototype.parseTag = function (str) {
        var start = str.indexOf("<") + 1;
        var end = this.calcMinIndex(str.indexOf(" ", start), str.indexOf("\r\n", start), str.indexOf("\n", start), str.indexOf("\t", start), str.indexOf(">", start), str.indexOf("/", start));
        if (start == 0 || end == -1)
            return;
        this.tag = str.substring(start, end);
    };
    /**
     * <p> Parse and fetch properties. </p>
     */
    XML.prototype.parseProperty = function (str) {
        var start = str.indexOf("<" + this.tag) + this.tag.length + 1;
        var end = this.calcMinIndex(str.lastIndexOf("/"), str.indexOf(">", start));
        if (start == -1 || end == -1 || start >= end)
            return;
        //<comp label='ABCD' /> : " label='ABCD' "
        var line = str.substring(start, end);
        if (line.indexOf("=") == -1)
            return;
        var label;
        var value;
        var helpers = new Array();
        var inQuote = false;
        var quoteType;
        var equal;
        //INDEXING
        for (var i = 0; i < line.length; i++) {
            //Start of quote
            if (inQuote == false && (line.charAt(i) == "'" || line.charAt(i) == "\"")) {
                inQuote = true;
                start = i;
                if (line.charAt(i) == "'")
                    quoteType = 1;
                else if (line.charAt(i) == "\"")
                    quoteType = 2;
            }
            else if (inQuote == true &&
                ((quoteType == 1 && line.charAt(i) == "'") ||
                    (quoteType == 2 && line.charAt(i) == "\""))) {
                helpers.push({ "type": quoteType, "start": start, "end": i });
                inQuote = false;
            }
        }
        //CONSTRUCTING
        for (var i = 0; i < helpers.length; i++) {
            var quote = helpers[i];
            if (i == 0) {
                equal = line.indexOf("=");
                label = line.substring(0, equal).trim();
            }
            else {
                equal = line.indexOf("=", helpers[i - 1]["end"] + 1);
                label = line.substring(helpers[i - 1]["end"] + 1, equal).trim();
            }
            value = line.substring(helpers[i]["start"] + 1, helpers[i]["end"]);
            this.setProperty(label, XML.decodeProperty(value));
        }
    };
    /**
     * <p> Parse and fetch a value. </p>
     */
    XML.prototype.parseValue = function (str) {
        var end_slash = str.lastIndexOf("/");
        var end_block = str.indexOf(">");
        if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) {
            //STATEMENT1: <TAG />
            //STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
            this.value = "";
            return new Pair(str, false);
        }
        var start = end_block + 1;
        var end = str.lastIndexOf("<");
        str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG
        if (str.indexOf("<") == -1)
            this.value = XML.decodeValue(str.trim());
        else
            this.value = "";
        return new Pair(str, true);
    };
    /**
     * <p> Parse and construct children XML objects. </p>
     */
    XML.prototype.parseChildren = function (str) {
        if (str.indexOf("<") == -1)
            return;
        var start = str.indexOf("<");
        var end = str.lastIndexOf(">") + 1;
        str = str.substring(start, end);
        var blockStart = 0;
        var blockEnd = 0;
        start = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
                blockStart++;
            else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
                blockEnd++;
            if (blockStart >= 1 && blockStart == blockEnd) {
                end = str.indexOf(">", i);
                var xmlList;
                var xml = new XML();
                xml.construct(str.substring(start, end + 1));
                if (this.has(xml.tag) == true)
                    xmlList = this.get(xml.tag);
                else {
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
    };
    /* -------------------------------------------------------------
        ACCESSORS
    ------------------------------------------------------------- */
    /**
     * <p> Get tag. </p>
     */
    XML.prototype.getTag = function () {
        return this.tag;
    };
    /**
     * <p> Get value. </p>
     */
    XML.prototype.getValue = function () {
        return this.value;
    };
    /**
     * <p> Test wheter a property exists or not. </p>
     */
    XML.prototype.hasProperty = function (key) {
        return this.properties.has(key);
    };
    /**
     * <p> Get property by its key. </p>
     */
    XML.prototype.getProperty = function (key) {
        return this.properties.get(key);
    };
    /* -------------------------------------------------------------
        SETTERS
    ------------------------------------------------------------- */
    /**
     * <p> Set tag (identifier) of the XML. </p>
     */
    XML.prototype.setTag = function (str) {
        this.tag = str;
    };
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
    XML.prototype.setValue = function (str) {
        this.value = str;
    };
    /**
     * <p> Set a property with its key. </p>
     */
    XML.prototype.setProperty = function (key, value) {
        this.properties.set(key, value);
    };
    /**
     * <p> Erase a property by its key. </p>
     *
     * @param key The key of the property to erase
     * @throw exception out of range
     */
    XML.prototype.eraseProperty = function (key) {
        if (this.properties.has(key) == false)
            throw "out of range";
        else
            this.properties.erase(key);
    };
    XML.prototype.addAllProperties = function (xml) {
        for (var it = xml.properties.begin(); it.equals(xml.properties.end()) == false; it = it.next())
            this.setProperty(it.first, it.second);
    };
    XML.prototype.clearProperties = function () {
        this.properties = new Dictionary();
    };
    /* -------------------------------------------------------------
        FILTERS
    ------------------------------------------------------------- */
    XML.prototype.calcMinIndex = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var min = args[0];
        for (var i = 1; i < args.length; i++) {
            if (args[i] == -1)
                continue;
            if (min == -1 || args[i] < min)
                min = args[i];
        }
        return min;
    };
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
    XML.decodeValue = function (str) {
        var pairs = [
            new Pair("&amp;", "&"),
            new Pair("&lt;", "<"),
            new Pair("&gt;", ">")
        ];
        return StringUtil.replaceAll(str, pairs);
    };
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
    XML.encodeValue = function (str) {
        var pairs = [
            new Pair("&", "&amp;"),
            new Pair("<", "&lt;"),
            new Pair(">", "&gt;")
        ];
        return StringUtil.replaceAll(str, pairs);
    };
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
    XML.decodeProperty = function (str) {
        var pairs = [
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
    };
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
    XML.encodeProperty = function (str) {
        var pairs = [
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
    };
    /* -------------------------------------------------------------
        EXPORTS
    ------------------------------------------------------------- */
    /**
     * <p> Convert the XML to a string. </p>
     */
    XML.prototype.toString = function (level) {
        if (level === void 0) { level = 0; }
        var str = StringUtil.tab(level) + "<" + this.tag;
        var childrenString = "";
        //PROPERTIES
        for (var p_it = this.properties.begin(); p_it.equals(this.properties.end()) == false; p_it = p_it.next())
            str += " " + p_it.first + "=\"" + XML.encodeProperty(String(p_it.second)) + "\"";
        if (this.size() == 0) {
            if (this.value != "")
                str += ">" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
            else
                str += " />";
        }
        else {
            str += ">\n";
            for (var x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
                str += x_it.second.toString(level + 1);
            str += StringUtil.tab(level) + "</" + this.tag + ">";
        }
        return str;
    };
    /**
     * <p> Convert the XML to HTML string. </p>
     */
    XML.prototype.toHTML = function (level) {
        if (level === void 0) { level = 0; }
        var str = StringUtil.htmlTab(level) + "&lt;" + this.tag;
        var childrenString = "";
        //PROPERTIES
        for (var p_it = this.properties.begin(); p_it.equals(this.properties.end()) == false; p_it = p_it.next())
            str += " " + p_it.first + "=&quot;" + XML.encodeProperty(String(p_it.second)) + "&quot;";
        if (this.size() == 0) {
            if (this.value != "")
                str += "&gt;" + XML.encodeValue(String(this.value)) + "</" + this.tag + ">";
            else
                str += " /&gt;";
        }
        else {
            str += "&gt;<br>\n";
            for (var x_it = this.begin(); x_it.equals(this.end()) == false; x_it = x_it.next())
                str += x_it.second.toHTML(level + 1);
            str += StringUtil.htmlTab(level) + "&lt;/" + this.tag + "&gt;";
        }
        return str;
    };
    return XML;
})(Dictionary);
/**
 * <p> List of XML(s) having same tag. </p>
 *
 * @author Jeongho Nam
 */
var XMLList = (function (_super) {
    __extends(XMLList, _super);
    /**
     * <p> Default Constructor. </p>
     */
    function XMLList() {
        _super.call(this);
    }
    /**
     * <p> Convert XMLList to string. </p>
     *
     * @param level Level(depth) of the XMLList.
     */
    XMLList.prototype.toString = function (level) {
        if (level === void 0) { level = 0; }
        var str = "";
        for (var i = 0; i < this.length; i++)
            str += this[i].toString(level) + "\n";
        return str;
    };
    /**
     * <p> Convert XMLList to HTML string. </p>
     *
     * @param level Level(depth) of the XMLList.
     */
    XMLList.prototype.toHTML = function (level) {
        if (level === void 0) { level = 0; }
        var str = "";
        for (var i = 0; i < this.length; i++)
            str += this[i].toHTML(level) + "<br>\n";
        return str;
    };
    return XMLList;
})(Vector);
/* =================================================================================
    LIBRARY - CASE GENERATOR
================================================================================= */
/**
 * <p> Case generator. </p>
 *
 * <p> CaseGenerator is an abstract case generator using like a matrix. </p>
 * <ul>
 *  <li> nTTr(n^r) -> CombinedPermutationGenerator </li>
 *  <li> nPr -> PermutationGenerator </li>
 *  <li> n! -> FactorialGenerator </li>
 * </ul>
 *
 * @author Jeongho Nam
 */
var CaseGenerator = (function () {
    /* ---------------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------------- */
    /**
     * <p> Construct from size of N and R. </p>
     *
     * @param n Size of candidates.
     * @param r Size of elements of each case.
     */
    function CaseGenerator(n, r) {
        this.n_ = n;
        this.r_ = r;
    }
    /* ---------------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------------- */
    /**
     * <p> Get size of all cases. </p>
     *
     * @return Get a number of the all cases.
     */
    CaseGenerator.prototype.size = function () {
        return this.size_;
    };
    /**
     * <p> Get size of the N. </p>
     */
    CaseGenerator.prototype.n = function () {
        return this.n_;
    };
    /**
     * <p> Get size of the R. </p>
     */
    CaseGenerator.prototype.r = function () {
        return this.r_;
    };
    /**
     * <p> Get index'th case. </p>
     *
     * @param index Index number
     * @return The row of the index'th in combined permuation case
     */
    CaseGenerator.prototype.at = function (index) {
        return null;
    };
    return CaseGenerator;
})();
/**
 * <p> A combined-permutation case generator. </p>
 * <p> <sub>n</sub>TT<sub>r</sub> </p>
 *
 * @inheritDoc
 * @author Jeongho Nam
 */
var CombinedPermutationGenerator = (function (_super) {
    __extends(CombinedPermutationGenerator, _super);
    /* ---------------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------------- */
    /**
     * <p> Construct from size of N and R. </p>
     *
     * @param n Size of candidates.
     * @param r Size of elements of each case.
     */
    function CombinedPermutationGenerator(n, r) {
        _super.call(this, n, r);
        this.size_ = Math.pow(n, r);
        this.dividerArray = new Vector();
        for (var i = 0; i < r; i++) {
            var x = r - (i + 1);
            var val = Math.pow(n, x);
            this.dividerArray.push(val);
        }
    }
    CombinedPermutationGenerator.prototype.at = function (index) {
        var row = new Vector();
        for (var i = 0; i < this.r_; i++) {
            var val = Math.floor(index / this.dividerArray[i]) % this.n_;
            row.push(val);
        }
        return row;
    };
    return CombinedPermutationGenerator;
})(CaseGenerator);
/**
 * <p> A permutation case generator. </p>
 * <p> nPr </p>
 *
 * @inheritDoc
 * @author Jeongho Nam
 */
var PermuationGenerator = (function (_super) {
    __extends(PermuationGenerator, _super);
    /* ---------------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------------- */
    /**
     * <p> Construct from size of N and R. </p>
     *
     * @param n Size of candidates.
     * @param r Size of elements of each case.
     */
    function PermuationGenerator(n, r) {
        _super.call(this, n, r);
        this.size_ = n;
        for (var i = n - 1; i > n - r; i--)
            this.size_ *= i;
    }
    PermuationGenerator.prototype.at = function (index) {
        var atoms = new Vector();
        for (var i = 0; i < this.n_; i++)
            atoms.push(i);
        var row = new Vector();
        for (var i = 0; i < this.r_; i++) {
            var item = index % atoms.length;
            index = Math.floor(index / atoms.length);
            row.push(atoms[item]);
            atoms.splice(item, 1);
        }
        return row;
    };
    return PermuationGenerator;
})(CaseGenerator);
var FactorialGenerator = (function (_super) {
    __extends(FactorialGenerator, _super);
    function FactorialGenerator(n) {
        _super.call(this, n, n);
    }
    return FactorialGenerator;
})(PermuationGenerator);
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
var ServerConnector = (function () {
    /**
     * <p> Constructor with parent. </p>
     */
    function ServerConnector(parent) {
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
    ServerConnector.prototype.connect = function (ip, port) {
        if (ip.indexOf("ws://") == -1) {
            if (ip.indexOf("://") != -1)
                throw "only websocket is possible";
            else
                ip = "ws://" + ip;
        }
        this.socket = new WebSocket(ip + ":" + port);
        this.socket.onopen = this.handleConnect;
        this.socket.onmessage = this.handleReply;
    };
    /* ----------------------------------------------------
        IPROTOCOL'S METHOD
    ---------------------------------------------------- */
    /**
     * <p> Send data to the server. </p>
     */
    ServerConnector.prototype.sendData = function (invoke) {
        var xml = invoke.toXML();
        var str = xml.toString();
        this.socket.send(str);
    };
    /**
     * <p> Shift responsiblity of handling message to parent. </p>
     */
    ServerConnector.prototype.replyData = function (invoke) {
        this.parent.replyData(invoke);
    };
    /* ----------------------------------------------------
        HANDLING CONNECTION AND MESSAGES
    ---------------------------------------------------- */
    ServerConnector.prototype.handleConnect = function (event) {
        if (this.onopen == null)
            return;
        this.onopen.apply([event]);
    };
    /**
     * <p> Handling replied message. </p>
     */
    ServerConnector.prototype.handleReply = function (event) {
        this.str += event.data;
        var invokeArray;
        var indexPair = null;
        var sizePair = new Pair(0, 0);
        var startIndex = 0;
        var endIndex = 0;
        while (true) {
            var iPair = new Pair(this.str.indexOf("<invoke", startIndex), this.str.indexOf("</invoke>", startIndex)); //FIND WORDS
            if (iPair.first != -1)
                sizePair.first++;
            if (iPair.second != -1)
                sizePair.second++; //AND COUNTS
            if (indexPair == null && sizePair.first == 1)
                indexPair = new Pair(iPair.first, -1); //SPECIFY THE STARTING INDEX
            //FAILED TO FIND ANYTHING
            if (iPair.first == -1 || iPair.second == -1)
                break;
            /* FOUND SOMETHING FROM NOW ON */
            //AN INVOKE HAS FOUND
            if (indexPair != null && sizePair.first == sizePair.second) {
                var start = indexPair.first;
                var end = indexPair.second + ("</invoke>").length;
                var xml = new XML(this.str.substring(start, end));
                var invoke = new Invoke(xml);
                invokeArray.push(invoke);
                //CLEAR CURRENT'S INDEX PAIR
                endIndex = end;
                indexPair = null;
            }
            //ADJUST INDEX
            startIndex = Math.max(Math.max(iPair.first, iPair.second), 1);
        }
        //ERASE USED CHARACTERS
        if (endIndex != 0)
            this.str = this.str.substr(endIndex);
        //CALL REPLY_DATA
        for (var i = 0; i < invokeArray.length; i++)
            this.replyData(invokeArray[i]);
    };
    return ServerConnector;
})();
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
var Entity = (function () {
    /**
     * <p> Default Constructor. </p>
     */
    function Entity() {
        //NOTHING
    }
    Entity.prototype.construct = function (xml) {
        //SOMETHING TO COMPOSE MEMBER DATA
    };
    Entity.prototype.TAG = function () { return ""; };
    Entity.prototype.key = function () { return ""; };
    Entity.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag(this.TAG());
        return xml;
    };
    return Entity;
})();
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
var EntityArray = (function (_super) {
    __extends(EntityArray, _super);
    /* ------------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------------ */
    /**
     * <p> Default Constructor. </p>
     */
    function EntityArray() {
        _super.call(this);
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
    EntityArray.prototype.construct = function (xml) {
        this.splice(0, this.length);
        if (xml.has(this.CHILD_TAG()) == false)
            return;
        var xmlList = xml.get(this.CHILD_TAG());
        for (var i = 0; i < xmlList.length; i++) {
            var child = this.createChild(xmlList[i]);
            if (child != null) {
                child.construct(xmlList[i]);
                this.push(child);
            }
        }
    };
    /**
     * <p> Factory method of a child Entity. </p>
     *
     * <p> EntityArray::createChild() is a factory method creating a new child Entity which is belonged
     * to the EntityArray. This method is called by EntityArray::construct(). The children construction
     * methods Entity::construct() will be called by abstract method of the EntityArray::construct(). </p>
     *
     * @return A new child Entity belongs to EntityArray.
     */
    EntityArray.prototype.createChild = function (xml) {
        return null;
    };
    EntityArray.prototype.set = function (key, entity) {
        this.push(entity);
    };
    EntityArray.prototype.erase = function (key) {
        for (var i = this.length - 1; i >= 0; i--)
            if (this[i].key() == key)
                this.splice(i, 1);
    };
    /* ------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------ */
    EntityArray.prototype.key = function () {
        return "";
    };
    EntityArray.prototype.has = function (key) {
        for (var i = 0; i < this.length; i++)
            if (this[i].key() == key)
                return true;
        return false;
    };
    EntityArray.prototype.get = function (key) {
        for (var i = 0; i < this.length; i++)
            if (this[i].key() == key)
                return this[i];
        throw "out of range";
    };
    /* ------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------ */
    EntityArray.prototype.TAG = function () { return ""; };
    /**
     * <p> A tag name of children objects. </p>
     */
    EntityArray.prototype.CHILD_TAG = function () { return ""; };
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
    EntityArray.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag(this.TAG());
        if (this.length == 0)
            return xml;
        var xmlList = new XMLList();
        for (var i = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());
        xml.set(this.CHILD_TAG(), xmlList);
        return xml;
    };
    return EntityArray;
})(Vector);
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
var Invoke = (function (_super) {
    __extends(Invoke, _super);
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
    function Invoke() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this);
        if (args.length == 1) {
            var val = args[0];
            if (typeof val == "string")
                this.listener = val;
            else if (val instanceof XML) {
                var xml = val;
                this.construct(xml);
            }
        }
        else {
            this.listener = args[0];
            for (var i = 1; i < args.length; i++) {
                var value = args[i];
                var parameter = new InvokeParameter("", value);
                this.push(parameter);
            }
        }
    }
    Invoke.prototype.construct = function (xml) {
        _super.prototype.construct.call(this, xml);
        this.listener = xml.getProperty("listener");
    };
    /* -------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------- */
    /**
     * <p> Get listener. </p>
     */
    Invoke.prototype.getListener = function () {
        return this.listener;
    };
    /**
     * <p> Get arguments for Function.apply(). </p>
     *
     * @return An array containing values of the parameters.
     */
    Invoke.prototype.getArguments = function () {
        var args = [];
        for (var i = 0; i < this.length; i++)
            args.push(this[i].getValue());
        return args;
    };
    /* -------------------------------------------------------------------
       APPLY BY FUNCTION POINTER
   ------------------------------------------------------------------- */
    /**
     * <p> Apply to a matched function. </p>
     */
    Invoke.prototype.apply = function (obj) {
        if (!(this.listener in obj && obj[this.listener] instanceof Function))
            return false;
        var func = obj[this.listener];
        var args = this.getArguments();
        func.apply(obj, args);
        return true;
    };
    /* -------------------------------------------------------------------
        EXPORTER
    ------------------------------------------------------------------- */
    Invoke.prototype.TAG = function () {
        return "invoke";
    };
    Invoke.prototype.CHILD_TAG = function () {
        return "parameter";
    };
    Invoke.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("listener", this.listener);
        return xml;
    };
    return Invoke;
})(EntityArray);
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
var InvokeParameter = (function (_super) {
    __extends(InvokeParameter, _super);
    /* -------------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------------- */
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
    function InvokeParameter() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this);
        if (args.length == 1 && args[0] instanceof XML) {
            this.construct(args[0]);
        }
        else if (args.length == 2) {
            this.name = args[0];
            var value = args[1];
            if (value instanceof Entity || value instanceof EntityArray) {
                this.type = "XML";
                this.value = value.toXML();
            }
            else if (value instanceof XML) {
                this.type = "XML";
                this.value = value;
            }
            else if (typeof value == "number" || typeof value == "string") {
                this.type = typeof value;
                this.value = value;
            }
            else {
                this.type = "unknown";
                this.value = value;
            }
        }
        else if (args.length == 3) {
            this.name = args[0];
            this.type = args[1];
            this.value = args[2];
        }
    }
    InvokeParameter.prototype.construct = function (xml) {
        this.name = xml.hasProperty("name") ? xml.getProperty("name") : "";
        this.type = xml.getProperty("type");
        if (this.type == "XML")
            this.value = xml.begin().second[0];
        else
            this.value = xml.getValue();
    };
    /* -------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------- */
    InvokeParameter.prototype.key = function () {
        return this.name;
    };
    /**
     * <p> Get name. </p>
     */
    InvokeParameter.prototype.getName = function () {
        return this.name;
    };
    /**
     * <p> Get type. </p>
     */
    InvokeParameter.prototype.getType = function () {
        return this.type;
    };
    /**
     * <p> Get value. </p>
     */
    InvokeParameter.prototype.getValue = function () {
        return this.value;
    };
    /* -------------------------------------------------------------------
        EXPORTER
    ------------------------------------------------------------------- */
    InvokeParameter.prototype.TAG = function () {
        return "parameter";
    };
    InvokeParameter.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        if (this.name != "")
            xml.setProperty("name", this.name);
        xml.setProperty("type", this.type);
        if (this.type == "XML") {
            var xmlList = new XMLList();
            xmlList.push(this.value);
            xml.set(this.value.tag, xmlList);
        }
        else
            xml.setValue(this.value);
        return xml;
    };
    return InvokeParameter;
})(Entity);
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
var Application = (function () {
    /**
     * <p> Construct from arguments. </p>
     *
     * @param movie A movie represents a service.
     * @param ip An ip address of cloud server to connect.
     * @param port A port number of cloud server to connect.
     */
    function Application(movie, ip, port) {
        this.movie = movie;
        this.socket = new ServerConnector(this);
        this.socket.onopen = this.handleConnect;
        this.socket.connect(ip, port);
    }
    Application.prototype.handleConnect = function (event) {
    };
    /**
     * <p> Handle replied message or shift the responsibility. </p>
     */
    Application.prototype.replyData = function (invoke) {
        if (invoke.apply(this) == false)
            this.movie.sendData(invoke);
    };
    /**
     * <p> Send a data to server. </p>
     */
    Application.prototype.sendData = function (invoke) {
        this.socket.sendData(invoke);
    };
    return Application;
})();
/**
 * <p> A movie belonged to an Application
 */
var Movie = (function () {
    function Movie() {
    }
    /**
     * <p> Handle replied data
     */
    Movie.prototype.replyData = function (invoke) {
        invoke.apply(this) == false;
    };
    /**
     * <p> Send data to server
     */
    Movie.prototype.sendData = function (invoke) {
        this.application.sendData(invoke);
    };
    return Movie;
})();
/**
 * <p> A sub-movie
 */
var SubMovie = (function () {
    function SubMovie() {
    }
    SubMovie.prototype.replyData = function (invoke) {
        invoke.apply(this);
    };
    SubMovie.prototype.sendData = function (invoke) {
        this.parent.sendData(invoke);
    };
    return SubMovie;
})();
/* =================================================================================
    PROTOCOL - EXTERNAL SYSTEM MODULE
================================================================================= */
/**
 * <p> An array of ExternalSystem(s). </p>
 *
 * <p> ExternalSystemArray is an abstract class containing and managing external system drivers. </p>
 *
 * <p> Also, ExternalSystemArray can access to ExternalSystemRole(s) directly. With the method, you
 * can use an ExternalSystemRole as "logical proxy" of an ExternalSystem. Of course, the
 * ExternalSystemRole is belonged to an ExternalSystem. However, if you access an ExternalSystemRole
 * from an ExternalSystemArray directly, not passing by a belonged ExternalSystem, and send an Invoke
 * message even you're not knowing which ExternalSystem is related in, the ExternalSystemRole acted
 * a role of proxy. </p>
 *
 * <p> It's called as "Proxy pattern". With the pattern, you can only concentrate on
 * ExternalSystemRole itself, what to do with Invoke message, irrespective of the ExternalSystemRole
 * is belonged to which ExternalSystem. </p>
 *
 * <ul>
 *  <li> ExternalSystemArray::getRole("something")->sendData(invoke); </li>
 * </ul>
 *
 * @author Jeongho Nam
 */
var ExternalSystemArray = (function (_super) {
    __extends(ExternalSystemArray, _super);
    /* ------------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------------ */
    /**
     * <p> Default Constructor. </p>
     */
    function ExternalSystemArray() {
        _super.call(this);
    }
    /**
     * <p> Start interaction. </p>
     * <p> An abstract method starting interaction with external systems. </p>
     *
     * <p> If external systems are servers, starts connection to them, else clients, opens a server
     * and accepts the external systems. You can addict your own procudures of starting drivers, but
     * if you directly override method of abstract ExternalSystemArray, be careful about virtual
     * inheritance. </p>
     */
    ExternalSystemArray.prototype.start = function () {
        for (var i = 0; i < this.length; i++)
            this[i].start();
    };
    /* ------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------ */
    /**
     * <p> Test whether has a role. </p>
     *
     * @param name Name of an ExternalSystemRole.
     * @return Whether has or not.
     */
    ExternalSystemArray.prototype.hasRole = function (key) {
        for (var i = 0; i < this.length; i++)
            if (this[i].has(key) == true)
                return true;
        return false;
    };
    /**
     * <p> Get a role. </p>
     *
     * @param name Name of an ExternalSystemRole
     * @return A shared pointer of specialized role
     */
    ExternalSystemArray.prototype.getRole = function (key) {
        for (var i = 0; i < this.length; i++)
            if (this[i].has(key) == true)
                return this[i].get(key);
        throw "out of range";
    };
    /* ------------------------------------------------------------------
        CHAIN OF INVOKE MESSAGE
    ------------------------------------------------------------------ */
    ExternalSystemArray.prototype.sendData = function (invoke) {
        var listener = invoke.getListener();
        for (var i = 0; i < this.length; i++)
            for (var j = 0; j < this[i].length; j++)
                if (this[i][j].hasSendListener(listener) == true)
                    this[i].sendData(invoke);
    };
    ExternalSystemArray.prototype.replyData = function (invoke) {
        invoke.apply(this);
    };
    /* ------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------ */
    ExternalSystemArray.prototype.TAG = function () {
        return "systemArray";
    };
    ExternalSystemArray.prototype.CHILD_TAG = function () {
        return "system";
    };
    return ExternalSystemArray;
})(EntityArray);
/**
 * <p> A network driver for an external system. </p>
 *
 * <p> ExternalSystem is a boundary class interacting with an external system by network communication.
 * Also, ExternalSystem is an abstract class that a network role, which one is server and which one is
 * client, is not determined yet. </p>
 *
 * <p> The ExternalSystem has ExternalSystemRole(s) groupped methods, handling Invoke message
 * interacting with the external system, by subject or unit of a moudle. The ExternalSystemRole is
 * categorized in a 'control'. </p>
 *
 * <h4> Note </h4>
 * <p> The ExternalSystem class takes a role of interaction with external system in network level.
 * However, within a framework of Samchon Framework, a boundary class like the ExternalSystem is
 * not such important. You can find some evidence in a relationship between ExternalSystemArray,
 * ExternalSystem and ExternalSystemRole. </p>
 *
 * <p> Of course, the ExternalSystemRole is belonged to an ExternalSystem. However, if you
 * access an ExternalSystemRole from an ExternalSystemArray directly, not passing by a belonged
 * ExternalSystem, and send an Invoke message even you're not knowing which ExternalSystem is
 * related in, it's called "Proxy pattern".
 *
 * <p> Like the explanation of "Proxy pattern", you can utilize an ExternalSystemRole as a proxy
 * of an ExternalSystem. With the pattern, you can only concentrate on ExternalSystemRole itself,
 * what to do with Invoke message, irrespective of the ExternalSystemRole is belonged to which
 * ExternalSystem. </p>
 *
 * @author Jeongho Nam
 */
var ExternalSystem = (function (_super) {
    __extends(ExternalSystem, _super);
    /* ------------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------------ */
    /**
     * <p> Default Constructor. </p>
     */
    function ExternalSystem() {
        _super.call(this);
        this.driver = null;
    }
    ExternalSystem.prototype.construct = function (xml) {
        _super.prototype.construct.call(this, xml);
        this.name = xml.getProperty("name");
        this.ip = xml.getProperty("ip");
        this.port = xml.getProperty("port");
    };
    /**
     * <p> Start interaction. </p>
     * <p> An abstract method starting interaction with an external system. </p>
     *
     * <p> If an external systems are a server, starts connection and listening Inovoke message,
     * else clients, just starts listening only. You also can addict your own procudures of starting
     * the driver, but if you directly override method of abstract ExternalSystem, be careful about
     * virtual inheritance. </p>
     */
    ExternalSystem.prototype.start = function () {
        if (this.driver != null)
            return;
        this.driver = new ServerConnector(this);
        this.driver.connect(this.ip, this.port);
    };
    /* ------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------ */
    ExternalSystem.prototype.key = function () {
        return this.name;
    };
    /**
     * <p> Get name. </p>
     */
    ExternalSystem.prototype.getName = function () {
        return this.name;
    };
    /**
     * <p> Get ip address of the external system. </p>
     */
    ExternalSystem.prototype.getIP = function () {
        return this.ip;
    };
    /**
     * <p> Get port number of the external system. </p>
     */
    ExternalSystem.prototype.getPort = function () {
        return this.port;
    };
    /* ------------------------------------------------------------------
        CHAIN OF INVOKE MESSAGE
    ------------------------------------------------------------------ */
    ExternalSystem.prototype.sendData = function (invoke) {
        this.driver.sendData(invoke);
    };
    ExternalSystem.prototype.replyData = function (invoke) {
        invoke.apply(this);
        for (var i = 0; i < this.length; i++)
            this[i].replyData(invoke);
    };
    /* ------------------------------------------------------------------
       EXPORTERS
   ------------------------------------------------------------------ */
    ExternalSystem.prototype.TAG = function () {
        return "system";
    };
    ExternalSystem.prototype.CHILD_TAG = function () {
        return "role";
    };
    ExternalSystem.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("name", this.name);
        xml.setProperty("ip", this.ip);
        xml.setProperty("port", this.port);
        return xml;
    };
    return ExternalSystem;
})(EntityArray);
/**
 * <p> A role belongs to an external system. </p>
 *
 * <p> ExternalSystemRole is a 'control' class groupping methods, handling Invoke messages
 * interacting with an external system that the ExternalSystemRole is belonged to, by a subject or
 * unit of a module. <p>
 *
 * <p> ExternalSystemRole can be a "logical proxy" for an ExternalSystem which is containing the
 * ExternalSystemRole. Of course, the ExternalSystemRole is belonged to an ExternalSystem. However,
 * if you access an ExternalSystemRole from an ExternalSystemArray directly, not passing by a
 * belonged ExternalSystem, and send an Invoke message even you're not knowing which ExternalSystem
 * is related in, the ExternalSystemRole acted a role of proxy. </p>
 *
 * <p> It's called as "Proxy pattern". With the pattern, you can only concentrate on
 * ExternalSystemRole itself, what to do with Invoke message, irrespective of the ExternalSystemRole
 * is belonged to which ExternalSystem. </p>
 *
 * @author Jeongho Nam
 */
var ExternalSystemRole = (function (_super) {
    __extends(ExternalSystemRole, _super);
    /* ------------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------------ */
    /**
     * <p> Construct from external system driver. </p>
     *
     * @param system A driver of external system the ExternalSystemRole is belonged to.
     */
    function ExternalSystemRole(system) {
        _super.call(this);
        this.system = system;
        this.sendListeners = new Set();
    }
    ExternalSystemRole.prototype.construct = function (xml) {
        this.name = xml.getProperty("name");
    };
    /* ------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------ */
    ExternalSystemRole.prototype.getName = function () {
        return this.name;
    };
    ExternalSystemRole.prototype.hasSendListener = function (key) {
        return this.sendListeners.has(key);
    };
    /* ------------------------------------------------------------------
        CHAIN OF INVOKE MESSAGE
    ------------------------------------------------------------------ */
    ExternalSystemRole.prototype.sendData = function (invoke) {
        this.system.sendData(invoke);
    };
    ExternalSystemRole.prototype.replyData = function (invoke) {
        invoke.apply(this);
    };
    /* ------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------ */
    ExternalSystemRole.prototype.TAG = function () {
        return "role";
    };
    ExternalSystemRole.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("name", this.name);
        return xml;
    };
    return ExternalSystemRole;
})(Entity);
/* =================================================================================
    PROTOCOL - SLAVE SYSTEM MODULE
================================================================================= */
/**
 * @brief A slave system.
 *
 * @details
 * <p> SlaveSystem, literally, means a slave system belongs to a maste system. </p>
 *
 * <p> The SlaveSystem class is used in opposite side system of master::DistributedSystem
 * and master::ParallelSystem and reports elapsed time of each commmand (by Invoke message)
 * for estimation of its performance. </p>
 *
 * @inheritDoc
 * @author Jeongho Nam
 */
var SlaveSystem = (function (_super) {
    __extends(SlaveSystem, _super);
    /**
     * <p> Default Constructor. </p>
     */
    function SlaveSystem() {
        _super.call(this);
    }
    SlaveSystem.prototype.replyData = function (invoke) {
        var history = new InvokeHistory(invoke);
        _super.prototype.replyData.call(this, invoke);
        history.notifyEnd();
        this.sendData(history.toInvoke());
    };
    return SlaveSystem;
})(ExternalSystem);
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
var InvokeHistory = (function (_super) {
    __extends(InvokeHistory, _super);
    /* -----------------------------------------------------------------
        CONSTRUCTORS
    ----------------------------------------------------------------- */
    /**
     * <p> Construct from an Invoke message. </p>
     *
     * <p> InvokeHistory does not archive entire Invoke message, only archives its listener. </p>
     *
     * @param invoke A message to archive its history log
     */
    function InvokeHistory(invoke) {
        _super.call(this);
        this.uid = invoke.get("invoke_history_uid").getValue();
        this.listener = invoke.getListener();
        this.startTime = new Date();
        //DELETE UID IN INVOKE
        invoke.erase("invoke_history_uid");
    }
    /**
     * <p> Notify end of the process. </p>
     *
     * <p> Notifies end of a process handling the matched Invoke message to InvokeHistory. </p>
     * <p> InvokeHistory archives the end datetime and calculates elapsed time as nanoseconds. </p>
     */
    InvokeHistory.prototype.notifyEnd = function () {
        this.endTime = new Date();
    };
    /* -----------------------------------------------------------------
        EXPORTERS
    ----------------------------------------------------------------- */
    InvokeHistory.prototype.TAG = function () { return "invokeHistory"; };
    InvokeHistory.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("uid", this.uid);
        xml.setProperty("listener", this.listener);
        xml.setProperty("startTime", this.startTime.getTime() * Math.pow(10.0, 6));
        xml.setProperty("endTime", this.endTime.getTime() * Math.pow(10.0, 6));
        return xml;
    };
    /**
     * <p> Get an Invoke message. </p>
     *
     * <p> Returns an Invoke message to report to a master that how much time was elapsed on a
     * process handling the Invoke message. In master, those reports are used to estimate
     * performance of each slave system. </p>
     *
     * @return An Invoke message to report master.
     */
    InvokeHistory.prototype.toInvoke = function () {
        return new Invoke("reportInvokeHistory", this.toXML());
    };
    return InvokeHistory;
})(Entity);
var Product = (function (_super) {
    __extends(Product, _super);
    /* --------------------------------------------------------------------
        CONSTRUCTORS
    -------------------------------------------------------------------- */
    function Product(name, price, volume, weight) {
        if (name === void 0) { name = ""; }
        if (price === void 0) { price = 0; }
        if (volume === void 0) { volume = 0; }
        if (weight === void 0) { weight = 0; }
        _super.call(this);
        this.name = name;
        this.price = price;
        this.volume = volume;
        this.weight = weight;
    }
    Product.prototype.construct = function (xml) {
        this.name = xml.getProperty("name");
        this.price = xml.getProperty("price");
        this.volume = xml.getProperty("volume");
        this.weight = xml.getProperty("weight");
    };
    /* --------------------------------------------------------------------
        GETTERS
    -------------------------------------------------------------------- */
    Product.prototype.getName = function () {
        return this.name;
    };
    Product.prototype.getPrice = function () {
        return this.price;
    };
    Product.prototype.getVolume = function () {
        return this.volume;
    };
    Product.prototype.getWeight = function () {
        return this.weight;
    };
    /* --------------------------------------------------------------------
        EXPORTERS
    -------------------------------------------------------------------- */
    Product.prototype.TAG = function () {
        return "product";
    };
    Product.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("name", this.name);
        xml.setProperty("price", this.price);
        xml.setProperty("volume", this.volume);
        xml.setProperty("weight", this.weight);
        return xml;
    };
    return Product;
})(Entity);
var ProductArray = (function (_super) {
    __extends(ProductArray, _super);
    function ProductArray() {
        _super.call(this);
    }
    ProductArray.prototype.createChild = function (xml) {
        return new Product();
    };
    ProductArray.prototype.TAG = function () {
        return "productArray";
    };
    ProductArray.prototype.CHILD_TAG = function () {
        return "product";
    };
    return ProductArray;
})(EntityArray);
var Wrapper = (function (_super) {
    __extends(Wrapper, _super);
    /* --------------------------------------------------------------------
        CONSTRUCTORS
    -------------------------------------------------------------------- */
    /**
     * <p> Construct from arguments. </p>
     */
    function Wrapper() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this);
        if (args.length == 1 && args[0] instanceof Wrapper) {
            var wrapper = args[0];
            this.name = wrapper.name;
            this.price = wrapper.price;
            this.volume = wrapper.volume;
            this.weight = wrapper.weight;
        }
        else if (args.length == 4) {
            this.name = args[0];
            this.price = args[1];
            this.volume = args[2];
            this.weight = args[3];
        }
    }
    Wrapper.prototype.construct = function (xml) {
        _super.prototype.construct.call(this, xml);
        this.name = xml.getProperty("name");
        this.price = xml.getProperty("price");
        this.volume = xml.getProperty("volume");
        this.weight = xml.getProperty("weight");
    };
    Wrapper.prototype.createChild = function (xml) {
        return new Product();
    };
    /* --------------------------------------------------------------------
        OPERATORS
    -------------------------------------------------------------------- */
    Wrapper.prototype.tryInsert = function (product) {
        var volume = 0;
        var weight = 0;
        for (var i = 0; i < this.length; i++) {
            volume += this[i].getVolume();
            weight += this[i].getWeight();
        }
        if (product.getVolume() + volume > this.volume ||
            product.getWeight() + weight > this.weight) {
            return false;
        }
        this.push(product);
        return true;
    };
    /* --------------------------------------------------------------------
        GETTERS
    -------------------------------------------------------------------- */
    Wrapper.prototype.getName = function () {
        return this.name;
    };
    Wrapper.prototype.getPrice = function () {
        return this.price;
    };
    Wrapper.prototype.getVolume = function () {
        return this.volume;
    };
    Wrapper.prototype.getWeight = function () {
        return this.weight;
    };
    /* --------------------------------------------------------------------
        EXPORTERS
    -------------------------------------------------------------------- */
    Wrapper.prototype.TAG = function () {
        return "wrapper";
    };
    Wrapper.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("name", this.name);
        xml.setProperty("price", this.price);
        xml.setProperty("volume", this.volume);
        xml.setProperty("weight", this.weight);
        return xml;
    };
    return Wrapper;
})(ProductArray);
var WrapperArray = (function (_super) {
    __extends(WrapperArray, _super);
    /* --------------------------------------------------------------------
        CONSTRUCTORS
    -------------------------------------------------------------------- */
    /**
     * <p> Construct from a sample wrapper. </p>
     *
     * @param sample A sample wrapper used to copy wrappers.
     */
    function WrapperArray(sample) {
        if (sample === void 0) { sample = null; }
        _super.call(this);
        this.sample = sample;
        this.reserved = new Vector();
    }
    WrapperArray.prototype.construct = function (xml) {
        _super.prototype.construct.call(this, xml);
        this.sample = new Wrapper();
        this.sample.construct(xml);
    };
    WrapperArray.prototype.createChild = function (xml) {
        return new Wrapper();
    };
    /* --------------------------------------------------------------------
        OPERATORS
    -------------------------------------------------------------------- */
    /**
     * <p> Try to insert a product into reserved list. </p>
     *
     * <p> If the Product's volume and weight is equal or less than the Wrapper categorized so that enable to
     * insert in a Wrapper, reserve the Product and returns <i>true</i>. If not, does not reserve and just
     * return <i>false</i>. </p>
     *
     * @return Whether the Product's volume and weight is equal or less than the Wrapper.
     */
    WrapperArray.prototype.tryInsert = function (product) {
        if (product.getVolume() > this.sample.getVolume() ||
            product.getWeight() > this.sample.getWeight()) {
            return false;
        }
        this.reserved.push(product);
        return true;
    };
    /**
     * <p> Optimize to retrieve the best solution. </p>
     *
     * <p> Retrieves the best solution of packaging in level of WrapperArray. </p>
     * <p> Shuffles sequence of reserved Product(s) by samchon::library::FactorialGenerator and insert the reserved
     * Products(s) following the sequence creating Wrapper(s) as needed. Between the sequences from FactorialGenerator,
     * retrieve and determine the best solution. </p>
     *
     * <h4> Note. </h4>
     * <p> Sequence of inserting Product can affeact to numbers of Wrapper(s) to be used. </p>
     * <p> It's the reason why even WrapperArray has the optimize() method. </p>
     */
    WrapperArray.prototype.optimize = function () {
        if (this.reserved.length == 0)
            return;
        var factorial = new FactorialGenerator(this.reserved.length);
        var minWrapperArray;
        for (var i = 0; i < factorial.size(); i++) {
            var wrapperArray = new WrapperArray(this.sample);
            var row = factorial.at(i);
            for (var j = 0; j < row.length; j++) {
                var product = this.reserved[row[j]];
                if (wrapperArray.length == 0 ||
                    wrapperArray[wrapperArray.length - 1].tryInsert(product) == false) {
                    var wrapper = new Wrapper(this.sample);
                    wrapper.tryInsert(product);
                    wrapperArray.push(wrapper);
                }
            }
            if (minWrapperArray == null ||
                wrapperArray.calcPrice() < minWrapperArray.calcPrice()) {
                minWrapperArray = wrapperArray;
            }
        }
        //REPLACE TO MIN_WRAPPER_ARRAY
        this.splice(0, this.length);
        for (var i = 0; i < minWrapperArray.length; i++)
            this.push(minWrapperArray[i]);
    };
    /* --------------------------------------------------------------------
        GETTERS
    -------------------------------------------------------------------- */
    /**
     * <p> Calculate price of the Wrapper(s). </p>
     *
     * <p> Calculates price of all wrappers'. The price does not contain inserted products'. </p>
     */
    WrapperArray.prototype.calcPrice = function () {
        return this.sample.getPrice() * this.length;
    };
    /**
     * <p> Get sample. </p>
     */
    WrapperArray.prototype.getSample = function () {
        return this.sample;
    };
    /* --------------------------------------------------------------------
        EXPORTERS
    -------------------------------------------------------------------- */
    WrapperArray.prototype.TAG = function () {
        return "wrapperArray";
    };
    WrapperArray.prototype.CHILD_TAG = function () {
        return "wrapper";
    };
    WrapperArray.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.addAllProperties(this.sample.toXML());
        return xml;
    };
    return WrapperArray;
})(EntityArray);
/**
 * <p> A packer planning the best packaging. </p>
 * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
 *
 * <h4> Warning. </h4>
 * <p> Be careful about number of products and wrappers. </p>
 * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously.
 * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
 *
 * @author Jeongho Nam
 */
var Packer = (function (_super) {
    __extends(Packer, _super);
    /* --------------------------------------------------------------------
        CONSTRUCTORS
    -------------------------------------------------------------------- */
    /**
     * <p> Construct from an argument. </p>
     */
    function Packer(obj) {
        if (obj === void 0) { obj = null; }
        _super.call(this);
        if (obj == null) {
            this.productArray = new ProductArray();
            return;
        }
        if (obj instanceof ProductArray) {
            this.productArray = obj;
        }
        else if (obj instanceof Packer) {
            var packer = obj;
            this.productArray = packer.productArray;
            for (var i = 0; i < packer.length; i++)
                this.push(new WrapperArray(packer[i].getSample()));
        }
        else
            throw "invalid argument";
    }
    Packer.prototype.construct = function (xml) {
        _super.prototype.construct.call(this, xml);
        this.productArray.construct(xml.get(this.productArray.TAG())[0]);
    };
    Packer.prototype.createChild = function (xml) {
        return new WrapperArray();
    };
    /* --------------------------------------------------------------------
        CALCULATORS
    -------------------------------------------------------------------- */
    /**
     * <p> Find the best packaging method. </p>
     */
    Packer.prototype.optimize = function (start, size) {
        if (start === void 0) { start = 0; }
        if (size === void 0) { size = -1; }
        if (this.length == 0 || this.productArray.length == 0)
            return;
        var caseGenerator = new CombinedPermutationGenerator(this.length, this.productArray.length);
        var minPacker = null;
        //ADJUST END INDEX
        if (size == -1 || start + size > caseGenerator.size())
            size = caseGenerator.size() - start;
        //FIND THE BEST SOLUTION
        for (var i = start; i < start + size; i++) {
            var packer = new Packer(this);
            var row = caseGenerator.at(i);
            var validity = true;
            for (var j = 0; j < row.length; j++) {
                var product = this.productArray[j];
                var wrapperArray = packer[row[j]];
                if (wrapperArray.tryInsert(product) == false) {
                    validity = false;
                    break;
                }
            }
            if (validity == false)
                continue;
            //OPTIMIZE ALL WRAPPERS IN A PACKER
            for (var j = 0; j < packer.length; j++)
                packer[j].optimize();
            if (minPacker == null || packer.calcPrice() < minPacker.calcPrice())
                minPacker = packer;
        }
        //REPLACE TO MIN_PACKER
        this.splice(0, this.length);
        for (var i = 0; i < minPacker.length; i++)
            this.push(minPacker[i]);
    };
    /**
     * <p> Calculate price of the wrappers. </p>
     */
    Packer.prototype.calcPrice = function () {
        var price = 0;
        for (var i = 0; i < this.length; i++)
            price += this[i].calcPrice();
        return price;
    };
    /* --------------------------------------------------------------------
        EXPORTERS
    -------------------------------------------------------------------- */
    Packer.prototype.TAG = function () {
        return "packer";
    };
    Packer.prototype.CHILD_TAG = function () {
        return "wrapperArray";
    };
    Packer.prototype.toXML = function () {
        var xml = _super.prototype.toXML.call(this);
        xml.setProperty("price", this.calcPrice());
        var xmlList = new XMLList();
        xmlList.push(this.productArray.toXML());
        xml.set(this.productArray.TAG(), xmlList);
        return xml;
    };
    return Packer;
})(EntityArray);
/**
 * <p> A slave system for solving packer. </p>
 *
 * @inheritDoc
 * @author Jeongho Nam
 */
var PackerSlaveSystem = (function (_super) {
    __extends(PackerSlaveSystem, _super);
    /**
     * <p> Construct from ip and port of the master. </p>
     */
    function PackerSlaveSystem(ip, port) {
        _super.call(this);
        this.ip = ip;
        this.port = port;
    }
    /**
     * <p> Optimize for find packing solution with segmentation index. </p>
     *
     * @param xml XML object represents metadata of products and wrappers.
     * @param start Start index of cases.
     * @param size Size of cases to retrieve.
     */
    PackerSlaveSystem.prototype.optimize = function (xml, start, size) {
        var packer = new Packer();
        packer.construct(xml);
        packer.optimize(start, size);
        trace("optimize number of " + size + " cases from #" + start);
        trace(packer.toXML().toHTML());
        this.sendData(new Invoke("replyOptimization", packer));
    };
    return PackerSlaveSystem;
})(SlaveSystem);
//# sourceMappingURL=SamchonFramework.js.map