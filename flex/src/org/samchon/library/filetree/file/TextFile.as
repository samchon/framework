package org.samchon.library.filetree.file
{
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;

	/**
	 * <p> A text file. </p>
	 * <p> A file having data as text. </p>
	 *
	 * <img src="file_tree.png" />
	 * 
	 * @author Jeongho Nam
	 */
	public class TextFile extends FTFile
	{
		//TAG
		override public function get LISTENER():String 
		{ 
			return "mergeTextFile"; 
		}
		
		//VARIABLE
		/**
		 * <p> Text data recorded in the file. </p>
		 */
		protected var data:String;
		
		/* ------------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------------ */
		/**
		 * @copy FTFile.FTFile()
		 */
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
		/**
		 * <p> Get text data of the file. </p>
		 */
		public function getData():String
		{
			return data;
		}
		
		/**
		 * <p> Set text data. </p>
		 */
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