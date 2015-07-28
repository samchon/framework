package org.samchon.library.filetree
{
	import flash.utils.Dictionary;
	
	import org.samchon.library.filetree.file.BinaryFile;
	import org.samchon.library.filetree.file.FTFolder;
	import org.samchon.library.filetree.file.IFTFile;
	import org.samchon.library.filetree.file.TextFile;

	/**
	 * FTFactory takes a role of creating and managing IFTFile objects.<br>
	 */
	public class FTFactory
	{
		/**
		 * The root folder of IFTFile(s)<br>
		 * <br>
		 * @default FTFolder having user's own id 
		 */
		protected var topFolder:FTFolder;
		/**
		 * Some IFTFile(s) can't be referenced directly, because IFTFile(s) are composed hierarchically. 
		 * fileMap is made up to solve the problem. fileMap stores all the IFTFile(s)' key and pointer have created<br>
		 * <br>
		 * @default Dictionary<FTFile>
		 */ 
		protected var fileMap:Dictionary;
		
		public function FTFactory()
		{
			topFolder = new FTFolder(this, null);
			fileMap = new Dictionary();
		}
		public function createFile(parent:FTFolder, xml:XML):IFTFile
		{
			if(xml.hasOwnProperty("@extension") == false)
				return new FTFolder(this, parent);
			else if(xml.hasOwnProperty("@data") == true)
				return new TextFile(parent);
			else
				return new BinaryFile(parent);
		}
		
		public function hasFile(uid:int):Boolean
		{
			return fileMap.hasOwnProperty(uid);
		}
		public function getFile(uid:int):IFTFile
		{
			return fileMap[uid] as IFTFile;
		}
	}
}