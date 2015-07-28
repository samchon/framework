package org.samchon.simulation.simulation.backtesting.boundary.namtree.filetree.window
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import mx.managers.PopUpManager;
	
	import org.samchon.namtree.filetree.window.NTFileTypeDetermineWindow;
	
	public class BTFileTypeDetermineWindow extends NTFileTypeDetermineWindow
	{
		public function BTFileTypeDetermineWindow()
		{
			super();
		}
		
		override protected function buttonClicked(event:MouseEvent):void
		{
			var source:String = event.currentTarget.source;
			if(source == "namTree")
			{
				var creationWindow:BTFileCreationWindow = PopUpManager.createPopUp(Root.window, BTFileCreationWindow, true) as BTFileCreationWindow;
				
				creationWindow.fileList = this.fileList;
				creationWindow.parentFile = this.parentFile;
				creationWindow.addEventListener(Event.COMPLETE, completeHandler);
				
				PopUpManager.removePopUp( this );
			}
			else
				super.buttonClicked(event);
		}
	}
}