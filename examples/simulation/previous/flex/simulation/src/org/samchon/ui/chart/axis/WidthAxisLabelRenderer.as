package org.samchon.ui.chart.axis
{
	import org.samchon.format.Format;
	
	import mx.controls.Label;
	import mx.core.IDataRenderer;
	
	public class WidthAxisLabelRenderer extends Label implements IDataRenderer {
		public function WidthAxisLabelRenderer() {
			super();
		}
		public override function get measuredWidth():Number {
			return 80;
		}
		public override function set data(value:Object):void {
			var num:Number = Number(value.text);
			this.text = Format.numberFormat(num);
		}
	}
}