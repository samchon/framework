package org.samchon.simulation.simulation.backtesting.result.comparison.plot
{
	import mx.collections.ArrayCollection;
	
	
	public class BTPlotTargetList extends ArrayCollection
	{
		public function BTPlotTargetList()
		{
			super(null);
		}
		public function at(x:int):BTPlotTarget
		{
			return this.getItemAt(x) as BTPlotTarget;
		}
	}
}