package org.samchon.ui
{
	import mx.events.FlexMouseEvent;
	import mx.managers.PopUpManager;
	
	import spark.components.BorderContainer;
	
	public class BorderContainerWindow extends BorderContainer
	{
		public var closeWhenReleaseOutside:Boolean = true;
		
		public function BorderContainerWindow()
		{
			super();
			
			this.setStyle("dropShadowVisible", true);
			this.addEventListener(FlexMouseEvent.MOUSE_DOWN_OUTSIDE, handleMouseDownOutside);
		}
		public function close():void
		{
			PopUpManager.removePopUp( this );
		}
		
		protected function handleMouseDownOutside(event:FlexMouseEvent):void
		{
			if(closeWhenReleaseOutside == true)
				this.close();
		}
	}
}