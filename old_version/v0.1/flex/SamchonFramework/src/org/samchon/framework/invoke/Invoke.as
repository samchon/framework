package org.samchon.framework.invoke
{
	import flash.utils.Dictionary;
	
	import mx.collections.ArrayCollection;
	import mx.utils.StringUtil;

	dynamic public class Invoke extends ArrayCollection
	{
		protected var map:Dictionary = new Dictionary();
		protected var listener:String;
		
		public function Invoke(val:*)
		{
			super();
			
			if(val is String)
				constructByString(val);
			else if(val is XML)
				constructByXML(val);
		}
		protected function constructByString(listener:String):void
		{
			this.listener = listener;
		}
		protected function constructByXML(xml:XML):void
		{
			this.listener = xml.@listener;
			if(xml.hasOwnProperty("parameter") == false)
				return;
			
			var xmlList:XMLList = xml.parameter;
			for(var i:int = 0; i < xmlList.length(); i++)
				addItem( new InvokeParameter(xmlList[i] as XML) );
		}
		
		//GETTER
		public function at(x:int):InvokeParameter
		{
			return getItemAt(x) as InvokeParameter;
		}
		public function get(key:String):InvokeParameter
		{
			return map[key] as InvokeParameter;
		}
		public function getListener():String
		{
			return listener;
		}
		
		//SETTER
		public function setListener(val:String):void
		{
			this.listener = val;
		}
		public function addParameter(name:String, type:String, value:*):void
		{
			addItem(new InvokeParameter(name, type, value));
		}
		override public function addItem(item:Object):void
		{
			map[item.getName()] = item;
			super.addItem(item);
		}
		override public function removeItemAt(index:int):Object
		{
			delete map[ at(index).getName() ] ;
			return super.removeItemAt(index);
		}
		override public function removeAll():void
		{
			map = new Dictionary();
			super.removeAll();
		}
		
		//CONVERTER
		public function toXML():String
		{
			var xml:String = StringUtil.substitute("<invoke listener='{0}'>", listener) + "\n";
			for(var i:int = 0; i < this.length; i++)
				xml += "\t" + at(i).toXML() + "\n";
			xml += "</invoke>";
			
			return xml.toString();
		}
	}
}