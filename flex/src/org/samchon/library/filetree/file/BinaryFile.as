package org.samchon.library.filetree.file
{
	import flash.utils.ByteArray;
	
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;

	public class BinaryFile extends FTFile
	{
		//TAG
		override public function get LISTENER():String { return "mergeBinaryFile"; }
		
		//VARIABLE
		protected var data:ByteArray;
		
		//CONSTRUCTOR
		public function BinaryFile(parent:FTFolder)
		{
			super(parent);
			
			data = null;
		}
		
		//ACCESSORS
		public function getData():ByteArray
		{
			return data;
		}
		public function setData(val:ByteArray):void
		{
			this.data = val;
		}
	}
}