/// <reference path="../API.ts" />

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
	 * @author Jeongho Nam <http://samchon.org>
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
		 * 	<li> <TAG {...properties} /> </li>
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
		 * <h4> Standard Usage. </h4>
		 * <code>
		 *<memberList>
		 *	<member id='jhnam88' name='Jeongho Nam' birthdate='1988-03-11' />
		 *	<member id='master' name='Administartor' birthdate='2011-07-28' />
		 *</memberList>
		 * </code>
		 *
		 * <h4> Non-standard usage abusing value. </h4>
		 * <code>
		 *<member>
		 *	<id>jhnam88</id>
		 *	<name>Jeongho Nam</name>
		 *	<birthdate>1988-03-11</birthdate>
		 *</member>
		 *<member>
		 *	<id>master</id>
		 *	<name>Administartor</name>
		 *	<birthdate>2011-07-28</birthdate>
		 *</member>
		 * </code>
		 *
		 * @return An XML object representing the Entity.
		 */
		toXML(): library.XML;
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
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Entity
		implements IEntity 
	{
		/**
		 * Default Constructor.
		 */
		constructor() 
		{
			//NOTHING
		}

		public construct(xml: library.XML): void 
		{
			// MEMBER VARIABLES; ATOMIC
			let propertyMap = xml.getPropertyMap();

			for (let v_it = propertyMap.begin(); v_it.equal_to(propertyMap.end()) != true; v_it = v_it.next())
				if (this.hasOwnProperty(v_it.first) == true) 
					if (typeof this[v_it.first] == "number")
						this[v_it.first] = parseFloat(v_it.second);
					else if (typeof this[v_it.first] == "string")
						this[v_it.first] = v_it.second;
		}

		/**
		 * @inheritdoc
		 */
		public key(): any { return ""; }

		/**
		 * @inheritdoc
		 */
		public abstract TAG(): string;
		
		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = new library.XML();
			xml.setTag(this.TAG());

			// MEMBERS
			for (let key in this) 
				if (typeof key == "string" && // NOT STRING, THEN IT MEANS CHILDREN (INT, INDEX)
					(typeof this[key] == "string" || typeof this[key] == "number"))
				{
					xml.setProperty(key, this[key]);
				}

			return xml;
		}
	}
}