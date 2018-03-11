import { XML } from "sxml";

import { IEntity } from "./IEntity";

/**
 * An entity, a standard data class.
 *
 * Entity is a class for standardization of expression method using on network I/O by XML. If 
 * Invoke is a standard message protocol of Samchon Framework which must be kept, Entity is a 
 * recommended semi-protocol of message for expressing a data class. Following the semi-protocol
 * Entity is not imposed but encouraged.
 *
 * As we could get advantages from standardization of message for network I/O with Invoke, 
 * we can get additional advantage from standardizing expression method of data class with Entity. 
 * We do not need to know a part of network communication. Thus, with the Entity, we can only 
 * concentrate on entity's own logics and relationships between another entities. Entity does not
 * need to how network communications are being done.
 *  
 * I say repeatedly. Expression method of Entity is recommended, but not imposed. It's a semi
 * protocol for network I/O but not a essential protocol must be kept. The expression method of
 * Entity, using on network I/O, is expressed by XML string.
 *
 * If your own network system has a critical performance issue on communication data class, 
 * it would be better to using binary communication (with ByteArray).
 * Don't worry about the problem! Invoke also provides methods for binary data (ByteArray).
 * 
 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_message_protocol.png)
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

	public construct(xml: XML): void 
	{
		IEntity.construct(this, xml);
	}

	/**
	 * @inheritdoc
	 */
	public key(): any { return null; }

	/**
	 * @inheritdoc
	 */
	public abstract TAG(): string;
	
	/**
	 * @inheritdoc
	 */
	public toXML(): XML
	{
		return IEntity.toXML(this);
	}
}