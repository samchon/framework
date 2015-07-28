package org.samchon.ui.axis
{
	import mx.charts.chartClasses.IAxis;
	
	import org.samchon.format.Format;

	public class PercentLinearAxis extends NumberLinearAxis
	{
		public function PercentLinearAxis()
		{
			super();
		}
		protected override function labelProcedure(item:Object, Value:Object, axis:IAxis):String {
			return Format.intPercentFormat(Number(item));
		}
	}
}