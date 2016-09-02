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
		construct(xml: library.XML): void;

		/**
		 * <p> Get a key that can identify the Entity uniquely. </p>
		 * 
		 * <p> If identifier of the Entity is not atomic value, returns a paired or tuple object
		 * that can represents the composite identifier. </p>
		 * 
		 * <code>
		 * class Point extends Entity
		 * {
		 *     private x: number;
		 *     private y: number;
		 * 
		 *     public key(): std.Pair<number, number>
		 *     {
		 *         return std.make_pair(this.x, this.y);
		 *     }
		 * }
		 * </code>
		 */
		key(): any;

		/**
		 * <p> A tag name when represented by XML. </p>
		 *
		 * <code> <TAG {...properties} /> </code>
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
		 * <memberList>
		 *	<member id='jhnam88' name='Jeongho Nam' birthdate='1988-03-11' />
		 *	<member id='master' name='Administartor' birthdate='2011-07-28' />
		 * </memberList>
		 * </code>
		 *
		 * <h4> Non-standard usage abusing value. </h4>
		 * <code>
		 * <member>
		 *	<id>jhnam88</id>
		 *	<name>Jeongho Nam</name>
		 *	<birthdate>1988-03-11</birthdate>
		 * </member>
		 * <member>
		 *	<id>master</id>
		 *	<name>Administartor</name>
		 *	<birthdate>2011-07-28</birthdate>
		 * </member>
		 * </code>
		 *
		 * @return An XML object representing the Entity.
		 */
		toXML(): library.XML;
	}

	/**
	 * @hidden
	 */
	export namespace IEntity
	{
		export function construct(entity: IEntity, xml: library.XML, ...prohibited_names: string[]): void
		{
			// MEMBER VARIABLES
			//  - ATOMIC ONLY; STRING, NUMBER AND BOOLEAN
			let property_map: std.HashMap<string, string> = xml.getPropertyMap();

			for (let it = property_map.begin(); !it.equal_to(property_map.end()); it = it.next())
			{
				if (entity[it.first] == undefined)
					continue;

				let prohibited: boolean = false;
				for (let i: number = 0; i < prohibited_names.length; i++)
					if (prohibited_names[i] == it.first)
					{
						prohibited = true;
						break;
					}
				if (prohibited == true)
					continue;

				if (typeof entity[it.first] == "string")
					entity[it.first] = it.second;
				else if (typeof entity[it.first] == "number")
					entity[it.first] = Number(it.second);
				else if (typeof entity[it.first] == "boolean")
					entity[it.first] = (it.second == "true");
			}
		}

		export function toXML(entity: IEntity, ...prohibited_names: string[]): library.XML
		{
			let xml: library.XML = new library.XML();
			xml.setTag(entity.TAG());

			// MEMBER VARIABLES
			//  - ATOMIC ONLY; STRING, NUMBER AND BOOLEAN
			for (let key in entity)
				if (typeof key == "string"
					&& (typeof entity[key] == "string" || typeof entity[key] == "number" || typeof entity[key] == "boolean")
					&& entity.hasOwnProperty(key))
				{
					let prohibited: boolean = false;
					for (let i: number = 0; i < prohibited_names.length; i++)
						if (prohibited_names[i] == key)
						{
							prohibited = true;
							break;
						}
					if (prohibited == true)
						continue;

					// ATOMIC
					xml.setProperty(key, String(entity[key]));
				}

			return xml;
		}
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
			IEntity.construct(this, xml);
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
			return IEntity.toXML(this);
		}
	}
}