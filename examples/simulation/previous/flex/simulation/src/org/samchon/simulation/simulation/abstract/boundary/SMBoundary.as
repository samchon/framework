package org.samchon.simulation.simulation.abstract.boundary
{
	import flash.events.MouseEvent;
	
	import mx.events.FlexEvent;
	import mx.managers.PopUpManager;
	
	import org.samchon.fileTree.window.explorer.ExplorerOpenWindow;
	import org.samchon.fileTree.window.explorer.ExplorerSaveWindow;
	import org.samchon.fileTree.window.explorer.ExplorerWindow;
	import org.samchon.ui.HGroup;
	
	public class SMBoundary extends HGroup
	{
		protected function get application():int	{	return Root.application;	}
		protected function get category():int		{	return Root.category;		}
		
		public function SMBoundary()
		{
			super();
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		
		public function goCompile():Boolean
		{
			return true;
		}
		
		/* ----------------------------------------------------------------
			FILE HANDLER
		---------------------------------------------------------------- */
		protected function get parentObject():*	{	return null;	}
		protected function get content():String	{	return "";		}
		
		public function goNewFile(event:MouseEvent):void
		{
			//FOR OVERRIDING
		}
		public function goOpenFile(event:MouseEvent):void
		{
			var openWindow:ExplorerOpenWindow = PopUpManager.createPopUp(Root.window, ExplorerOpenWindow, true) as ExplorerOpenWindow;
			openWindow.parentObject = parentObject;
			openWindow.application = application;
			openWindow.category = category;
			
			PopUpManager.centerPopUp( openWindow );
		}
		public function goSaveFile(event:MouseEvent):void
		{
			var saveWindow:ExplorerSaveWindow = PopUpManager.createPopUp(Root.window, ExplorerSaveWindow, true) as ExplorerSaveWindow;
			saveWindow.application = Root.application;
			saveWindow.category = Root.category + 30;
			saveWindow.content = content;
			
			PopUpManager.centerPopUp( saveWindow );
		}
	}
}