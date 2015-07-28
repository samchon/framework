package org.samchon.library.filetree.file
{
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;

	public class TextFile extends FTFile
	{
		//TAG
		override public function get LISTENER():String 
		{ 
			return "mergeTextFile"; 
		}
		
		//VARIABLE
		protected var data:String;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------------ */
		public function TextFile(parent:FTFolder)
		{
			super(parent);
			
			this.data = null;
		}
		override public function construct(xml:XML):void
		{
			super.construct(xml);
			
			if(xml.hasOwnProperty("@data"))
				data = xml.@data;
		}
		
		/* ------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------ */
		public function getData():String
		{
			return data;
		}
		public function setData(val:String):void
		{
			this.data = val;
		}
		
		/* ------------------------------------------------------------
			EXPORTS
		------------------------------------------------------------ */
		override public function toXML():XML
		{
			var xml:XML = super.toXML();
			xml.@data = data;
			
			return xml;
		}
		override public function toInvoke():Invoke
		{
			var invoke:Invoke = super.toInvoke();
			invoke.setListener("mergeTextFile");
			
			invoke.addItem( new InvokeParameter("data", data) );
			
			return invoke;
		}
	}
}