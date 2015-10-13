package org.samchon.fileTree.window.explorer
{
	import flash.events.MouseEvent;
	
	import mx.controls.Alert;
	import mx.events.FlexEvent;
	import mx.events.ListEvent;
	
	import org.samchon.fileTree.file.FTFile;
	import org.samchon.fileTree.file.FTFolder;

	public class ExplorerOpenWindow extends ExplorerWindow
	{
		public var parentObject:*;
		
		public function ExplorerOpenWindow()
		{
			super();
			this.title = "Open Manager";
		}
		override protected function creationCompleted(event:FlexEvent):void
		{
			super.creationCompleted(event);
			
			nameInput.editable = false;
			commentInput.editable = false;
		}
		override protected function handleFileChanged(event:ListEvent):void
		{
			super.handleFileChanged(event);
			var selectedFile:FTFolder = fileTreeMgr.selectedFile;
			
			nameInput.text = selectedFile.getLabel();
			if(selectedFile is FTFile)
			{
				commentInput.text = FTFile(selectedFile).getComment();
				determineButton.enabled = true;
			}
			else
			{
				commentInput.text = "";
				determineButton.enabled = false;
			}
		}
		override protected function goDetermine(event:MouseEvent):void
		{
			var selectedFile:FTFolder = fileTreeMgr.selectedFile;
			if(selectedFile == null)
				return;
			else if( !(selectedFile is FTFile) )
				Alert.show("Select a valid file to load.", "File Load Error");
			else
			{
				var xml:XML = new XML( FTFile(selectedFile).getContent() );
				constructXML(xml);
				
				this.close();
			}
		}
		protected function constructXML(xml:XML):void
		{
			parentObject.constructXML(xml);
		}
	}
}