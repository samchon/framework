package org.samchon.fileTree.window.explorer
{
	import flash.events.MouseEvent;
	
	import mx.controls.Alert;
	import mx.events.ListEvent;
	
	import org.samchon.fileTree.file.FTFile;
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.socket.HTTPService;

	public class ExplorerSaveWindow extends ExplorerWindow
	{
		protected var httpService:HTTPService = new HTTPService(URL.FILETREE_CREATE);
		public var content:String;
		
		public function ExplorerSaveWindow()
		{
			super();
			this.title = "Save Manager";
		}
		override protected function handleFileChanged(event:ListEvent):void
		{
			super.handleFileChanged(event);
			var file:FTFolder = fileTreeMgr.selectedFile;
			
			if(file == null || file.getParent() == null || file is FTFile || file.getOwner() == "example")
				determineButton.enabled = false;
			else
				determineButton.enabled = true;
		}
		
		override protected function goDetermine(event:MouseEvent):void
		{
			var selectedFile:FTFolder = fileTreeMgr.selectedFile;
			if(selectedFile == null)
				return;
			else if( selectedFile is FTFile )
				Alert.show("Select a valid folder to put.", "File Creation Error");
			else if( selectedFile.getOwner() == "example" )
				Alert.show("You can't make a file under example's own.", "File Creation Error");
			else
			{
				var file:FTFile = new FTFile(fileList, Global.NULL, fileTreeMgr.selectedFile.getFileID(), nameInput.text, "xml", content, commentInput.text);
				var formData:Object = file.toFormData();
				formData.application = application;
				formData.category = category;
				
				httpService.send(formData);
				this.close();
			}
		}
	}
}