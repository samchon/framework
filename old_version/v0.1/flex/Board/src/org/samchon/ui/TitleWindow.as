package org.samchon.ui
{
	import flash.events.MouseEvent;
	
	import mx.core.IFlexDisplayObject;
	import mx.managers.PopUpManager;
	
	import spark.components.TitleWindow;
	
	public class TitleWindow extends spark.components.TitleWindow
	{
		public function TitleWindow()
		{
			super();
		}
		public function close():void
		{
			PopUpManager.removePopUp( this );
		}
		
		protected function setSizePercent(parentWindow:Object, widthPercent:Number, heightPercent:Number):void
		{
			this.width = parentWindow.width * widthPercent;
			this.height = parentWindow.height * heightPercent;
			
			moveToCenter(parentWindow);
		}
		protected function moveToCenter(parentWindow:Object):void
		{
			this.x = (parentWindow.width - this.width) / 2;
			this.y = (parentWindow.height - this.height) / 2;
		}
		protected override function closeButton_clickHandler(event:MouseEvent):void
		{
			this.close();
		}
	}
}