package org.samchon.ui.label
{
	import org.samchon.format.Format;
	
	public class DataGridColorNumberLabel extends DataGridNumberLabel
	{
		protected static const RED:String = "#FF0000";
		protected static const BLUE:String = "#0000FF";
		
		public function DataGridColorNumberLabel()
		{
			super();
		}
		protected override function getValue(value:Number):String {
			var valueString:String = super.getValue(value);
			if(value > 0)
				valueString = "<font color='" + RED + "'>" + valueString + "</font>";
			else if(value < 0)
				valueString = "<font color='" + BLUE + "'>" + valueString + "</font>";
			
			return valueString;
		}
	}
}