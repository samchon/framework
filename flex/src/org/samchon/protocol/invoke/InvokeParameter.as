package org.samchon.protocol.invoke
{
	import mx.utils.StringUtil;

	/**
	 * <code>InvokeParameter</code> is contained in <code>Invoke</code> and expresses a <i>parameter</i> in a <i>Invoke Message</i><br>
	 * <br>
	 * <b>Example message:</b><br>
	 * &lt;invoke listener="{$FUNC_NAME}"&gt;<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; &lt;parameter name="{$PARAM_NAME}" type="{$PARAM_TYPE}"&gt;{$VALUE}&lt;/parameter&gt;<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; &lt;parameter name="{$PARAM_NAME}" type="{$PARAM_TYPE}"&gt;{$VALUE}&lt;/parameter&gt;<br>
	 * &nbsp;&nbsp;&nbsp;&nbsp; ...<br>
	 * &lt;/invoke&gt;<br>
	 * <br>
	 * &lt;invoke /&gt; -&gt; class <code>Invoke</code><br>
	 * &lt;parameter /&gt; -&gt; class <code>InvokeParameter</code><br>
	 * <br>
	 * @see Invoke
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
		 * <b>Constructors</b><br>
		 * &nbsp;&nbsp;&nbsp;&nbsp; InvokeParameter(xml:XML)<br>
		 * &nbsp;&nbsp;&nbsp;&nbsp; InvokeParameter(name:String, value:_Ty)<br>
		 * &nbsp;&nbsp;&nbsp;&nbsp; InvokeParameter(name:String, type:String, value:String)
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