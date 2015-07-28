package org.samchon.simulation.simulation.retrieve.namtree
{
	import org.samchon.namtree.NTCriteriaGrid;
	import org.samchon.namtree.criteria.NTCriteria;
	import org.samchon.simulation.simulation.retrieve.namtree.criteria.RTCriteria;
	
	public class RTCriteriaGrid extends NTCriteriaGrid
	{
		public function RTCriteriaGrid()
		{
			super();
		}
		
		//FOR OVERRIDING
		override protected function getNewCriteria():NTCriteria
		{
			return new RTCriteria();
		}
	}
}