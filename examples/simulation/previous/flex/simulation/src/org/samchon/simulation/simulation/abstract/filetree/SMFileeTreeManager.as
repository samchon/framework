package org.samchon.simulation.simulation.abstract.filetree
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import mx.events.ListEvent;
	import mx.managers.PopUpManager;
	
	import org.samchon.fileTree.FileTreeManager;
	import org.samchon.fileTree.window.FTCreationWindow;
	import org.samchon.fileTree.window.FolderCreationWindow;
	
	public class SMFileeTreeManager extends FileTreeManager
	{
		public var extension:String;
		public var content:String;
		
		public function SMFileeTreeManager()
		{
			super();
		}
		
		override protected function get FileCreationWindow():Class	{	return SMFileCreationWindow;	}
		override protected function handleDoubleClick(event:ListEvent):void
		{
			//DO NOTHING
		}
		
		public function goNewFile(event:MouseEvent):void
		{
			createWindow(this.FILE);
		}
		override protected function createWindow(type:String):void
		{
			//TARGET VIRTUAL
			if( checkCreatable(type) == false )
				return;
			
			var creationWindow:FTCreationWindow;
			if(type == FOLDER)
				creationWindow = PopUpManager.createPopUp(Root.window, FolderCreationWindow, true) as FTCreationWindow;
			else if(type == FILE)
			{
				creationWindow = PopUpManager.createPopUp(Root.window, SMFileCreationWindow, true) as FTCreationWindow;
				SMFileCreationWindow(creationWindow).extension = this.extension;
				SMFileCreationWindow(creationWindow).content = this.content;
			}
			
			//OPEN WINDOW
			creationWindow.fileList = fileList;
			creationWindow.parentFile = tree.selectedFile;
			creationWindow.addEventListener(Event.COMPLETE, handleFileCreationCompleted);
			
			PopUpManager.centerPopUp( creationWindow );
		}
	}
}