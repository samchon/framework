package org.samchon.simulation.movie
{
	import org.samchon.simulation.menu.InquiryMenu;
	import org.samchon.simulation.menu.MontecarloMenu;
	import org.samchon.simulation.simulation.montecarlo.boundary.MCProgrammingBoundary;
	import org.samchon.simulation.simulation.montecarlo.request.MCRequestWindow;
	import org.samchon.simulation.simulation.montecarlo.result.MCResultMovie;
	import org.samchon.simulation.simulation.abstract.boundary.SMProgrammingBoundary;
	import org.samchon.simulation.simulation.abstract.result.SMResultMovie;
	import org.samchon.simulation.worker.InquiryWorker;
	import org.samchon.simulation.worker.MontecarloWorker;

	public class MontecarloMovie extends SimulationMovie
	{
		override public function get category():int	{	return Category.MONTECARLO;	}
		override protected function getNewTopMenu():InquiryMenu		{	return new MontecarloMenu();		}
		override protected function getNewWorker():InquiryWorker	{	return new MontecarloWorker(this);	}
		
		public function MontecarloMovie()
		{
			super();
		}
		
		override protected function getNewProgrammingBoundary():SMProgrammingBoundary	{	return new MCProgrammingBoundary();	}
		override protected function getNewResultMovie():SMResultMovie					{	return new MCResultMovie();			}
		
		override protected function get RequestWindow():Class							{	return MCRequestWindow;				}
	}
}