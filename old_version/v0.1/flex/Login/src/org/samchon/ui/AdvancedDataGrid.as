package org.samchon.ui
{
	import mx.controls.AdvancedDataGrid;
	import mx.events.DragEvent;
	
	public class AdvancedDataGrid extends mx.controls.AdvancedDataGrid
	{
		public function AdvancedDataGrid()
		{
			super();
		}
		protected override function dragCompleteHandler(event:DragEvent):void {
			return;
		}
	}
}