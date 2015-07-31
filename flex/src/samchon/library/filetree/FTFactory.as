package samchon.library.filetree
{
	import flash.utils.Dictionary;
	
	import samchon.library.filetree.file.BinaryFile;
	import samchon.library.filetree.file.FTFolder;
	import samchon.library.filetree.file.IFTFile;
	import samchon.library.filetree.file.TextFile;

	/**
	 * <p>FTFactory takes a role of creating and managing IFTFile objects.</p>
	 */
	public class FTFactory
	{
		/**
		 * <p>The root folder of IFTFile(s)</p>
		 * 
		 * @default FTFolder having user's own id 
		 */
		protected var topFolder:FTFolder;
		/**
		 * <p>Some IFTFile(s) can't be referenced directly, because IFTFile(s) are composed hierarchically.</p>
		 * <p>fileMap is made up to solve the problem. fileMap stores all the IFTFile(s)' key and pointer have created</p>
		 * 
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