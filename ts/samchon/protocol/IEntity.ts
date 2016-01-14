/// <reference path="../library/XML.ts" />

namespace samchon.protocol
{
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
    export interface IEntity
    {
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
        construct(xml: library.XML);

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
&lt;/member&gt;
         *          </pre>
	     *		</td>
	     *	</tr>
	     * </table>
	     *
	     * @return An XML object representing the Entity.
	     */
        toXML(): library.XML;
    }
}