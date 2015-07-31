package samchon.protocol.entity
{
	/**
	 * <p>Entity provides methods for converting between Entity and XML</p>
	 * 
	 * @see XML
	 * @see Invoke
	 * @author Jeongho Nam
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