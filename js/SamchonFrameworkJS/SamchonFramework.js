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
        "</memberList>";
    var xml = new XML(str);
    alert(xml.toString());
}
function trace(str) {
    document.write(str + "<br>\n");
}
/* =================================================================================
    LIBRARIES
====================================================================================
    * CONTAINERS
        - VECTOR
        - DICTIONARY
        - PAIR
    
    * UTILITIES
        - STRING_UTIL
        - XML
================================================================================= */
/**
 * @brief Vector, the dynamic array
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
    Vector.prototype.pop = function () {
        return null;
    };
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
    Vector.prototype.join = function (separator) {
        return "";
    };
    /**
     * @brief Reverses the elements in an Array.
     */
    Vector.prototype.reverse = function () {
        return [];
    };
    /**
      * Removes the first element from an array and returns it.
      */
    Vector.prototype.shift = function () {
        return null;
    };
    /**
      * Returns a section of an array.
      * @param start The beginning of the specified portion of the array.
      * @param end The end of the specified portion of the array.
      */
    Vector.prototype.slice = function (start, end) {
        return [];
    };
    /**
      * Sorts an array.
      * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
      */
    Vector.prototype.sort = function (compareFn) {
        return [];
    };
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
    Vector.prototype.indexOf = function (searchElement, fromIndex) {
        return 0;
    };
    /**
      * Returns the index of the last occurrence of a specified value in an array.
      * @param searchElement The value to locate in the array.
      * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
      */
    Vector.prototype.lastIndexOf = function (searchElement, fromIndex) {
        return 0;
    };
    /**
      * Determines whether all the members of an array satisfy the specified test.
      * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    Vector.prototype.every = function (callbackfn, thisArg) {
        return false;
    };
    /**
      * Determines whether the specified callback function returns true for any element of an array.
      * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    Vector.prototype.some = function (callbackfn, thisArg) {
        return false;
    };
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
    Vector.prototype.map = function (callbackfn, thisArg) {
        return [];
    };
    /**
      * Returns the elements of an array that meet the condition specified in a callback function.
      * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    Vector.prototype.filter = function (callbackfn, thisArg) {
        return [];
    };
    /**
      * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
      * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
      * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
      */
    Vector.prototype.reduce = function (callbackfn, initialValue) {
        return null;
    };
    /**
      * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
      * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
      * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
      */
    Vector.prototype.reduceRight = function (callbackfn, initialValue) {
        return null;
    };
    /* ------------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------------ */
    /**
      * @brief Returns a string representation of an array.
      */
    Vector.prototype.toString = function () {
        return "";
    };
    Vector.prototype.toLocaleString = function () {
        return "";
    };
    return Vector;
})();
Vector.prototype = new Array();
/**
 * @brief Dictionary, a Map of string key
 *
 * @author Jeongho Nam
 */
var Dictionary = (function () {
    function Dictionary() {
        this.data_ = new Object();
        this.size_ = 0;
    }
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    Dictionary.prototype.data = function () { return this.data_; };
    Dictionary.prototype.size = function () { return this.size_; };
    Dictionary.prototype.has = function (key) {
        return this.data_.hasOwnProperty(key);
    };
    Dictionary.prototype.get = function (key) {
        return this.data_[key];
    };
    Dictionary.prototype.getKeys = function () {
        var keys = [];
        for (var key in this.data_)
            keys.push(key);
        return keys;
    };
    /* ---------------------------------------------------------
        MODIFIERS
    --------------------------------------------------------- */
    Dictionary.prototype.set = function (key, value) {
        if (this.has(key) == false)
            this.size_++;
        this.data_[key] = value;
    };
    Dictionary.prototype.erase = function (key) {
        if (this.has(key) == false)
            return;
        this.size_--;
        delete this.data_[key];
    };
    Dictionary.prototype.clear = function () {
        this.data_ = new Object();
        this.size_ = 0;
    };
    return Dictionary;
})();
/**
 * @brief A pair
 *
 * @author Jeongho Nam
 */
var Pair = (function () {
    function Pair(first, second) {
        this.first = first;
        this.second = second;
    }
    return Pair;
})();
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
            if (args[i] < min)
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
        var propertiesKeys = this.properties.getKeys();
        for (var i = 0; i < propertiesKeys.length; i++) {
            var key = propertiesKeys[i];
            var value = this.properties.get(key);
            str += " " + key + "=\"" + this.encodeProperty(value) + "\"";
        }
        if (this.size() == 0) {
            if (this.value != "")
                str += ">" + this.value + "</" + this.tag + ">";
            else
                str += " />";
        }
        else {
            str += ">\n";
            var keys = this.getKeys();
            for (var i = 0; i < keys.length; i++)
                str += this.get(keys[i]).toString(level + 1);
            str += StringUtil.tab(level) + "</" + this.tag + ">";
        }
        return str;
    };
    return XML;
})(Dictionary);
/**
 * @brief List of XML(s) with same tag
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
    function Invoke() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this);
        if (args.length == 1) {
            var val = args[0];
            if (val instanceof String)
                this.listener = val;
            else if (val instanceof XML) {
                var xml = val;
                this.listener = xml["@listener"];
                if (xml.hasOwnProperty("parameter") == false)
                    return;
                var xmlList = xml["parameter"];
                for (var i = 0; i < xmlList.length; i++)
                    this.push(new InvokeParameter(xmlList[i]));
            }
        }
        else {
            this.listener = args[0];
            for (var i = 1; i < args.length; i++) {
                var name = "par" + i;
                var value = args[i];
                var parameter = new InvokeParameter(name, value);
                this.push(parameter);
            }
        }
    }
    Invoke.prototype.getListener = function () {
        return this.listener;
    };
    Invoke.prototype.getArguments = function () {
        var args = new Array();
        for (var i = 0; i < this.length; i++)
            args[i] = this[i].getValue();
        return args;
    };
    Invoke.prototype.apply = function (obj) {
        if (!(obj.hasOwnProperty(this.listener) == true &&
            obj[this.listener] instanceof Function))
            return false;
        var func = obj[this.listener];
        func.apply(this.getArguments());
        return true;
    };
    Invoke.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag("invoke");
        xml["@listener"] = this.listener;
        var xmlList = new XMLList();
        for (var i = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());
        xml["parameter"] = xmlList;
        return xml;
    };
    return Invoke;
})(Vector);
var InvokeParameter = (function () {
    function InvokeParameter() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length == 1 && args[0] instanceof XML) {
            var xml = args[0];
            this.name = xml["@name"];
            this.type = xml["@type"];
            this.value = xml["@value"];
        }
        else if (args.length == 3) {
            this.name = args[0];
            this.type = args[1];
            this.value = args[2];
        }
        else if (args.length == 2) {
            this.name = args[0];
            this.value = args[1];
            if (args[1] instanceof Number)
                this.type = "number";
            else if (args[1] instanceof String)
                this.type = "string";
            else
                this.type = "unknown";
        }
    }
    InvokeParameter.prototype.getName = function () {
        return this.name;
    };
    InvokeParameter.prototype.getType = function () {
        return this.type;
    };
    InvokeParameter.prototype.getValue = function () {
        return this.value;
    };
    InvokeParameter.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag("parameter");
        xml["@name"] = this.name;
        xml["@type"] = this.type;
        xml["@value"] = this.value;
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
    function Application(ip, port) {
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
    }
    Entity.prototype.construct = function (xml) { };
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
        return xml;
    };
    return EntityArray;
})(Vector);
//# sourceMappingURL=SamchonFramework.js.map