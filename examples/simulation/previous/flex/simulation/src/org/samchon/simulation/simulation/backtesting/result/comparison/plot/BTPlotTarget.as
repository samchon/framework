package org.samchon.simulation.simulation.backtesting.result.comparison.plot
{
	import mx.charts.series.PlotSeries;
	

	public class BTPlotTarget
	{
		protected var algorithmList:AlgorithmList;
		
		public var algX:int;
		public var returnX:int;
		
		public var algY:int;
		public var returnY:int;
		
		protected static const returnLabelArray:Array = ["RR", "RR/Y", "PR", "PR/Y"];
		public function BTPlotTarget(algorithmList:AlgorithmList, algX:int = 0, returnX:int = 0, algY:int = 0, returnY:int = 2)
		{
			this.algorithmList = algorithmList;
			
			this.algX = algX;
			this.returnX = returnX;
			
			this.algY = algY;
			this.returnY = returnY;
		}
		
		public function get $name():String
		{
			var name:String = 
				algorithmList.at(algX).getName() + "_" + returnLabelArray[returnX] 
					+ " x " +
				algorithmList.at(algY).getName() + "_" + returnLabelArray[returnY];
			return name;
		}
		public function getPlotSeries(x:int):PlotSeries
		{
			var plotSeries:PlotSeries = new PlotSeries();
			plotSeries.displayName = $name;
			plotSeries.xField = "@x" + x;
			plotSeries.yField = "@y" + x;
			plotSeries.setStyle("radius", 2);
			
			return plotSeries;
		}
	}
}