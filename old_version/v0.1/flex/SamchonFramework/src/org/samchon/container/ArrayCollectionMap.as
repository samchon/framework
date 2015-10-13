package org.samchon.container
{
	public class ArrayCollectionMap extends ArrayCollection
	{
		//extends ArrayCollection
		//extends Dictionary
		
		protected var map:Dictionary;
		
		public function ArrayCollectionMap(source:Array=null)
		{
			map = new Dictionary();
			super(source);
		}
		override public function set source(s:Array):void
		{
			super.source = null;
			
			if(s != null)
				for(var i:int = 0; i < s.length; i++)
					addItem( s[i] );
		}
		
		public function has(key:*):Boolean
		{
			return map.has(key);
		}
		public function set(key:*, val:Object):void
		{
			if(map.has(key) == false)
				addItem(val);
			else
				map.set(key, val);
		}
		override public function addItem(item:Object):void
		{
			if(item != null &&item.hasOwnProperty("key"))
				map[ item.key ] = item;
			super.addItem(item);
		}
		override public function addItemAt(item:Object, index:int):void
		{
			if(item != null && item.hasOwnProperty("key"))
				map[ item.key ] = item;
			super.addItemAt(item, index);
		}
		
		override public function removeAll():void
		{
			map = new Dictionary();
			super.removeAll();
		}
		override public function removeItemAt(index:int):Object
		{
			var obj:Object = super.removeItemAt(index);
			if(obj != null && obj.hasOwnProperty("key") && map.has(obj.key))
				delete map[obj.key];
			
			return obj;
		}
	}
}