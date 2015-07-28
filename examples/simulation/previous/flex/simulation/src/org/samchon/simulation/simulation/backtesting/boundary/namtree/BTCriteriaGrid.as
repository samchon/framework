package org.samchon.simulation.simulation.backtesting.boundary.namtree
{
	import org.samchon.namtree.NTCriteriaGrid;
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.simulation.simulation.backtesting.boundary.namtree.criteria.BTCriteria;
	
	public class BTCriteriaGrid extends NTCriteriaGrid
	{
		public function BTCriteriaGrid()
		{
			super();
		}
		
		//FOR OVERRIDING
		override protected function getNewCriteria():NTCriteria
		{
			return new BTCriteria();
		}
	}
}