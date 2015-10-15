package org.samchon.framework.invoke
{
	import mx.utils.StringUtil;

	public class InvokeParameter
	{
		protected var name:String;
		protected var type:String;
		protected var value:*;
		
		public function InvokeParameter(... args)
		{
			if(args[0] is String)
				constructByString(args[0], args[1], args[2]);
			else if(args.length == 1)
				constructByXML(args[0]);
		}
		protected function constructByString(name:String, type:String, value:*):void
		{
			//BY CLIENT (FLEX -> C++)
			this.name = name;
			this.type = type;
			this.value = value;
		}
		protected function constructByXML(xml:XML):void
		{
			//BY SERVER (C++ -> FLEX)
			if(xml.@type == "xml")
				constructByString( xml.@name, xml.@type, xml.children() );
			else
				constructByString( xml.@name, xml.@type, xml.toString() );
		}
		
		public function getName():String	{	return name;	}
		public function getType():String	{	return type;	}
		public function getValue():*		{	return value;	}
		
		public function setValue(val:*):void
		{
			this.value = val;
		}
		
		public function toXML():String
		{
			return StringUtil.substitute
					(
						"<parameter name='{0}' type='{1}'>{2}</parameter>", 
						name, type, 
						(value is XML) ? (value as XML).toXMLString() : value//((type == "string") ? encodeURIComponent(value) : value)
					);
		}
	}
}