package org.samchon.protocol.invoke
{
	import mx.collections.ArrayList;
	
	import org.samchon.library.container.IDictionary;
	
	/**
	 * <code>Invoke</code> class is a container set of InvokeParameter and supports conversion to <i>Invoke Message</i><br>
	 * <br>
	 * The <i>Invoke Message</i> is a standard messsage for Network I/O in Samchon Framework <u>expressing <b>function</b></u><br>
	 * It's based on XML and have the structure like the example<br>
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
	 * @see IProtocol
	 * @see InvokeParameter
	 */
	public class Invoke 
		extends ArrayList//ArrayList<InvokeParameter>
		implements IDictionary
	{
		/**
		 * The identifier of Invoke message<br>
		 * It's like a name of a function<br>
		 * <br>
		 * &lt;invoke listener="{<code>listener</code>}" /&gt;
		 * @default Can't be null
		 */ 
		private var listener:String;
		
		/* ---------------------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------------------- */
		/**
		 * <b>Constructors</b><br>
		 * &nbsp;&nbsp;&nbsp;&nbsp;Invoke(listener:String)<br>
		 * &nbsp;&nbsp;&nbsp;&nbsp;Invoke(xml:XML)<br>
		 */ 
		public function Invoke(val:*)
		{
			super();
			
			if(val is String)
				this.listener = val;
			else
				construct(val);
		}
		
		/**
		 * @private
		 */ 
		private function construct(xml:XML):void
		{
			this.listener = xml.@listener;
			if(xml.hasOwnProperty("parameter") == false)
				return;
			
			var xmlList:XMLList = xml.parameter;
			for(var i:int = 0; i < xmlList.length(); i++)
				addItem( new InvokeParameter(xmlList[i] as XML) );
		}
		
		/* ---------------------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------------------- */
		public function getListener():String
		{
			return listener;
		}
		public function setListener(val:String):void
		{
			this.listener = val;
		}
		
		//ELEMENT ACCESSORS
		/**
		 * Get the <code>InvokeParameter</code> at specified index
		 * 
		 * @param index the index in the <code>Invoke</code> from which to retrieve the <code>InvokeParameter</code>
		 * @return the <code>InvokeParameter</code> at that index
		 * @throws RangeError if the index < 0 or index >= length
		 */
		public function at(index:int):InvokeParameter
		{
			return getItemAt(index) as InvokeParameter;
		}
		
		/**
		 * Access the <code>InvokeParameter</code> by specified identifier(parameter's name)
		 * 
		 * @param key the identifier of the <code>InvokeParameter</code> wants to access 
		 * @return The <code>InvokeParameter</code> having the key, or null if there is none.
		 */
		public function get(key:*):InvokeParameter
		{
			for(var i:int = 0; i < length; i++)
				if(at(i).getName() == key)
					return at(i);
			
			return null;
		}
		
		//CHECKERS
		public function has(key:*):Boolean
		{
			for(var i:int = 0; i < length; i++)
				if(at(i).getName() == key)
					return true;
			
			return false;
		}
		
		//MODIFIERS
		public function erase(key:*):Boolean
		{
			for(var i:int = length - 1; i >= 0; i--)
				if(at(i).getName() == key)
				{
					removeItemAt(i);
					return true;
				}
			return false;
		}
		
		/* ---------------------------------------------------------------------
			EXPORTS
		--------------------------------------------------------------------- */
		/**
		 * @return XML expressing Invoke message's structure
		 */
		public function toXML():XML
		{
			var xml:XML = new XML("<invoke />");
			xml.@listener = listener;
			
			var xmlList:XMLList = new XMLList();
			for(var i:int = 0; i < length; i++)
				xmlList[i] = at(i).toXML();
			
			xml.setChildren(xmlList);
			return xml;
		}
	}
}