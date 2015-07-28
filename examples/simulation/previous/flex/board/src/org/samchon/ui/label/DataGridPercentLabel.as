package org.samchon.ui.label
{
	public class DataGridPercentLabel extends DataGridNumberLabel
	{
		public function DataGridPercentLabel()
		{
			super();
		}
		protected override function getValue(value:Number):String {
			return super.getValue( value*100) + "%";
		}
	}
}