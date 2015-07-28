package org.samchon.fileTree.file
{
	public class FTFile extends FTFolder
	{
		protected var extension:String;
		protected var content:String;
		protected var comment:String;
		
		public function FTFile(fileList:FTFileList, fileID:int, parentID:int, name:String, extension:String, content:String = null, comment:String = null)
		{
			super(fileList, fileID, parentID, name);
			this.extension = extension;
			this.content = content;
			this.comment = comment;
		}
		override public function toFormData():Object
		{
			var formData:Object = super.toFormData();
			formData.extension = this.extension;
			formData.content = this.content;
			if(comment != null)	formData.comment = this.comment;
			
			return formData;
		}
		
		override public function getLabel():String
		{
			return super.getLabel() + "." + extension;
		}
		public function getComment():String
		{
			return this.comment;
		}		
		override public function getChildren():Array
		{
			return null;
		}
		
		public function getContent():String
		{
			return this.content;
		}
		public function setContent(val:String):void
		{
			this.content = val;
		}
	}
}