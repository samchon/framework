package org.samchon.ui.axis
{
	import org.samchon.format.Format;
	
	import mx.controls.Label;
	import mx.core.IDataRenderer;
	
	public class WidthAxisRendererPercent extends Label implements IDataRenderer {
		public function WidthAxisRendererPercent() {
			super();
		}
		public override function get measuredWidth():Number {
			return 70;
		}
		public override function set data(value:Object):void {
			super.data = value;
			var num:Number = Number(value.text);
			this.text = Format.percentFormat(num);
		}
	}
}