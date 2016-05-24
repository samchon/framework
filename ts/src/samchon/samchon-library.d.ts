declare namespace samchon.library {
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
     * @author Jeongho Nam <http://samchon.org>
     */
    abstract class CaseGenerator {
        /**
         * <p> Size, the number of all cases. </p>
         */
        protected size_: number;
        /**
         * <p> N, size of the candidates. </p>
         */
        protected n_: number;
        /**
         * <p> R, size of elements of each case. </p>
         */
        protected r_: number;
        /**
         * <p> Construct from size of N and R. </p>
         *
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number);
        /**
         * <p> Get size of all cases. </p>
         *
         * @return Get a number of the all cases.
         */
        size(): number;
        /**
         * <p> Get size of the N. </p>
         */
        n(): number;
        /**
         * <p> Get size of the R. </p>
         */
        r(): number;
        /**
         * <p> Get index'th case. </p>
         *
         * @param index Index number
         * @return The row of the index'th in combined permuation case
         */
        abstract at(index: number): Array<number>;
    }
    /**
     * <p> A combined-permutation case generator. </p>
     * <p> <sub>n</sub>TT<sub>r</sub> </p>
     *
     * @inheritdoc
     * @author Jeongho Nam <http://samchon.org>
     */
    class CombinedPermutationGenerator extends CaseGenerator {
        /**
         * <p> An array using for dividing each element index. </p>
         */
        private dividerArray;
        /**
         * <p> Construct from size of N and R. </p>
         *
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number);
        at(index: number): Array<number>;
    }
    /**
     * <p> A permutation case generator. </p>
     * <p> nPr </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     * @inheritdoc
     */
    class PermuationGenerator extends CaseGenerator {
        /**
         * <p> Construct from size of N and R. </p>
         *
         * @param n Size of candidates.
         * @param r Size of elements of each case.
         */
        constructor(n: number, r: number);
        /**
         * @inheritdoc
         */
        at(index: number): Array<number>;
    }
    class FactorialGenerator extends PermuationGenerator {
        /**
         * Construct from factorial size N.
         *
         * @param n Factoria size N.
         */
        constructor(n: number);
    }
}
declare namespace samchon.library {
    /**
     * An event class.
     *
     * <ul>
     *  <li> Comments from - https://developer.mozilla.org/en-US/docs/Web/API/Event/ </li>
     * </ul>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class BasicEvent implements Event {
        NONE: number;
        CAPTURING_PHASE: number;
        AT_TARGET: number;
        BUBBLING_PHASE: number;
        private type_;
        private target_;
        private currentTarget_;
        protected trusted_: boolean;
        protected bubbles_: boolean;
        protected cancelable_: boolean;
        protected defaultPrevented_: boolean;
        protected cancelBubble_: boolean;
        private timeStamp_;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @inheritdoc
         */
        initEvent(type: string, bubbles: boolean, cancelable: boolean): void;
        /**
         * @inheritdoc
         */
        preventDefault(): void;
        /**
         * @inheritdoc
         */
        stopImmediatePropagation(): void;
        /**
         * @inheritdoc
         */
        stopPropagation(): void;
        /**
         * @inheritdoc
         */
        type: string;
        /**
         * @inheritdoc
         */
        target: IEventDispatcher;
        /**
         * @inheritdoc
         */
        currentTarget: IEventDispatcher;
        /**
         * @inheritdoc
         */
        isTrusted: boolean;
        /**
         * @inheritdoc
         */
        bubbles: boolean;
        /**
         * @inheritdoc
         */
        cancelable: boolean;
        /**
         * @inheritdoc
         */
        eventPhase: number;
        /**
         * @inheritdoc
         */
        defaultPrevented: boolean;
        /**
         * @inheritdoc
         */
        srcElement: Element;
        /**
         * @inheritdoc
         */
        cancelBubble: boolean;
        /**
         * @inheritdoc
         */
        timeStamp: number;
        /**
         * Don't know what it is.
         */
        returnValue: boolean;
    }
    class ProgressEvent extends BasicEvent {
        static PROGRESS: string;
        protected numerator_: number;
        protected denominator_: number;
        constructor(type: string, numerator: number, denominator: number);
        numerator: number;
        denominator: number;
    }
}
declare namespace samchon.library {
    /**
     * <p> The IEventDispatcher interface defines methods for adding or removing event listeners, checks
     * whether specific types of event listeners are registered, and dispatches events. </p>
     *
     * <p> Event targets are an important part of the Flash�� Player and Adobe AIR event model. The event
     * target serves as the focal point for how events flow through the display list hierarchy. When an
     * event such as a mouse click or a keypress occurs, an event object is dispatched into the event flow
     * from the root of the display list. The event object makes a round-trip journey to the event target,
     * which is conceptually divided into three phases: the capture phase includes the journey from the
     * root to the last node before the event target's node; the target phase includes only the event
     * target node; and the bubbling phase includes any subsequent nodes encountered on the return trip to
     * the root of the display list. </p>
     *
     * <p> In general, the easiest way for a user-defined class to gain event dispatching capabilities is
     * to extend EventDispatcher. If this is impossible (that is, if the class is already extending another
     * class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member,
     * and write simple hooks to route calls into the aggregated EventDispatcher. </p>
     *
     * <ul>
     *  <li> Made by AS3 - http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/IEventDispatcher.html
     * </ul>
     *
     * @see EventDispatcher
     * @author Migrated by Jeongho Nam <http://samchon.org>
     */
    interface IEventDispatcher {
        /**
         * <p> Checks whether the EventDispatcher object has any listeners registered for a specific type
         * of event. This allows you to determine where an EventDispatcher object has altered handling of
         * an event type in the event flow hierarchy. To determine whether a specific event type actually
         * triggers an event listener, use willTrigger(). </p>
         *
         * <p> The difference between hasEventListener() and willTrigger() is that hasEventListener()
         * examines only the object to which it belongs, whereas willTrigger() examines the entire event
         * flow for the event specified by the type parameter. </p>
         *
         * @param type The type of event.
         */
        hasEventListener(type: string): boolean;
        /**
         * <p> Dispatches an event into the event flow. </p>
         * <p> The event target is the EventDispatcher object upon which the dispatchEvent() method is called. </p>
         *
         * @param event The Event object that is dispatched into the event flow. If the event is being
         *			  redispatched, a clone of the event is created automatically. After an event is
         *			  dispatched, its target property cannot be changed, so you must create a new copy
         *			  of the event for redispatching to work.
         */
        dispatchEvent(event: BasicEvent): boolean;
        /**
         * <p> Registers an event listener object with an EventDispatcher object so that the listener
         * receives notification of an event. You can register event listeners on all nodes in the display
         * list for a specific type of event, phase, and priority.
         *
         * <p> After you successfully register an event listener, you cannot change its priority through
         * additional calls to addEventListener(). To change a listener's priority, you must first call
         * removeEventListener(). Then you can register the listener again with the new priority level. </p>
         *
         * <p> Keep in mind that after the listener is registered, subsequent calls to addEventListener()
         * with a different type or useCapture value result in the creation of a separate listener
         * registration. For example, if you first register a listener with useCapture set to true,
         * it listens only during the capture phase. If you call addEventListener() again using the same
         * listener object, but with useCapture set to false, you have two separate listeners: one that
         * listens during the capture phase and another that listens during the target and bubbling phases. </p>
         *
         * <p> You cannot register an event listener for only the target phase or the bubbling phase.
         * Those phases are coupled during registration because bubbling applies only to the ancestors of
         * the target node. </p>
         *
         * <p> If you no longer need an event listener, remove it by calling removeEventListener(), or
         * memory problems could result. Event listeners are not automatically removed from memory because
         * the garbage collector does not remove the listener as long as the dispatching object exists
         * (unless the useWeakReference parameter is set to true). </p>
         *
         * <p> Copying an EventDispatcher instance does not copy the event listeners attached to it. (If
         * your newly created node needs an event listener, you must attach the listener after creating
         * the node.) However, if you move an EventDispatcher instance, the event listeners attached to
         * it move along with it. </p>
         *
         * <p> If the event listener is being registered on a node while an event is also being processed
         * on this node, the event listener is not triggered during the current phase but may be triggered
         * during a later phase in the event flow, such as the bubbling phase. </p>
         *
         * <p> If an event listener is removed from a node while an event is being processed on the node,
         * it is still triggered by the current actions. After it is removed, the event listener is never
         * invoked again (unless it is registered again for future processing). </p>
         *
         * @param event The type of event.
         * @param listener The listener function that processes the event.
         *				 This function must accept an Event object as its only parameter and must return
         *				 nothing.
         */
        addEventListener(type: string, listener: EventListener, thisArg: Object): void;
        /**
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered
         * with the EventDispatcher object, a call to this method has no effect.
         *
         * @param type The type of event.
         * @param listener The listener object to remove.
         */
        removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
    }
    /**
     * <p> Registers an event listener object with an EventDispatcher object so that the listener
     * receives notification of an event. You can register event listeners on all nodes in the display
     * list for a specific type of event, phase, and priority. </p>
     *
     * <p> After you successfully register an event listener, you cannot change its priority through
     * additional calls to addEventListener(). To change a listener's priority, you must first call
     * removeListener(). Then you can register the listener again with the new priority level. </p>
     *
     * Keep in mind that after the listener is registered, subsequent calls to <code>addEventListener()</code>
     * with a different type or useCapture value result in the creation of a separate listener registration.
     * For example, if you first register a listener with useCapture set to true, it listens only during the
     * capture phase. If you call addEventListener() again using the same listener object, but with
     * useCapture set to false, you have two separate listeners: one that listens during the capture
     * phase and another that listens during the target and bubbling phases.
     *
     * <p> You cannot register an event listener for only the target phase or the bubbling phase. Those
     * phases are coupled during registration because bubbling applies only to the ancestors of the
     * target node. </p>
     *
     * <p> If you no longer need an event listener, remove it by calling <code>removeEventListener()</code>,
     * or memory problems could result. Event listeners are not automatically removed from memory
     * because the garbage collector does not remove the listener as long as the dispatching object
     * exists (unless the useWeakReference parameter is set to true). </p>
     *
     * <p> Copying an EventDispatcher instance does not copy the event listeners attached to it. (If your
     * newly created node needs an event listener, you must attach the listener after creating the
     * node.) However, if you move an EventDispatcher instance, the event listeners attached to it move
     * along with it. </p>
     *
     * <p> If the event listener is being registered on a node while an event is being processed on
     * this node, the event listener is not triggered during the current phase but can be triggered
     * during a later phase in the event flow, such as the bubbling phase. </p>
     *
     * <p> If an event listener is removed from a node while an event is being processed on the node, it is
     * still triggered by the current actions. After it is removed, the event listener is never invoked
     * again (unless registered again for future processing). </p>
     *
     * <ul>
     *  <li> Made by AS3 - http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html
     * </ul>
     *
     * @author Migrated by Jeongho Nam <http://samchon.org>
     */
    class EventDispatcher implements IEventDispatcher {
        /**
         * The origin object who issuing events.
         */
        protected target: IEventDispatcher;
        /**
         * Container of listeners.
         */
        protected listeners: std.HashMap<string, std.HashSet<std.Pair<EventListener, Object>>>;
        /**
         * Default Constructor.
         */
        constructor();
        /**
         * Construct from the origin event dispatcher.
         *
         * @param target The origin object who issuing events.
         */
        constructor(target: IEventDispatcher);
        /**
         * @inheritdoc
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritdoc
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @inheritdoc
         */
        addEventListener(type: string, listener: EventListener, thisArg?: Object): void;
        /**
         * @inheritdoc
         */
        removeEventListener(type: string, listener: EventListener, thisArg?: Object): void;
    }
}
declare namespace samchon.library {
    /**
     * <p> A utility class supporting static methods of string. </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class StringUtil {
        /**
         * <p> Generate a substring. </p>
         *
         * <p> Extracts a substring consisting of the characters from specified start to end.
         * It's same with str.substring( ? = (str.find(start) + start.size()), str.find(end, ?) ) </p>
         *
         * <code>
         let str = between("ABCD[EFGH]IJK", "[", "]");
         console.log(str); // PRINTS "EFGH"
         * </code>
         *
         * <ul>
         *	<li> If start is not specified, extracts from begin of the string to end. </li>
         *	<li> If end is not specified, extracts from start to end of the string. </li>
         *	<li> If start and end are all omitted, returns str, itself. </li>
         * </ul>
         *
         * @param str Target string to be applied between
         * @param start A string for separating substring at the front
         * @param end A string for separating substring at the end
         *
         * @return substring by specified terms
         */
        static between(str: string, start?: string, end?: string): string;
        /**
         * <p> Fetch substrings. </p>
         *
         * <p> Splits a string into an array of substrings dividing by specified delimeters of start and end.
         * It's the array of substrings adjusted the between. </p>
         *
         * <ul>
         *	<li> If startStr is omitted, it's same with the split by endStr not having last item. </li>
         *	<li> If endStr is omitted, it's same with the split by startStr not having first item. </li>
         *	<li> If startStr and endStar are all omitted, returns <i>str</i>. </li>
         * </ul>
         *
         * @param str Target string to split by between
         * @param start A string for separating substring at the front.
         *				If omitted, it's same with split(end) not having last item
         * @param end A string for separating substring at the end.
         *			  If omitted, it's same with split(start) not having first item
         * @return An array of substrings
         */
        static betweens(str: string, start?: string, end?: string): Array<string>;
        /**
         * An array containing whitespaces.
         */
        private static SPACE_ARRAY;
        /**
         * Remove all designated characters from the beginning and end of the specified string.
         *
         * @param str The string whose designated characters should be trimmed.
         * @param args Designated character(s).
         *
         * @return Updated string where designated characters was removed from the beginning and end.
         */
        static trim(str: string, ...args: string[]): string;
        /**
         * Remove all designated characters from the beginning of the specified string.
         *
         * @param str The string should be trimmed.
         * @param delims Designated character(s).
         *
         * @return Updated string where designated characters was removed from the beginning
         */
        static ltrim(str: string, ...args: string[]): string;
        /**
         * Remove all designated characters from the end of the specified string.
         *
         * @param str The string should be trimmed.
         * @param delims Designated character(s).
         *
         * @return Updated string where designated characters was removed from the end.
         */
        static rtrim(str: string, ...args: string[]): string;
        /**
         * Substitute <code>{n}</code> tokens within the specified string.
         *
         * @param format The string to make substitutions in. This string can contain special tokens of the form
         *				 <code>{n}</code>, where <code>n</code> is a zero based index, that will be replaced with the
         *				 additional parameters found at that index if specified.
         * @param args Additional parameters that can be substituted in the <i>format</i> parameter at each
         *			   <code>{n}</code> location, where <code>n</code> is an integer (zero based) index value into
         *			   the array of values specified.
         *
         * @return New string with all of the <code>{n}</code> tokens replaced with the respective arguments specified.
         */
        static substitute(format: string, ...args: any[]): string;
        /**
         * Returns a string specified word is replaced.
         *
         * @param str Target string to replace
         * @param before Specific word you want to be replaced
         * @param after Specific word you want to replace
         *
         * @return A string specified word is replaced
         */
        static replaceAll(str: string, before: string, after: string): string;
        /**
         * Returns a string specified words are replaced.
         *
         * @param str Target string to replace
         * @param pairs A specific word's pairs you want to replace and to be replaced
         *
         * @return A string specified words are replaced
         */
        static replaceAll(str: string, ...pairs: std.Pair<string, string>[]): string;
        /**
         * <p> Get a tabbed string by specified size. </p>
         */
        static tab(size: number): string;
        /**
         * <p> Get a tabbed HTLM string by specified size. </p>
         */
        static htmlTab(size: number): string;
        /**
         * Replace all HTML spaces to a literal space.
         *
         * @param str Target string to replace.
         */
        static removeHTMLSpaces(str: string): string;
    }
}
declare namespace samchon.library {
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
     * @author Jeongho Nam <http://samchon.org>
     */
    class XML extends std.HashMap<string, XMLList> {
        /**
         * <p> Tag name of the XML. </p>
         *
         * <ul>
         *	<li> \<<b>tag</b> label='property' /\>: tag => \"tag\" </li>
         *  <li> \<<b>price</b> high='1500' low='1300' open='1450' close='1320' /\>: tag => \"price\" </li>
         * </ul>
         */
        private tag;
        /**
         * <p> Value of the XML. </p>
         *
         * <ul>
         *  <li> \<parameter name='age' type='int'\><b>26</b>\</parameter\>: value => 26 </li>
         *	<li> \<price high='1500' low='1300' open='1450' close='1320' /\>: value => null </li>
         * </ul>
         */
        private value;
        /**
         * <p> Properties belongs to the XML. </p>
         * <p> A Dictionary of properties accessing each property by its key. </p>
         *
         * <ul>
         *	<li> \<price <b>high='1500' low='1300' open='1450' close='1320'</b> /\>:
         *		propertyMap => {{\"high\": 1500}, {\"low\": 1300}, {\"open\": 1450}, {\"close\", 1320}} </li>
         *	<li> \<member <b>id='jhnam88' name='Jeongho+Nam' comment='Hello.+My+name+is+Jeongho+Nam'</b> \>:
         *		propertyMap => {{\"id\", \"jhnam88\"}, {\"name\", \"Jeongho Nam <http://samchon.org>\"},
         *					 {\"comment\", \"Hello. My name is Jeongho Nam <http://samchon.org>\"}} </li>
         * </ul>
         */
        private properties;
        /**
         * <p> Default Constructor. </p>
         *
         * <p> If the string parameter is not omitted, constructs its tag, value and
         * properties by parsing the string. If there's children, then construct the
         * children XML, XMLList objects, too. </p>
         *
         * @param str A string to be parsed
         */
        constructor(str?: string);
        /**
         * <p> Construct XML objects by parsing a string. </p>
         */
        private construct(str);
        /**
         * <p> Parse and fetch a tag. </p>
         */
        private parseTag(str);
        /**
         * <p> Parse and fetch properties. </p>
         */
        private parseProperty(str);
        /**
         * <p> Parse and fetch a value. </p>
         */
        private parseValue(str);
        /**
         * <p> Parse and construct children XML objects. </p>
         */
        private parseChildren(str);
        /**
         * <p> Get tag. </p>
         */
        getTag(): string;
        /**
         * <p> Get value. </p>
         */
        getValue(): any;
        /**
         * <p> Test wheter a property exists or not. </p>
         */
        hasProperty(key: string): boolean;
        /**
         * <p> Get property by its key. </p>
         */
        getProperty(key: string): any;
        getPropertyMap(): std.HashMap<string, any>;
        /**
         * <p> Set tag (identifier) of the XML. </p>
         */
        setTag(str: string): void;
        /**
         * <p> Set value of the XML. </p>
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
        setValue(str: any): void;
        /**
         * <p> Set a property with its key. </p>
         */
        setProperty(key: string, value: any): void;
        /**
         * <p> Erase a property by its key. </p>
         *
         * @param key The key of the property to erase
         * @throw exception out of range
         */
        eraseProperty(key: string): void;
        push<L extends string, U extends XMLList>(...args: std.Pair<L, U>[]): number;
        push<L extends string, U extends XMLList>(...args: [L, U][]): number;
        push(...xmls: XML[]): number;
        push(...xmlLists: XMLList[]): number;
        addAllProperties(xml: XML): void;
        clearProperties(): void;
        private calcMinIndex(...args);
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
        static decodeValue(str: string): string;
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
        static encodeValue(str: string): string;
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
        static decodeProperty(str: string): string;
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
        static encodeProperty(str: string): string;
        /**
         * <p> Convert the XML to a string. </p>
         */
        toString(level?: number): string;
        /**
         * <p> Convert the XML to HTML string. </p>
         */
        toHTML(level?: number): string;
    }
    /**
     * <p> List of XML(s) having same tag. </p>
     *
     * @author Jeongho Nam <http://samchon.org>
     */
    class XMLList extends std.Vector<XML> {
        /**
         * <p> Default Constructor. </p>
         */
        constructor();
        getTag(): string;
        /**
         * <p> Convert XMLList to string. </p>
         *
         * @param level Level(depth) of the XMLList.
         */
        toString(level?: number): string;
        /**
         * <p> Convert XMLList to HTML string. </p>
         *
         * @param level Level(depth) of the XMLList.
         */
        toHTML(level?: number): string;
    }
}
declare namespace samchon.library.example {
    function test_xml(): void;
}
