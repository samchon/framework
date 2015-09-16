package org.samchon.container
{
	import mx.collections.ArrayCollection;
	
	public class ArrayMap extends ArrayCollection
	{
		//extends ArrayCollection
		//extends Dictionary
		
		protected var map:Dictionary;
		
		public function ArrayMap(source:Array=null)
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
		
		//public function at(x:int):T
		//public function get(key:String):T
		
		public function getKey(val:Object):*
		{
			//METHOD FOR IMPLEMENTATION
			return "";
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
			map[ getKey(item) ] = item;
			super.addItem(item);
		}
		override public function addItemAt(item:Object, index:int):void
		{
			map[ getKey(item) ] = item;
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
			delete map[obj.getKey()]
			
			return obj;
		}
	}
}