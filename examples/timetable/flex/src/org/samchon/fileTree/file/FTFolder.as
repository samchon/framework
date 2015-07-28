package org.samchon.fileTree.file
{
	import mx.collections.ArrayList;
	import mx.controls.Alert;
	
	import org.samchon.utils.HTML;
	import org.samchon.utils.StringUtil;

	public class FTFolder extends ArrayList
	{
		public var fileList:FTFileList;
		
		protected var fileID:int;
		protected var parentID:int;
		protected var name:String;
		
		protected function get parent():FTFolder
		{
			return fileList.getItemByFID( parentID );
		}
		
		public function getParent():FTFolder	{	return this.parent;		}
		public function getFileID():int			{	return this.fileID;		}
		public function getParentID():int		{	return this.parentID;	}
		public function getName():String		{	return this.name;		}
		
		public function setFileID(id:int):void		{	this.fileID = id;	}
		public function setName(name:String):void	{	this.name = name;	}
		
		public function getLabel():String	{	return this.name;														}
		public function getPath():String	{	return (parent == null) ? getLabel() : parent.getPath()+"/"+getLabel();	}
		public function getChildren():Array	{	return this.source;														}
		public function getOwner():String	{	return (parent == null) ? name : parent.getOwner();						}
		
		public function get label():String		{	return this.getLabel();		}
		public function get children():Array	{	return this.getChildren();	}
		
		public function FTFolder(fileList:FTFileList, fileID:int, parentID:int, name:String)
		{
			super();
			
			this.fileList = fileList
			
			this.fileID = fileID;
			this.parentID = parentID;
			this.name = name;
			//this.extension = extension;
			//this.content = content;
		}
		public override function addItem(item:Object):void
		{
			var file:FTFolder = item as FTFolder;
			
			super.addItem(file);
		}
		public function getFileAt(x:int):FTFolder
		{
			return this.getItemAt(x) as FTFolder;
		}
		
		public function toFormData():Object
		{
			var formData:Object = new Object();
			if(this.fileID != Global.NULL)
				formData.fileID = this.fileID;
			formData.parentID = this.parentID;
			formData.name = this.name;
			//if(this.extension != null)	formData.extension = this.extension;
			//if(this.content != null)	formData.content = this.content;
			
			return formData;
		}
	}
}