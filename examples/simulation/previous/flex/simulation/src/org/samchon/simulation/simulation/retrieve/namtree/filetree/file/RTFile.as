package org.samchon.simulation.simulation.retrieve.namtree.filetree.file
{
	import mx.controls.Alert;
	
	import org.samchon.fileTree.file.FTFileList;
	import org.samchon.namtree.filetree.file.NTFile;
	
	public class RTFile extends NTFile
	{
		public var priceLength:int = 0;
		public var indexLength:int = 0;
		
		public function RTFile
			(
				fileList:FTFileList, 
				fileID:int, 
				parentID:int, 
				name:String = "", 
				priceLength:int = 0,
				indexLength:int = 0,
				header:String="", 
				getFunction:String="", 
				composerFunction:String="", 
				returnType:String="Number",
				otherside:int = Global.NULL
			)
		{
			super(fileList, fileID, parentID, name, header, getFunction, composerFunction, returnType, otherside);
			
			this.priceLength = priceLength;
			this.indexLength = indexLength;
		}
		override public function toFormData():Object
		{
			var formData:Object = super.toFormData();
			formData.priceLength = this.priceLength;
			formData.indexLength = this.indexLength;
			
			return formData;
		}
	}
}