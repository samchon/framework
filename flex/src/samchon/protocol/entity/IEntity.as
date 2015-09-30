package samchon.protocol.entity
{
	/**
	 * <p> An entity, a standard data class </p>
	 * 
	 * @author Jeongho Nam
	 */
	public interface IEntity
	{
		/**
		 * <p> A tag name when represented by XML </p>
		 *
		 * <ul>
		 * 	<li> &lt;TAG {...properties} /&gt; </li>
		 * </ul>
		 */ 
		function get TAG():String;
		
		/**
		 * <p> Get a key that can identify the Entity uniquely. </p>
		 * 
		 * <p> If identifier of the Entity is not atomic value, returns a string or paired object
		 * that can represents the composite identifier. </p>
		 */ 
		function get key():*;
		
		/**
		 * <p> Construct data of the Entity from a XML object. </p>
		 * 
		 * <p> Overrides the construct() method and fetch data of member variables from the XML. </p>
		 */ 
		function construct(xml:XML):void;		
		
		
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
		function toXML():XML;
	}
}