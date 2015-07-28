package org.samchon.simulation.simulation.abstract.filetree
{
	import mx.events.FlexEvent;
	
	import org.samchon.fileTree.file.FTFile;
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.fileTree.window.FolderCreationWindow;
	
	import spark.components.Label;

	public class SMFileCreationWindow extends FolderCreationWindow
	{
		public var extension:String;
		public var content:String;
		
		public function SMFileCreationWindow()
		{
			super();
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			
			this.title = "To create a file";
			this.commentText.text = "File's name is:";
			createButton.setStyle("icon", "assets/icons/as16.gif");
			
			var label:Label = new Label();
			label.text = "." + extension;
			hGroup.addElement(label);
		}
		
		override protected function getFile():FTFolder
		{
			var file:FTFile;
			
			file = new FTFile
			(
				fileList,
				Global.NULL, 
				this.parentID, 
				nameText.text,
				extension,
				content
			);
			return file;
		}
	}
}