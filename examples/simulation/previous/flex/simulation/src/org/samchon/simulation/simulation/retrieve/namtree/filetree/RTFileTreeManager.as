package org.samchon.simulation.simulation.retrieve.namtree.filetree
{
	import mx.events.ListEvent;
	import mx.managers.PopUpManager;
	
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.namtree.filetree.NTFileTreeManager;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.file.RTFile;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.window.RTFileCreationWindow;
	import org.samchon.simulation.simulation.retrieve.namtree.filetree.window.RTFileTypeDetermineWindow;
	
	public class RTFileTreeManager extends NTFileTreeManager
	{
		public function RTFileTreeManager()
		{
			super();
		}
		
		override protected function get FileCreationWindow():Class
		{
			return RTFileTypeDetermineWindow;
		}
		override protected function handleDoubleClick(event:ListEvent):void
		{
			var file:FTFolder = tree.selectedFile;
			
			if(file is RTFile)
			{
				var creationWindow:RTFileCreationWindow = PopUpManager.createPopUp(Root.window, RTFileCreationWindow, true) as RTFileCreationWindow;
				creationWindow.fileList = fileList;
				creationWindow.parentFile = tree.selectedFile;
				PopUpManager.centerPopUp( creationWindow );
			}
			else
				super.handleDoubleClick(event);
		}
	}
}