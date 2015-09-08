function test() {
    var str: string =
        "<memberList>\n" +
        "   <member id='jhnam88' pass='1231' />\n" +
        "   <member id='samchon' pass='1231'>Administrator</member>\n" +
        "</memberList>";

    var xml: XML = new XML(str);
    alert( xml.toString() );
}
function trace(str: any): void {
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
class Vector<T> implements Array<T>
{
    [n: number]: T;

    /**
     * @brief Default Constructor
     */
    constructor()
    {

    }

    /* ------------------------------------------------------------------------
        ACCESSORS
    ------------------------------------------------------------------------ */
    /**
     * @brief Gets or sets the length of the array. 
     * @details This is a number one higher than the highest element defined in an array.
     */
    length: number;
    
    /* ------------------------------------------------------------------------
        MODIFIERS
    ------------------------------------------------------------------------ */
    /**
     * @brief Appends new elements to an array, and returns the new length of the array.
     *
     * @param items New elements of the Array.
     * @return New length of the array.
     */
    push(...items: T[]): number {
        return 0;
    }
    
    /**
     * @brief Removes the last element from an array and returns it.
     */
    pop(): T {
        return null;
    }
    
    /**
      * @biref Combines two or more arrays.
      * @param items Additional items to add to the end of array1.
      */
    concat(...items: T[]): T[] {
        return [];
    }

    /**
      * @brief Adds all the elements of an array separated by the specified separator string.
      * @param separator A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
      */
    join(separator?: string): string {
        return "";
    }
    
    /**
     * @brief Reverses the elements in an Array. 
     */
    reverse(): T[] {
        return [];
    }

    /**
      * Removes the first element from an array and returns it.
      */
    shift(): T {
        return null;
    }

    /** 
      * Returns a section of an array.
      * @param start The beginning of the specified portion of the array.
      * @param end The end of the specified portion of the array.
      */
    slice(start?: number, end?: number): T[] {
        return [];
    }

    /**
      * Sorts an array.
      * @param compareFn The name of the function used to determine the order of the elements. If omitted, the elements are sorted in ascending, ASCII character order.
      */
    sort(compareFn?: (a: T, b: T) => number): T[] {
        return [];
    }
    
    /**
      * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
      * @param start The zero-based location in the array from which to start removing elements.
      * @param deleteCount The number of elements to remove.
      * @param items Elements to insert into the array in place of the deleted elements.
      */
    splice(start: number, deleteCount: number = 1, ...items: T[]): T[] {
        return [];
    }

    /**
      * Inserts new elements at the start of an array.
      * @param items  Elements to insert at the start of the Array.
      */
    unshift(...items: T[]): number {
        return 0;
    }

    /**
      * Returns the index of the first occurrence of a value in an array.
      * @param searchElement The value to locate in the array.
      * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
      */
    indexOf(searchElement: T, fromIndex?: number): number {
        return 0;
    }

    /**
      * Returns the index of the last occurrence of a specified value in an array.
      * @param searchElement The value to locate in the array.
      * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
      */
    lastIndexOf(searchElement: T, fromIndex?: number): number {
        return 0;
    }

    /**
      * Determines whether all the members of an array satisfy the specified test.
      * @param callbackfn A function that accepts up to three arguments. The every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
        return false;
    }

    /**
      * Determines whether the specified callback function returns true for any element of an array.
      * @param callbackfn A function that accepts up to three arguments. The some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
        return false;
    }

    /**
      * Performs the specified action for each element in an array.
      * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. 
      * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void { }

    /**
      * Calls a defined callback function on each element of an array, and returns an array that contains the results.
      * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. 
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
        return [];
    }

    /**
      * Returns the elements of an array that meet the condition specified in a callback function. 
      * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array. 
      * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
      */
    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] {
        return [];
    }

    /**
      * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
      * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
      * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
      */
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T {
        return null;
    }

    /** 
      * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
      * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. 
      * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
      */
    reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T {
        return null;
    }

    /* ------------------------------------------------------------------------
        EXPORTERS
    ------------------------------------------------------------------------ */
    /**
      * @brief Returns a string representation of an array.
      */
    public toString(): string {
        return "";
    }
    toLocaleString(): string {
        return "";
    }

    
}
Vector.prototype = new Array();

/**
 * @brief Dictionary, a Map of string key
 *
 * @author Jeongho Nam
 */
class Dictionary<_Ty>
{
    private data_: Object;
    private size_: number;

    public constructor() {
        this.data_ = new Object();
        this.size_ = 0;
    }

    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    public data(): Object { return this.data_; }
    public size(): number { return this.size_; }

    public has(key: string): boolean {
        return this.data_.hasOwnProperty(key);
    }
    public get(key: string): _Ty {
        return this.data_[key];
    }
    public getKeys(): Array<string> {
        var keys: Array<string> = [];
        for (var key in this.data_)
            keys.push(key);

        return keys;
    }

    /* ---------------------------------------------------------
        MODIFIERS
    --------------------------------------------------------- */
    public set(key: string, value: _Ty): void {
        if (this.has(key) == false)
            this.size_++;

        this.data_[key] = value;
    }
    public erase(key: string): void {
        if (this.has(key) == false)
            return;

        this.size_--;
        delete this.data_[key];
    }
    public clear(): void {
        this.data_ = new Object();
        this.size_ = 0;
    }
}

/**
 * @brief A pair
 *
 * @author Jeongho Nam
 */
class Pair<T1, T2> {
    public first: T1;
    public second: T2;

    public constructor(first: T1, second: T2) {
        this.first = first;
        this.second = second;
    }
}

/**
 * @brief A utility class supports static method of string
 *
 * @author Jeongho Nam
 */
class StringUtil {
    /**
     * @brief Get a tabbed string by specified size
     */
    public static tab(size: number): string {
        var str: string = "";
        for (var i: number = 0; i < size; i++)
            str += "\t";

        return str;
    }

    /**
     * @brief Replace all patterns of a string
     */
    public static replaceAll(str: string, pairs: Array<Pair<string, string>>): string {
        if (pairs.length == 0)
            return str;

        var foundPairList: Array<Pair<number, number>> = new Array<Pair<number, number>>();
        
        //FIND POSITION-INDEX IN ORIGINAL STRING
        for (var i: number = 0; i < pairs.length; i++) {
            var index: number = 0;

            while (true) {
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
    }
}

/**
 * @brief XML
 *
 * @author Jeongho Nam
 */
class XML extends Dictionary<XMLList> {
    private tag: string;
    private value: string;
    private properties: Dictionary<string>;
    
    /* -------------------------------------------------------------
        CONSTRUCTORS
    ------------------------------------------------------------- */
    /**
     * @brief Default Constructor.
     */
    public constructor(str: string = "") {
        super();
        this.properties = new Dictionary<string>();

        if (str.indexOf("<") == -1)
            return;

        var start: number;
        var end: number;

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

    private construct(str: string): void {
        this.constructTag(str);
        this.constructProperty(str);

        var res = this.constructValue(str);
        if (res.second == true)
            this.constructChildren(res.first);
    }
    private constructTag(str: string): void {
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
    private constructProperty(str: string): void {
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
        for (var i: number = 0; i < line.length; i++) {
            //Start of quote
            if (inQuote == false && (line.charAt(i) == "'" || line.charAt(i) == "\"")) {
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
                ) {
                helpers.push({ "type": quoteType, "start": start, "end": i });
                inQuote = false;
            }
        }

        //CONSTRUCTING
        for (var i: number = 0; i < helpers.length; i++) {
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
            
            this.setProperty(label, this.decodeProperty(value))
        }
    }
    private constructValue(str: string): Pair<string, boolean> {
        var end_slash: number = str.lastIndexOf("/");
        var end_block: number = str.indexOf(">");

        if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) {
            //STATEMENT1: <TAG />
            //STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
            this.value = "";
            
            return new Pair<string, boolean>(str, false);
        }

        var start: number = end_block + 1;
        var end: number = str.lastIndexOf("<");
        str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG

        if (str.indexOf("<") == -1)
            this.value = this.decodeValue( str.trim() );
        else
            this.value = "";

        return new Pair<string, boolean>(str, true);
    }
    private constructChildren(str: string): void {
        if (str.indexOf("<") == -1)
            return;
        
        var start: number = str.indexOf("<");
        var end: number = str.lastIndexOf(">") + 1;
        str = str.substring(start, end);

        var blockStart: number = 0;
        var blockEnd: number = 0;
        start = 0;

        for (var i: number = 0; i < str.length; i++) {
            if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
                blockStart++;
            else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
                blockEnd++;

            if (blockStart >= 1 && blockStart == blockEnd) {
                end = str.indexOf(">", i);

                var xmlList: XMLList;
                var xml: XML = new XML();
                xml.construct( str.substring(start, end + 1) );

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
    }

    /* -------------------------------------------------------------
        ACCESSORS
    ------------------------------------------------------------- */
    public getTag(): string {
        return this.tag;
    }
    public getValue(): string {
        return this.value;
    }

    public hasProperty(key: string): boolean {
        return this.properties.has(key);
    }
    public getProperty(key: string): string {
        return this.properties.get(key);
    }

    /* -------------------------------------------------------------
        SETTERS
    ------------------------------------------------------------- */
    public setTag(str: string): void {
        this.tag = str;
    }
    public setValue(str: string): void {
        this.value = str;
    }

    public setProperty(key: string, value: string): void {
        this.properties.set(key, value);
    }
    public eraseProperty(key: string): void {
        this.properties.erase(key);
    }

    /* -------------------------------------------------------------
        FILTERS
    ------------------------------------------------------------- */
    private calcMinIndex(... args: number[]): number {
        var min: number = args[0];

        for (var i: number = 1; i < args.length; i++) {
            if (args[i] == -1)
                continue;

            if (args[i] < min)
                min = args[i];
        }
        return min;
    }

    private decodeValue(str: string): string {
        var pairs: Array<Pair<string, string>> =
            [
                new Pair("&amp;", "&"),
                new Pair("&lt;", "<"),
                new Pair("&gt;", ">")
            ];
        return StringUtil.replaceAll(str, pairs);
    }
    private encodeValue(str: string): string {
        var pairs: Array<Pair<string, string>> =
            [
                new Pair("&", "&amp;"),
                new Pair("<", "&lt;"),
                new Pair(">", "&gt;")
            ];
        return StringUtil.replaceAll(str, pairs);
    }

    private decodeProperty(str: string): string {
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
    private encodeProperty(str: string): string {
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
     * @brief Convert the XML to a String
     */
    public toString(level: number = 0): string {
        var str: string = StringUtil.tab(level) + "<" + this.tag;
        var childrenString: string = "";

        //PROPERTIES
        var propertiesKeys: Array<string> = this.properties.getKeys();
        for (var i: number = 0; i < propertiesKeys.length; i++) {
            var key: string = propertiesKeys[i];
            var value: string = this.properties.get(key);

            str += " " + key + "=\"" + this.encodeProperty(value) + "\"";
        }
        
        if (this.size() == 0) {
            if (this.value != "")
                str += ">" + this.value + "</" + this.tag + ">";
            else
                str += " />";
        } else {
            str += ">\n";

            var keys = this.getKeys();
            for (var i: number = 0; i < keys.length; i++)
                str += this.get(keys[i]).toString(level + 1);

            str += StringUtil.tab(level) + "</" + this.tag + ">";
        }
        return str;
    }
}

/**
 * @brief List of XML(s) with same tag
 *
 * @author Jeongho Nam
 */
class XMLList extends Vector<XML>
{
    /**
     * @brief Default Constructor.
     */
    constructor() {
        super();
    }

    /**
     * @brief Convert XMLList to String
     *
     * @param level Level(depth) of the XMLList 
     */
    public toString(level: number = 0): string {
        var str: string = "";
        for (var i: number = 0; i < this.length; i++)
            str += this[i].toString(level) + "\n";

        return str;
    }
}

/* =================================================================================
    PROTOCOLS
====================================================================================
    * NETWORK I/O
        - IProtocol
        - ServerConnector
 
    * MESSAGE
        - Invoke
        - InvokeParameter
 
    * UI
        - Window
        - Movie
        - SubMovie
 
    * ENTITY
        - IEntity
        - Entity
        - EntityArray
================================================================================= */

/**
 * @brief An interface of chain of Invoke message
 *
 * @author Jeongho Nam
 */
interface IProtocol {
    sendData(invoke: Invoke): void;
    replyData(invoke: Invoke): void;
}

/**
 * @brief A server connector
 *
 * @author Jeongho Nam
 */
class ServerConnector
    implements IProtocol
{
    private parent: IProtocol;
    private socket: WebSocket;

    private str: string;

    public onopen: Function;

    constructor(parent: IProtocol) {
        this.parent = parent;

        this.str = "";
    }
    public connect(ip: string, port: number): void {
        this.socket = new WebSocket(ip + ":" + port);

        this.socket.onopen = this.handleConnect;
        this.socket.onmessage = this.handleReply;
    }

    /* ----------------------------------------------------
        IPROTOCOL'S METHOD
    ---------------------------------------------------- */
    public sendData(invoke: Invoke): void {
        var xml: XML = invoke.toXML();
        var str: string = xml.toString();

        this.socket.send(str);
    }
    public replyData(invoke: Invoke): void {
        this.parent.replyData(invoke);
    }

    /* ----------------------------------------------------
        HANDLING CONNECTION AND MESSAGES
    ---------------------------------------------------- */
    private handleConnect(event: Event): void
    {
        this.onopen.apply([event]);
    }
    private handleReply(event: MessageEvent): void
    {
        this.str += event.data;
        var invokeArray: Array<Invoke>;

        var indexPair: Pair<number, number> = null;
        var sizePair: Pair<number, number> = new Pair<number, number>(0, 0);
        var startIndex: number = 0;
        var endIndex: number = 0;

        while (true) {
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

/**
 * @brief Standard network I/O message
 *
 * @author Jeongho Nam
 */
class Invoke
    extends Vector<InvokeParameter>
{
    private listener: string;

    constructor(...args)
    {
        super();

        if (args.length == 1)
        {
            var val: any = args[0];

            if (val instanceof String)
                this.listener = val;
            else if (val instanceof XML)
            {
                var xml: XML = val;
                this.listener = xml["@listener"];

                if (xml.hasOwnProperty("parameter") == false)
                    return;

                var xmlList: XMLList = xml["parameter"];
                for (var i: number = 0; i < xmlList.length; i++)
                    this.push(new InvokeParameter(xmlList[i]));
            }
        }
        else
        {
            this.listener = args[0];

            for (var i: number = 1; i < args.length; i++)
            {
                var name: string = "par" + i;
                var value: any = args[i];

                var parameter: InvokeParameter = new InvokeParameter(name, value);
                this.push(parameter);
            }
        }
    }

    public getListener(): string {
        return this.listener;
    }
    public getArguments(): Array<any> {
        var args: Array<any> = new Array<any>();
        for (var i: number = 0; i < this.length; i++)
            args[i] = this[i].getValue();

        return args;
    }

    public apply(obj: IProtocol): boolean {
        if (!(obj.hasOwnProperty(this.listener) == true &&
            obj[this.listener] instanceof Function))
            return false;

        var func: Function = obj[this.listener];
        func.apply(this.getArguments());

        return true;
    }

    public toXML(): XML {
        var xml: XML = new XML();

        xml.setTag("invoke");
        xml["@listener"] = this.listener;

        var xmlList: XMLList = new XMLList();
        for (var i: number = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());

        xml["parameter"] = xmlList;
        return xml;
    }
}

class InvokeParameter {
    private name: string;
    private type: string;
    private value: any;

    constructor(...args) {
        if (args.length == 1 && args[0] instanceof XML) {
            var xml: XML = args[0];

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

    public getName(): string {
        return this.name;
    }
    public getType(): string {
        return this.type;
    }
    public getValue(): any {
        return this.value;
    }

    public toXML(): XML {
        var xml: XML = new XML();
        xml.setTag("parameter");

        xml["@name"] = this.name;
        xml["@type"] = this.type;
        xml["@value"] = this.value;

        return xml;
    }
}

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
class Application
    implements IProtocol
{
    protected socket: ServerConnector;
    protected movie: Movie;

    constructor(ip: string, port: number)
    {
        this.socket = new ServerConnector(this);
        this.socket.onopen = this.handleConnect;

        this.socket.connect(ip, port);
    }
    private handleConnect(event: Event): void
    {
    }

    public replyData(invoke: Invoke): void {
        if (invoke.apply(this) == false)
            this.movie.sendData(invoke);
    }
    public sendData(invoke: Invoke): void {
        this.socket.sendData(invoke);
    }
}

/**
 * @brief A movie belonged to an Application
 */
class Movie
    implements IProtocol {
    protected application: Application;

    public replyData(invoke: Invoke): void {
        invoke.apply(this) == false;
    }
    public sendData(invoke: Invoke): void {
        this.application.sendData(invoke);
    }
}

/**
 * @brief A sub-movie
 */
class SubMovie
    implements IProtocol {
    protected parent: IProtocol;

    public replyData(invoke: Invoke): void {
        invoke.apply(this);
    }
    public sendData(invoke: Invoke): void {
        this.parent.sendData(invoke);
    }
}

interface IEntity {
    construct(xml: XML): void;

    TAG(): string;
    key(): any;

    toXML(): XML;
}

class Entity
    implements IEntity {
    constructor() { }
    public construct(xml: XML): void { }

    public TAG(): string { return ""; }
    public key(): any { return ""; }

    public toXML(): XML {
        var xml: XML = new XML();
        xml.setTag(this.TAG());

        return xml;
    }
}

class EntityArray extends Vector<IEntity>
{
    constructor() {
        super();
    }
    public construct(xml: XML): void {
        this.splice(0, this.length);

        if (xml.hasOwnProperty(this.CHILD_TAG()) == false)
            return;

        var xmlList: XMLList = xml[this.CHILD_TAG()];
        for (var i: number = 0; i < xmlList.length; i++) {
            var child: IEntity = this.createChild(xmlList[i]);
            if (child != null)
                this.push(child);
        }
    }

    public createChild(xml: XML): IEntity {
        return null;
    }

    public TAG(): string { return ""; }
    public CHILD_TAG(): string { return ""; }
    public key(): any { return ""; }

    public toXML(): XML {
        var xml: XML = new XML();
        xml.setTag(this.TAG());

        if (this.length == 0)
            return xml;

        var xmlList: XMLList = new XMLList();
        for (var i: number = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());

        return xml;
    }
}