package org.samchon.simulation.menu
{
	import mx.events.FlexEvent;

	public class SMDetailMenu extends InquiryMenu
	{
		public function SMDetailMenu()
		{
			super();
			
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			
			mainGroup.removeElement( newSameWindowButton );
			this.selectedIndex = 1;
		}
	}
}