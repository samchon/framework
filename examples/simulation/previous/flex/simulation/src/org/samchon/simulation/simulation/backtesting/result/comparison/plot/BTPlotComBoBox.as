package org.samchon.simulation.simulation.backtesting.result.comparison.plot
{
	import mx.controls.ComboBox;
	import mx.events.ListEvent;
	
	
	public class BTPlotComBoBox extends ComboBox
	{
		public var dataField:String;
		
		public function BTPlotComBoBox()
		{
			super();
			
			this.addEventListener(ListEvent.CHANGE, handleChanged);
		}
		protected function handleChanged(event:ListEvent):void
		{
			var map:Object = this.data;
			map[dataField] = this.selectedIndex;
			
			this.data = map;
		}
		override public function set data(map:Object):void
		{
			super.data = map;
			if(map == null)
				return;
			else
				this.selectedIndex = map[dataField];
		}
	}
}