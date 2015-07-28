package org.samchon.protocol.entity
{
	/**
	 * Entity provides methods for converting between Entity and XML<br>
	 * <br>
	 * 
	 * @see XML
	 * @see Invoke
	 * @author Jeongho Nam<br>
	 * <a href="http://samchon.org" target="_blank">http://samchon.org</a>
	 */
	public class Entity implements IEntity
	{
		public function get TAG():String {return "";}
		public function get key():* { return null; }
		
		public function Entity() {}
		public function construct(xml:XML):void {}
		
		public function toXML():XML
		{
			return new XML("<" + TAG + " />");
		}
	}
}