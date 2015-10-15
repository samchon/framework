package org.samchon.library.filetree.file
{
	import flash.utils.ByteArray;
	
	import org.samchon.protocol.invoke.Invoke;
	import org.samchon.protocol.invoke.InvokeParameter;

	/**
	 * <p> A binary file. </p>
	 * <p> A file having data as binary. </p>
	 *
	 * <img src="file_tree.png" />
	 * 
	 * @author Jeongho Nam
	 */
	public class BinaryFile extends FTFile
	{
		//TAG
		override public function get LISTENER():String { return "mergeBinaryFile"; }
		
		/**
		 * <p> Binary data of the file </p>
		 */
		protected var data:ByteArray;
		
		/**
		 * @copy FTFile.FTFile()
		 */
		public function BinaryFile(parent:FTFolder)
		{
			super(parent);
			
			data = null;
		}
		
		//ACCESSORS
		/**
		 * <p> Get binary data of the file. </p>
		 */
		public function getData():ByteArray
		{
			return data;
		}
		
		/**
		 * <p> Set binary data. </p>
		 */
		public function setData(val:ByteArray):void
		{
			this.data = val;
		}
	}
}