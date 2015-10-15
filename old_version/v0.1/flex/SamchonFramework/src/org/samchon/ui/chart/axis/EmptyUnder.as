package org.samchon.ui.chart.axis
{
	import flash.globalization.NumberFormatter;
	
	import mx.controls.Label;
	import mx.core.IDataRenderer;
	
	public class EmptyUnder extends Label implements IDataRenderer
	{
		public function EmptyUnder()
		{
			super();
		}
		override public function get measuredHeight():Number {
			return 0;
		}
		override public function set data(value:Object):void {
			this.text = null;
		}
	}
}