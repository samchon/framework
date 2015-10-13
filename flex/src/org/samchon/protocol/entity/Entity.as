package org.samchon.protocol.entity
{
	/**
	 * <p> An entity, a standard data class. </p>
	 * 
	 * <h3> [Inherited] </h3>
	 * @copy IEntity
	 * 
	 * @author Jeongho Nam
	 */
	public class Entity implements IEntity
	{
		public function get TAG():String {return "";}
		public function get key():* { return null; }
		
		/**
		 * Default Constructor.
		 */
		public function Entity() {}
		public function construct(xml:XML):void {}
		
		public function toXML():XML
		{
			return new XML("<" + TAG + " />");
		}
	}
}