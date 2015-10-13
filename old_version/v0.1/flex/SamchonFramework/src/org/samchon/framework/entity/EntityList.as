package org.samchon.framework.entity
{
	import org.samchon.container.ArrayCollectionMap;
	import org.samchon.framework.invoke.Invoke;
	
	public class EntityList extends ArrayCollectionMap implements IEntity
	{
		public function get TAG():String { return null; }
		public function get CHILD_TAG():String { return null; }
		public function get LISTENER():String { return null; }
		public function get key():String { return null; }
		
		public function EntityList()
		{
			super();
		}
		public function createChild():IEntity
		{
			return null;
		}
		public function construct(xml:XML):void
		{
			removeAll();
			if(xml.hasOwnProperty(CHILD_TAG) == false)
				return;
				
			var xmlList:XMLList = xml[CHILD_TAG];
			for(var i:int = 0; i < xmlList.length(); i++)
			{
				var entity:IEntity = createChild();
				if(entity == null)
					continue;
				
				entity.construct(xmlList[i] as XML);
				addItem(entity);
			}
		}
		
		public function at(x:int):IEntity
		{
			return getItemAt(x) as IEntity;
		}
		public function get(key:String):IEntity
		{
			return map.get(key) as IEntity;	
		}
		
		public function load():void
		{
		}
		public function archive():void
		{
		}
		
		public function toXML():XML
		{
			var xml:XML = new XML("<" + TAG + " />");
			
			var xmlList:XMLList = new XMLList();
			for(var i:int = 0; i < length; i++)
				xmlList[i] = at(i).toXML();
			
			xml.setChildren(xmlList);
			return xml;
		}
		public function toInvoke():Invoke
		{
			var invoke:Invoke = new Invoke(LISTENER);
			invoke.addParameter("xml", "xml", toXML());
			
			return invoke;
		}
	}
}