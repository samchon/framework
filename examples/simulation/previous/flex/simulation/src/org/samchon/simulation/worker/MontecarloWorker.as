package org.samchon.simulation.worker
{
	import org.samchon.simulation.simulation.montecarlo.history.MCHistoryArray;
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	
	public class MontecarloWorker extends SimulationWorker
	{
		override protected function getNewHistoryArray():HistoryArray	{	return new MCHistoryArray(this);	}
		public function MontecarloWorker(movie:InquiryMovie)
		{
			super(movie);
		}
		
		override public function getFileName():String
		{
			return "montecarlo";
		}
	}
}