package samchon.library.filetree.file
{
	import samchon.protocol.entity.IEntity;
	import samchon.protocol.entity.IInvokeEntity;
	import samchon.protocol.invoke.Invoke;

	/**
	 * IFTFile is an interface for expressing tree-structure file and folders
	 */
	public interface IFTFile 
		extends IEntity, IInvokeEntity
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
		function getUID():int;
		function getParent():FTFolder;
		function getName():String;
		function getComment():String;
		
		//DERIVEDS
		function getPath():String;
		
		//FOR GRID
		function get $label():String;
	}
}