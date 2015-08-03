package samchon.protocol.entity
{
	/**
	 * An intreface for Entity and EntityArray <br/>
	 * Provide converting methods between Entity XML<br/>
	 * <br/>
	 * @see XML
	 * @author Jeongho Nam
	 */
	public interface IEntity
	{
		/**
		 * A tag name used when converted to XML<br/>
		 * <u>&lt;TAG /&gt;</u>
		 */ 
		function get TAG():String;
		
		/**
		 * An identifier of this Entity
		 */ 
		function get key():*;
		
		/**
		 * <u>XML -> Entity</u><br/>
		 * construct Entity's data from XML<br/>
		 * <br/>
		 * @param xml to be refered to construct data in <code>Entity</code>
		 */ 
		function construct(xml:XML):void;		
		
		
		/**
		 * <u>Entity -> XML</u><br/>
		 * convert the data of Entity to XML<br/>
		 * <br/>
		 * @return XML representing data of the <code>IEntity</code>
		 */ 
		function toXML():XML;
	}
}