package org.samchon.ui.axis
{
	import mx.charts.LinearAxis;
	import mx.charts.chartClasses.IAxis;
	
	import org.samchon.format.Format;
	
	public class NumberLinearAxis extends LinearAxis
	{
		public function NumberLinearAxis()
		{
			super();
			this.labelFunction = labelProcedure;
		}
		protected function labelProcedure(item:Object, Value:Object, axis:IAxis):String {
			return Format.intFormat(Number(item));
		}
	}
}