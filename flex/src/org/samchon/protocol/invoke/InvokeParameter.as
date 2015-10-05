package org.samchon.protocol.invoke
{
	import mx.utils.StringUtil;

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
	{
		/**
		 * parameter's name
		 * @default Can't be null
		 */
		private var name:String;
		/**
		 * parameter's type (like int, Number, String, XML)
		 * @default Can't be null
		 */
		private var type:String;
		/**
		 * value of a parameter
		 * @default null || int.MIN_VALUE
		 */
		private var value:*;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		/**
		 * <b>Constructors</b><br/>
		 * ---- InvokeParameter(xml:XML)<br/>
		 * ---- InvokeParameter(name:String, value:_Ty)<br/>
		 * ---- InvokeParameter(name:String, type:String, value:String)
		 */
		public function InvokeParameter(... args)
		{
			if(args.length == 1)
				constructByXML(args[0]);
			else if(args[0] is String && args.length == 2)
			{
				if(args[1] is String)
					constructByString(args[0], "String", args[1]);
				else if(args[1] is Number)
					constructByString(args[0], "double", args[1]);
				else if(args[1] is int)
					constructByString(args[0], "int", args[1]);
			}				
			else if(args[0] is String && args.length == 3)
				constructByString(args[0], args[1], args[2]);
			
		}
		/**
		 * @private
		 */
		private function constructByXML(xml:XML):void
		{
			//BY SERVER (C++ -> FLEX)
			if(xml.@type == "xml")
				constructByString( xml.@name, xml.@type, xml.children() );
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
		
		/* ---------------------------------------------------------------------
			EXPORTS
		--------------------------------------------------------------------- */
		/**
		 * Convert current InvokeParameter to XML
		 * @return XML expressing parameter
		 */
		public function toXML():XML
		{
			var xml:XML = new XML("<parameter />");
			xml.@name = name;
			xml.@type = type;
			xml.setChildren(value);
			
			return xml;
		}
	}
}