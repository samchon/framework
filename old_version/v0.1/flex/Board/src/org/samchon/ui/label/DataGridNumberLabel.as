package org.samchon.ui.label
{
	import mx.controls.Label;
	
	import org.samchon.format.Format;

	public class DataGridNumberLabel extends Label
	{
		public function DataGridNumberLabel()
		{
			super();
			setStyle("textAlign", "right");
		}
		public override function set data(value:Object):void {
			super.data = value;
			if(listData == null || listData.label == "" || listData.label == null || Number(listData.label) == Global.NULL) {
				super.htmlText = "";
				return;
			}
			var val:Number = Number(listData.label);
			if(isNaN(val) == true)
				super.htmlText = listData.label;
			else
				super.htmlText = getValue(val);
		}
		protected function getValue(value:Number):String {
			return Format.numberFormat(value);
		}
	}
}