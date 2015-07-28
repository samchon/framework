package org.samchon.simulation.menu
{
	import mx.events.FlexEvent;

	public class RetrieveMenu extends InquiryMenu
	{
		public function RetrieveMenu()
		{
			super();
			
			//TO POP EXPORTS
			this.addEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
		}
		protected function creationCompleted(event:FlexEvent):void
		{
			this.removeEventListener(FlexEvent.CREATION_COMPLETE, creationCompleted);
			
			this.removeElementAt(1);
		}
	}
}