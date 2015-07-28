package org.samchon.simulation.inquiry.finance
{
	public class FinanceChartItem
	{
		public var label:String;
		public var values:Vector.<Number>;
		
		public function FinanceChartItem(label:String, values:Vector.<Number>) {
			this.label = label;
			this.values = values;
		}
	}
}