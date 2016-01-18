/// <reference path="../../std/UnorderedMap.ts" />
///     <reference path="XMLList.ts" />

/// <reference path="StringUtil.ts" />

namespace samchon.library
{
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
    export class XML
	    extends std.UnorderedMap<string, XMLList>
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
	    private properties: std.UnorderedMap<string, any>;
	
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

            this.properties = new std.UnorderedMap<string, any>();
            this.value = "";

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
	    private parseValue(str: string): std.Pair<string, boolean>
	    {
		    var end_slash: number = str.lastIndexOf("/");
		    var end_block: number = str.indexOf(">");

		    if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) 
            {
			    //STATEMENT1: <TAG />
			    //STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
			    this.value = "";
			
			    return new std.Pair<string, boolean>(str, false);
		    }

		    var start: number = end_block + 1;
		    var end: number = str.lastIndexOf("<");
		    str = str.substring(start, end); //REDEFINE WEAK_STRING -> IN TO THE TAG

		    if (str.indexOf("<") == -1)
			    this.value = XML.decodeValue( str.trim() );
		    else
			    this.value = "";

		    return new std.Pair<string, boolean>(str, true);
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

        public getPropertyMap(): std.UnorderedMap<string, any>
        {
            return this.properties;
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
                throw Error("out of range");
            else
                this.properties.erase(key);
	    }

        public push(...xmls: XML[]): number;
        public push(...xmlLists: XMLList[]): number;

        public push(...items: any[]): number
        {
            for (var i: number = 0; i < items.length; i++)
            {
                if (items[i] instanceof XML)
                {
                    var xml: XML = items[i];

                    if (this.has(xml.tag) == true)
                        this.get(xml.tag).push(xml);
                    else 
                    {
                        var xmlList: XMLList = new XMLList();
                        xmlList.push(xml);

                        this.set(xml.tag, xmlList);
                    }
                }
                else if (items[i] instanceof XMLList)
                {
                    super.push(items[i]);
                }
            }

            return this.size();
        }

        public addAllProperties(xml: XML): void
        {
            for (var it = xml.properties.begin(); it.equals(xml.properties.end()) == false; it = it.next())
                this.setProperty(it.first, it.second);
        }

        public clearProperties(): void
        {
            this.properties = new std.UnorderedMap<string, any>();
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
		    var pairs: Array<std.Pair<string, string>> =
			    [
				    new std.Pair("&amp;", "&"),
				    new std.Pair("&lt;", "<"),
				    new std.Pair("&gt;", ">")
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
		    var pairs: Array<std.Pair<string, string>> =
			    [
				    new std.Pair("&", "&amp;"),
				    new std.Pair("<", "&lt;"),
				    new std.Pair(">", "&gt;")
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
		    var pairs: Array<std.Pair<string, string>> =
			    [
				    new std.Pair("&amp;", "&"),
				    new std.Pair("&lt;", "<"),
				    new std.Pair("&gt;", ">"),
				    new std.Pair("&quot;", "\""),
				    new std.Pair("&apos;", "'"),
				    new std.Pair("&#x9;", "\t"),
				    new std.Pair("&#xA;", "\n"),
				    new std.Pair("&#xD;", "\r"),
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
		    var pairs: Array<std.Pair<string, string>> =
			    [
				    new std.Pair("&", "&amp;"),
				    new std.Pair("<", "&lt;"),
				    new std.Pair(">", "&gt;"),
				    new std.Pair("\"", "&quot;"),
				    new std.Pair("'", "&apos;"),
				    new std.Pair("\t", "&#x9;"),
				    new std.Pair("\n", "&#xA;"),
				    new std.Pair("\r", "&#xD;"),
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

        /**
         * <p> Convert the XML to HTML string. </p>
         */
        public toHTML(level: number = 0): string
        {
            var str: string = StringUtil.htmlTab(level) + "&lt;" + this.tag;
            var childrenString: string = "";

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
        }
    }

}