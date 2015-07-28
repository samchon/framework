package org.samchon.simulation.simulation.retrieve.namtree.filetree.window
{
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import mx.managers.PopUpManager;
	
	import org.samchon.namtree.filetree.window.NTFileTypeDetermineWindow;
	
	public class RTFileTypeDetermineWindow extends NTFileTypeDetermineWindow
	{
		public function RTFileTypeDetermineWindow()
		{
			super();
		}
		
		override protected function buttonClicked(event:MouseEvent):void
		{
			var source:String = event.currentTarget.source;
			if(source == "namTree")
			{
				var creationWindow:RTFileCreationWindow = PopUpManager.createPopUp(Root.window, RTFileCreationWindow, true) as RTFileCreationWindow;
				
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