package samchon.library.ui
{
	import flash.events.MouseEvent;
	
	import mx.events.CloseEvent;
	import mx.managers.PopUpManager;
	
	import spark.components.TitleWindow;
	
	public class TitleWindow 
		extends spark.components.TitleWindow
	{
		public function TitleWindow()
		{
			super();
		}
		override protected function closeButton_clickHandler(event:MouseEvent):void
		{
			this.close();
		}
		
		public function close():void
		{
			PopUpManager.removePopUp(this);
		}
	}
}