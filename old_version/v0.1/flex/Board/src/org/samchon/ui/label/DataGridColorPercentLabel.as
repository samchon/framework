package org.samchon.ui.label
{
	import mx.controls.Label;
	
	import org.samchon.format.Format;
	
	public class DataGridColorPercentLabel extends DataGridColorNumberLabel
	{
		public function DataGridColorPercentLabel()
		{
			super();
		}
		protected override function getValue(value:Number):String {
			var text:String = super.getValue(value * 100);
			if(value > 0)
				text += "<font color='" + RED + "'>%</font>";
			else if(value == 0)
				text += "%";
			else
				text += "<font color='" + BLUE + "'>%</font>";
			return text;
		}
	}
}