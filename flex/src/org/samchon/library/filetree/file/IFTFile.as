package org.samchon.library.filetree.file
{
	import org.samchon.protocol.entity.IEntity;
	import org.samchon.protocol.invoke.Invoke;

	/**
	 * IFTFile is an interface for expressing tree-structure file and folders
	 */
	public interface IFTFile 
		extends IEntity
	{
		/* -----------------------------------------------
			VARIABLES
		-------------------------------------------------- 
		protected var parent:FTFolder;
		
		protected var uid:int; //PK
		protected var name:String;
		protected var comment:String;
		
		UK: (parent + name)
		FK: parent
		----------------------------------------------- */
		
		/* -----------------------------------------------
			GETTERS
		----------------------------------------------- */
		/**
		 * <p> Get uid. </p>
		 */
		function getUID():int;
		
		/**
		 * <p> Get parent folder. </p>
		 */
		function getParent():FTFolder;
		
		/**
		 * <p> Get name. </p>
		 */
		function getName():String;
		
		/**
		 * <p> Get comment. </p>
		 */
		function getComment():String;
		
		//DERIVEDS
		/**
		 * <p> Get full-path of the file. </p>
		 */
		function getPath():String;
		
		//FOR GRID
		/**
		 * <p> Get a label printed in file-tree grid. </p>
		 */
		function get $label():String;
	}
}