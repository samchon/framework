package org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree
{
	import mx.events.ListEvent;
	import mx.managers.PopUpManager;
	
	import org.samchon.fileTree.file.FTFolder;
	import org.samchon.namtree.filetree.NTFileTreeManager;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.file.BTFile;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.window.BTFileCreationWindow;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.window.BTFileTypeDetermineWindow;

	public class BTFileTreeManager extends NTFileTreeManager
	{
		public function BTFileTreeManager()
		{
			super();
		}
		
		override protected function get FileCreationWindow():Class
		{
			return BTFileTypeDetermineWindow;
		}
		override protected function handleDoubleClick(event:ListEvent):void
		{
			var file:FTFolder = tree.selectedFile;
			
			if(file is BTFile)
			{
				var creationWindow:BTFileCreationWindow = PopUpManager.createPopUp(Root.window, BTFileCreationWindow, true) as BTFileCreationWindow;
				creationWindow.fileList = fileList;
				creationWindow.parentFile = tree.selectedFile;
				PopUpManager.centerPopUp( creationWindow );
			}
			else
				super.handleDoubleClick(event);
		}
	}
}