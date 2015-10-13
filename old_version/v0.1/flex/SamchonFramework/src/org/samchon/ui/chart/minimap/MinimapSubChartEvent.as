package org.samchon.ui.chart.minimap
{
	public class MinimapSubChartEvent
	{
		public static const REMOVE_ACTIVATE:String = "remove_activate";
		public static const REMOVE_COMPLETE:String = "remove_complete";
		
		public var chart:MinimapSubChart;
		public function MinimapSubChartEvent(minimapSubChart:MinimapSubChart) {
			this.chart = minimapSubChart;
		}
	}
}