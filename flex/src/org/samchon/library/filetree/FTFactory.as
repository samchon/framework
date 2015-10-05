package org.samchon.library.filetree
{
	import flash.utils.Dictionary;
	
	import org.samchon.library.filetree.file.BinaryFile;
	import org.samchon.library.filetree.file.FTFile;
	import org.samchon.library.filetree.file.FTFolder;
	import org.samchon.library.filetree.file.IFTFile;
	import org.samchon.library.filetree.file.TextFile;

	/**
	 * <p> A Factory and manager for file-tree. </p>
	 *
	 * <p> FTFactory is a class taking a role of creating FTFile instances and managing
	 * them by having their direct pointers. FTFactory also has a role of archiving and
	 * loading from DB. </p>
	 *
	 * <img src="file/file_tree.png" />
	 *
	 * @author Jeongho Nam
	 */
	public class FTFactory
	{
		/**
		 * <p>The root folder of file instances.</p>
		 * 
		 * @default FTFolder having user's own id 
		 */
		protected var topFolder:FTFolder;
		
		/**
		 * <p>Some IFTFile(s) can't be referenced directly, because IFTFile(s) are composed hierarchically.</p>
		 * <p>fileMap is made up to solve the problem. fileMap stores all the IFTFile(s)' key and pointer have created.</p>
		 * 
		 * @default Dictionary<FTFile>
		 */ 
		protected var fileMap:Dictionary;
		
		/**
		 * <p> Default Constructor. </p>
		 */
		public function FTFactory()
		{
			topFolder = new FTFolder(this, null);
			fileMap = new Dictionary();
		}
		
		/**
		 * <p> Factory method of a file </p>
		 * 
		 * @param parent A parent folder to contain the new file 
		 * @param xml An xml object for discriminating sub-type.
		 */
		public function createFile(parent:FTFolder, xml:XML):FTFile
		{
			return null;
		}
		
		public function hasFile(uid:int):Boolean
		{
			return fileMap.hasOwnProperty(uid);
		}
		public function getFile(uid:int):IFTFile
		{
			return fileMap[uid] as IFTFile;
		}
		
		/**
		 * <p> Register file instance to map </p>
		 */
		public function registerFile(file:IFTFile):void
		{
			this.fileMap[file.getUID()] = file;
		}
	}
}