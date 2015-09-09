var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function test() {
    var str = "<memberList>\n" +
        "   <member id='jhnam88' pass='1231' />\n" +
        "   <member id='samchon' pass='1231'>Administrator</member>\n" +
        "   <group>3</group>\n" +
        "</memberList>";
    var xml = new XML(str);
    var invoke = new Invoke("login", "jhnam88", 4, xml);
    alert(invoke.toXML().toString());
}
/**
 * @brief Trace arguments on screen
 *
 * @author Jeongho Nam
 */
function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i];
    }
    var str = "";
    for (var i = 0; i < args.length; i++)
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
 * @brief A pair of values
 *
 * @details
 * This class couples together a pair of values, which may be of different types (_Ty1 and _Ty2).
 * The individual values can be accessed through its public members first and second.
 *
 * @tparam _Ty1 Type of member fisrt
 * @tparam _Ty2 Type of member second
 *
 * @note Same with std::pair (http://www.cplusplus.com/reference/utility/pair/)
 * @author Jeongho Nam
 */
var Pair = (function () {
    /**
     * @brief Construct from pair values
     *
     * @param first The first value of the Pair
     * @param second The second value of the Pair
     */
    function Pair(first, second) {
        this.first = first;
        this.second = second;
    }
    /**
     * @brief Whether a Pair is equal with the Pair.
     *
     * @details
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
     * @brief Returns a string representation of the Map.
     *
     * @details
     * <p> The returned string will follow the form of JSonObject </p>
     *  \li {"first": "???", "second": ???}
     */
    Pair.prototype.toString = function () {
        return "{first: " + this.first + ", second: " + this.second + "}";
    };
    return Pair;
})();
/**
 * @brief Vector, the dynamic array
 *
 * @details
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
     * @brief Default Constructor
     */
    function Vector() {
    }
    /* ------------------------------------------------------------------------
        MODIFIERS
    ------------------------------------------------------------------------ */
    /**
     * @brief Appends new elements to an array, and returns the new length of the array.
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
     * @brief Removes the last element from an array and returns it.
     */
    Vector.prototype.pop = function () { return null; };
    /**
     * @biref Combines two or more arrays.
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
     * @brief Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
     */
    Vector.prototype.join = function (separator) { return ""; };
    /**
     * @brief Reverses the elements in an Array.
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
     * Sorts an array.
     * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    Vector.prototype.sort = function (compareFn) { return []; };
    /**
     * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
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
     * @param items  Elements to insert at the start of the Array.
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
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
     */
    Vector.prototype.indexOf = function (searchElement, fromIndex) { return 0; };
    /**
     * Returns the index of the last occurrence of a specified value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
     */
    Vector.prototype.lastIndexOf = function (searchElement, fromIndex) { return 0; };
    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.every = function (callbackfn, thisArg) { return false; };
    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.some = function (callbackfn, thisArg) { return false; };
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.forEach = function (callbackfn, thisArg) { };
    /**
     * Calls a defined callback function on each element of an array, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.map = function (callbackfn, thisArg) { return []; };
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    Vector.prototype.filter = function (callbackfn, thisArg) { return []; };
    /**
     * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    Vector.prototype.reduce = function (callbackfn, initialValue) { return null; };
    /**
     * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
     */
    Vector.prototype.reduceRight = function (callbackfn, initialValue) { return null; };
    /* ------------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------------ */
    /**
     * @brief Returns a string representation of an array.
     */
    Vector.prototype.toString = function () { return ""; };
    Vector.prototype.toLocaleString = function () { return ""; };
    return Vector;
})();
Vector.prototype = new Array();
/**
 * @brief A map containing pairs of key and value
 *
 * @details
 * <p> Map is designed to pursuing formality in JavaScript. </p>
 *
 * \par Definition of std::unordered_map
 *  \li Reference: http://www.cplusplus.com/reference/unordered_map/unordered_map/
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
 * \par Differences between std::unordered_map
 * <ul>
 *  <li> Addicted Methods </li>
 *  <ul>
 *      <li> has := { find(key) != end(); } </li>
 *      <li> set := { insert({key, value}); } </li>
 *      <li> get := { find(key).second; } </li>
 *  </ul>
 *  <li> Depreciated Methods </li>
 *  <ul>
 *      <li> Modifier methods using iterators </li>
 *      <li> operator[] </li>
 *  </ul>
 * </ul>
 *
 * @note
 * <p> Do not use operator[] and hasOwnProperty(). Use get() and has() instead. </p>
 * <p> Do not iterate by <i>for statement</i> used for dynamic object of JavaScript; <i>for(var key in Map)</i> </p>.
 * <p> Use <i>iterator</i> with begin() and end() instaed. </p>
 *
 * @author Jeongho Nam
 */
var Map = (function () {
    /**
     * @brief Default Constructor
     */
    function Map() {
        this.data_ = new Vector();
    }
    /* ---------------------------------------------------------
        GETTERS
    --------------------------------------------------------- */
    /**
     * @brief Get data
     * @details Returns the source container of the Map.
     *
     * @note Changes on the returned container influences the source Map.
     */
    Map.prototype.data = function () {
        return this.data_;
    };
    /**
     * @brief Return container size
     * @details Returns the number of elements in Map container.
     *
     * @return The number of elements in the container.
     */
    Map.prototype.size = function () {
        return this.data_.length;
    };
    /**
     * @brief Whether have the item or not
     * @details Indicates whether a map has an item having the specified identifier.
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
     * @brief Get element
     * @details Returns a reference to the mapped value of the element identified with key.
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
     * @brief Return iterator to beginning
     *
     * @details Returns an iterator referring the first element in the Map container.
     * @note If the container is empty, the returned iterator is same with end().
     *
     * @return
     * <p> An iterator to the first element in the container. </p>
     * <p> The iterator containes the first element's pair; key and value. </p>
     */
    Map.prototype.begin = function () {
        if (this.size() == 0)
            return this.end();
        return new MapIterator(this, 0);
    };
    /**
     * @brief Return iterator to end
     *
     * @details
     * <p> Returns an iterator referring to the past-the-end element in the Map container. </p>
     *
     * <p> The past-the-end element is the theoretical element that would follow the last element in
     * the Map container. It does not point to any element, and thus shall not be dereferenced. </p>
     *
     * <p> Because the ranges used by functions of the Map do not include the element reference
     * by their closing iterator, this function is often used in combination with Map::begin() to specify
     * a range including all the elements in the container. </p>
     *
     * @note
     * <p> Returned iterator from Map.end() does not refer any element. Trying to accessing
     * element by the iterator will cause throwing exception (out of range). </p>
     * <p> If the container is empty, this function returns the same as Map::begin(). </p>
     */
    Map.prototype.end = function () {
        return new MapIterator(this, -1);
    };
    /* ---------------------------------------------------------
        MODIFIERS
    --------------------------------------------------------- */
    /**
     * @brief Set element
     *
     * @details
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
     * @brief Erase an element.
     * @details Removes an element by its key(identifier) from the Map container.
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
     * @brief Clear content.
     *
     * @details
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
     * @brief Whether a Map is equal with the Map.
     *
     * @details
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
     * @brief Returns a string representation of the Map.
     *
     * @details
     * <p> The returned string will follow the form of JSonObject </p>
     *  \li {{"key": "???", "value": ???}, {"key": "?", "value": ?}, ...}
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
var MapIterator = (function () {
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
        get: function () {
            return this.map.data()[this.index].first;
        },
        set: function (key) {
            this.map.data()[this.index].first = key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapIterator.prototype, "second", {
        get: function () {
            return this.map.data()[this.index].second;
        },
        set: function (val) {
            this.map.data()[this.index].second = val;
        },
        enumerable: true,
        configurable: true
    });
    /* ---------------------------------------------------------
        COMPARISON
    --------------------------------------------------------- */
    MapIterator.prototype.equals = function (it) {
        return (this.map == it.map && this.index == it.index);
    };
    /* ---------------------------------------------------------
        MOVERS
    --------------------------------------------------------- */
    MapIterator.prototype.prev = function () {
        if (this.index - 1 < 0)
            return this.map.end();
        else
            return new MapIterator(this.map, this.index - 1);
    };
    MapIterator.prototype.next = function () {
        if (this.index + 1 >= this.map.size())
            return this.map.end();
        else
            return new MapIterator(this.map, this.index + 1);
    };
    return MapIterator;
})();
/**
 * @brief A dictionary
 *
 * @author Jeongho Nam
 */
var Dictionary = (function (_super) {
    __extends(Dictionary, _super);
    /**
     * @brief Default Constructor
     */
    function Dictionary() {
        _super.call(this);
    }
    return Dictionary;
})(Map);
/**
 * @brief A utility class supports static method of string
 *
 * @author Jeongho Nam
 */
var StringUtil = (function () {
    function StringUtil() {
    }
    /**
     * @brief Get a tabbed string by specified size
     */
    StringUtil.tab = function (size) {
        var str = "";
        for (var i = 0; i < size; i++)
            str += "\t";
        return str;
    };
    /**
     * @brief Replace all patterns of a string
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
 * @brief XML
 *
 * @author Jeongho Nam
 */
var XML = (function (_super) {
    __extends(XML, _super);
    /* -------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------- */
    /**
     * @brief Default Constructor.
     */
    function XML(str) {
        if (str === void 0) { str = ""; }
        _super.call(this);
        this.properties = new Dictionary();
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
    XML.prototype.construct = function (str) {
        this.constructTag(str);
        this.constructProperty(str);
        var res = this.constructValue(str);
        if (res.second == true)
            this.constructChildren(res.first);
    };
    XML.prototype.constructTag = function (str) {
        var start = str.indexOf("<") + 1;
        var end = this.calcMinIndex(str.indexOf(" ", start), str.indexOf("\r\n", start), str.indexOf("\n", start), str.indexOf("\t", start), str.indexOf(">", start), str.indexOf("/", start));
        if (start == 0 || end == -1)
            return;
        this.tag = str.substring(start, end);
    };
    XML.prototype.constructProperty = function (str) {
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
            this.setProperty(label, this.decodeProperty(value));
        }
    };
    XML.prototype.constructValue = function (str) {
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
            this.value = this.decodeValue(str.trim());
        else
            this.value = "";
        return new Pair(str, true);
    };
    XML.prototype.constructChildren = function (str) {
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
    XML.prototype.getTag = function () {
        return this.tag;
    };
    XML.prototype.getValue = function () {
        return this.value;
    };
    XML.prototype.hasProperty = function (key) {
        return this.properties.has(key);
    };
    XML.prototype.getProperty = function (key) {
        return this.properties.get(key);
    };
    /* -------------------------------------------------------------
        SETTERS
    ------------------------------------------------------------- */
    XML.prototype.setTag = function (str) {
        this.tag = str;
    };
    XML.prototype.setValue = function (str) {
        this.value = str;
    };
    XML.prototype.setProperty = function (key, value) {
        this.properties.set(key, value);
    };
    XML.prototype.eraseProperty = function (key) {
        this.properties.erase(key);
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
    XML.prototype.decodeValue = function (str) {
        var pairs = [
            new Pair("&amp;", "&"),
            new Pair("&lt;", "<"),
            new Pair("&gt;", ">")
        ];
        return StringUtil.replaceAll(str, pairs);
    };
    XML.prototype.encodeValue = function (str) {
        var pairs = [
            new Pair("&", "&amp;"),
            new Pair("<", "&lt;"),
            new Pair(">", "&gt;")
        ];
        return StringUtil.replaceAll(str, pairs);
    };
    XML.prototype.decodeProperty = function (str) {
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
    XML.prototype.encodeProperty = function (str) {
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
     * @brief Convert the XML to a String
     */
    XML.prototype.toString = function (level) {
        if (level === void 0) { level = 0; }
        var str = StringUtil.tab(level) + "<" + this.tag;
        var childrenString = "";
        //PROPERTIES
        for (var p_it = this.properties.begin(); p_it.equals(this.properties.end()) == false; p_it = p_it.next())
            str += " " + p_it.first + "=\"" + this.encodeProperty(p_it.second) + "\"";
        if (this.size() == 0) {
            if (this.value != "")
                str += ">" + this.value + "</" + this.tag + ">";
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
    return XML;
})(Dictionary);
/**
 * @brief List of XML(s) having same tag
 *
 * @author Jeongho Nam
 */
var XMLList = (function (_super) {
    __extends(XMLList, _super);
    /**
     * @brief Default Constructor.
     */
    function XMLList() {
        _super.call(this);
    }
    /**
     * @brief Convert XMLList to String
     *
     * @param level Level(depth) of the XMLList
     */
    XMLList.prototype.toString = function (level) {
        if (level === void 0) { level = 0; }
        var str = "";
        for (var i = 0; i < this.length; i++)
            str += this[i].toString(level) + "\n";
        return str;
    };
    return XMLList;
})(Vector);
/**
 * @brief A server connector
 *
 * @author Jeongho Nam
 */
var ServerConnector = (function () {
    function ServerConnector(parent) {
        this.parent = parent;
        this.str = "";
    }
    ServerConnector.prototype.connect = function (ip, port) {
        this.socket = new WebSocket(ip + ":" + port);
        this.socket.onopen = this.handleConnect;
        this.socket.onmessage = this.handleReply;
    };
    /* ----------------------------------------------------
        IPROTOCOL'S METHOD
    ---------------------------------------------------- */
    ServerConnector.prototype.sendData = function (invoke) {
        var xml = invoke.toXML();
        var str = xml.toString();
        this.socket.send(str);
    };
    ServerConnector.prototype.replyData = function (invoke) {
        this.parent.replyData(invoke);
    };
    /* ----------------------------------------------------
        HANDLING CONNECTION AND MESSAGES
    ---------------------------------------------------- */
    ServerConnector.prototype.handleConnect = function (event) {
        this.onopen.apply([event]);
    };
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
 * @brief Standard network I/O message
 *
 * @author Jeongho Nam
 */
var Invoke = (function (_super) {
    __extends(Invoke, _super);
    /**
     * @brief Multiple Constructors
     *
     * \par Construct from listener
     *
     *  \li listener: String => A string represents name of function
     *
     * \par Construct from XML
     *
     *  \li xml: A XML instance representing Invoke
     *
     * \par Construct from arguments
     *
     *  \li listener: String =>
     *  \li value: _Ty =>
     *  \li arguments: ... Tytes =>
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
                this.listener = xml.getProperty("listener");
                if (xml.has("parameter") == false)
                    return;
                var xmlList = xml.get("parameter");
                for (var i = 0; i < xmlList.length; i++)
                    this.push(new InvokeParameter(xmlList[i]));
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
    /* -------------------------------------------------------------------
        GETTERS
    ------------------------------------------------------------------- */
    Invoke.prototype.getListener = function () {
        return this.listener;
    };
    Invoke.prototype.get = function (key) {
        for (var i = 0; i < this.length; i++)
            if (this[i].getName() == key)
                return this[i];
        return null;
    };
    Invoke.prototype.getArguments = function () {
        var args = [];
        for (var i = 0; i < this.length; i++)
            args.push(this[i].getValue());
        return args;
    };
    /* -------------------------------------------------------------------
       APPLY BY FUNCTION POINTER
   ------------------------------------------------------------------- */
    Invoke.prototype.apply = function (obj) {
        if (!(obj.hasOwnProperty(this.listener) == true && obj[this.listener] instanceof Function))
            return false;
        var func = obj[this.listener];
        var args = this.getArguments();
        func.apply(args);
        return true;
    };
    /* -------------------------------------------------------------------
       EXPORTER
   ------------------------------------------------------------------- */
    Invoke.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag("invoke");
        xml.setProperty("listener", this.listener);
        var xmlList = new XMLList();
        for (var i = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());
        xml.set("parameter", xmlList);
        return xml;
    };
    return Invoke;
})(Vector);
var InvokeParameter = (function () {
    /**
     * @brief Multiple Constructors
     *
     * \par Construct from XML.
     *
     *  \li xml: XML => A XML instance representing InvokeParameter.
     *
     * \par Construct from value.
     *
     *  \li value: _Ty => Value belonged to the parameter.
     *
     * \par Construct from specified type and value.
     *
     *  \li type: String => Type of the parameter.
     *  \li value: _Ty => Value belonged to the parameter.
     */
    function InvokeParameter() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length == 1 && args[0] instanceof XML) {
            var xml = args[0];
            this.name = xml.hasProperty("name") ? xml.getProperty("name") : "";
            this.type = xml.getProperty("type");
            if (this.type == "XML")
                this.value = xml.begin().second[0];
            else
                this.value = xml.getValue();
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
    /**
     * @brief Get name
     */
    InvokeParameter.prototype.getName = function () {
        return this.name;
    };
    /**
     * @brief Get type
     */
    InvokeParameter.prototype.getType = function () {
        return this.type;
    };
    /**
     * @brief Get value
     */
    InvokeParameter.prototype.getValue = function () {
        return this.value;
    };
    /**
     * @brief Convert the parameter to XML.
     *
     * @return A XML object represents the parameter.
     */
    InvokeParameter.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag("parameter");
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
})();
/**
 * @brief An application
 *
 * THE CONSTRUCTION ROUTINE
 * <ul>
 * 	<li>Socket Connection</li>
 * 	<ul>
 * 	    <li>Connect to the CPP-Server</li>
 * 	</ul>
 * 	<li>Fetch authority</li>
 * 	<ul>
 * 	    <li>Send a request to fetching authority</li>
 * 	    <li>The window can be navigated to other page by the authority</li>
 * 	</ul>
 * 	<li>Construct Movie</li>
 * 	<ul>
 * 	    <li>Determine a Movie by URLVariables::movie and construct it</li>
 * 	</ul>
 * 	<li>All the routines are done</li>
 * </ul>
 *
 */
var Application = (function () {
    function Application(movie, ip, port) {
        this.movie = movie;
        this.socket = new ServerConnector(this);
        this.socket.onopen = this.handleConnect;
        this.socket.connect(ip, port);
    }
    Application.prototype.handleConnect = function (event) {
    };
    Application.prototype.replyData = function (invoke) {
        if (invoke.apply(this) == false)
            this.movie.sendData(invoke);
    };
    Application.prototype.sendData = function (invoke) {
        this.socket.sendData(invoke);
    };
    return Application;
})();
/**
 * @brief A movie belonged to an Application
 */
var Movie = (function () {
    function Movie() {
    }
    Movie.prototype.replyData = function (invoke) {
        invoke.apply(this) == false;
    };
    Movie.prototype.sendData = function (invoke) {
        this.application.sendData(invoke);
    };
    return Movie;
})();
/**
 * @brief A sub-movie
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
var Entity = (function () {
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
var EntityArray = (function (_super) {
    __extends(EntityArray, _super);
    function EntityArray() {
        _super.call(this);
    }
    EntityArray.prototype.construct = function (xml) {
        this.splice(0, this.length);
        if (xml.hasOwnProperty(this.CHILD_TAG()) == false)
            return;
        var xmlList = xml[this.CHILD_TAG()];
        for (var i = 0; i < xmlList.length; i++) {
            var child = this.createChild(xmlList[i]);
            if (child != null)
                this.push(child);
        }
    };
    EntityArray.prototype.createChild = function (xml) {
        return null;
    };
    EntityArray.prototype.TAG = function () { return ""; };
    EntityArray.prototype.CHILD_TAG = function () { return ""; };
    EntityArray.prototype.key = function () { return ""; };
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
//# sourceMappingURL=SamchonFramework.js.map