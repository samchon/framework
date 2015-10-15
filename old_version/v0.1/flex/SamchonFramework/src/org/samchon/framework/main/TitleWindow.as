package org.samchon.framework.main
{
	import mx.events.FlexEvent;
	import mx.managers.PopUpManager;
	
	import org.samchon.framework.invoke.IInvoke;
	import org.samchon.framework.invoke.Invoke;
	import org.samchon.ui.TitleWindow;
	
	public class TitleWindow extends org.samchon.ui.TitleWindow implements IInvoke
	{
		protected var window:Window;
		
		protected var creationFlag:Boolean = false;
		
		//CONSTRUCTION
		public function TitleWindow(window:Window = null)
		{
			super();
			
			this.window = window;
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			creationFlag = true;
		}
		
		//SOCKET
		public function replyData(invoke:Invoke):void
		{
			
		}
		public function sendData(invoke:Invoke):void
		{
			window.sendData(invoke);
		}
		
		//CREATOR
		public static function createPopUp(window:Window, $class:Class):org.samchon.framework.main.TitleWindow
		{
			var popUp:org.samchon.framework.main.TitleWindow = PopUpManager.createPopUp(window, $class, true) as org.samchon.framework.main.TitleWindow;
			popUp.window = window;
			PopUpManager.centerPopUp(popUp);
			
			return popUp;
		}
	}
}