package org.samchon.protocol.invoke
{
	import flash.utils.ByteArray;
	
	import mx.utils.StringUtil;
	
	import org.samchon.protocol.entity.Entity;

	/**
	 * <p> Standard message of network I/O. </p>
	 *
	 * <p> Invoke is a class used in network I/O in protocol package of Samchon Framework.  </p>
	 *
	 * <p> The Invoke message has a XML structure like the result screen of provided example in below. 
	 * We can enjoy lots of benefits by the normalized and standardized message structure used in
	 * network I/O. </p>
	 *
	 * <p> The greatest advantage is that we can make any type of network system, even how the system 
	 * is enourmously complicated. As network communication message is standardized, we only need to
	 * concentrate on logical relationships between network systems. We can handle each network system 
	 * like a object (class) in OOD. And those relationships can be easily designed by using design
	 * pattern. </p>
	 *
	 * <p> In Samchon Framework, you can make any type of network system with basic 3 + 1 componenets
	 * (IProtocol, IServer and IClient + ServerConnector), by implemens or inherits them, like designing
	 * classes of S/W architecture. </p>
	 *
	 * <img src="invoke.png" />
	 *
	 * @author Jeongho Nam
	 */
	public class InvokeParameter
		extends Entity
	{
		/**
		 * parameter's name.
		 * 
		 * @default Can't be null
		 */
		private var name:String;
		
		/**
		 * parameter's type (like number, string, XML).
		 * 
		 * @default Can't be null
		 */
		private var type:String;
		
		/**
		 * value of a parameter.
		 * 
		 * @default null || int.MIN_VALUE
		 */
		private var value:*;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		/**
		 * <p> Constructors. </p>
		 * ---- InvokeParameter(xml:XML)<br/>
		 * ---- InvokeParameter(name:String, value:_Ty)<br/>
		 * ---- InvokeParameter(name:String, type:String, value:String)
		 */
		public function InvokeParameter(... args)
		{
			if(args.length == 1)
				construct(args[0]);
			else if(args[0] is String && args.length == 2)
			{
				this.name = args[0];
				
				if(args[1] is String)
					type = "string";
				else if(args[1] is Number || args[1] is int)
					type = "number";
				else if (args[1] is ByteArray)
					type = "ByteArray";
				else if (args[1] is XML)
					type = "XML";
				else
					type = "unknown";
				
				this.value = args[1];
			}				
			else if(args[0] is String && args.length == 3)
				constructByString(args[0], args[1], args[2]);
			
		}
		/**
		 * @private
		 */
		override public function construct(xml:XML):void
		{
			if (xml.hasOwnProperty("@name") == false)
				xml.@name = "";
			
			//BY SERVER (C++ -> FLEX)
			if (xml.@type == "XML")
			{
				constructByString(xml.@name, xml.@type, xml.children()[0]);
			}
			/*else if (xml.@type == "ByteArray")
			{
				constructByString( xml.@name, xml.@type, xml.toString() );
			}*/
			else
				constructByString( xml.@name, xml.@type, xml.toString() );
		}
		/**
		 * @private 
		 */
		private function constructByString(name:String, type:String, value:*):void
		{
			//BY CLIENT (FLEX -> C++)
			this.name = name;
			this.type = type;
			this.value = value;
		}
		
		/* ---------------------------------------------------------------------
			GETTERS
		--------------------------------------------------------------------- */
		public function getName():String	{	return name;	}
		public function getType():String	{	return type;	}
		public function getValue():*		{	return value;	}
		
		public function setValue(value:*):void
		{
			this.value = value;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTS
		--------------------------------------------------------------------- */
		override public function get TAG():String
		{
			return "parameter";
		}
		
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			
			if (name != "")
				xml.@name = name;
			
			xml.@type = type;
			
			if (this.type == "ByteArray")
				xml.setChildren(value.length);
			else
				xml.setChildren(value);
			
			return xml;
		}
	}
}