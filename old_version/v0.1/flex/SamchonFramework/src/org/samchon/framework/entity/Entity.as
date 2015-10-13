package org.samchon.framework.entity
{
	import org.samchon.framework.invoke.Invoke;

	public class Entity implements IEntity
	{
		public function get TAG():String { return null; }
		public function get LISTENER():String { return null; }
		public function get key():String { return null; }
		/* ------------------------------------------------------------------- */
		
		public function Entity() { }
		public function construct(xml:XML):void {}
		
		public function load():void {}
		public function archive():void {}
		
		public function toXML():XML
		{
			return new XML("<" + TAG + " />");
		}
		public function toInvoke():Invoke
		{
			var invoke:Invoke = new Invoke(LISTENER);
			invoke.addParameter("xml", "xml", toXML());
			
			return invoke;
		}
	}
}