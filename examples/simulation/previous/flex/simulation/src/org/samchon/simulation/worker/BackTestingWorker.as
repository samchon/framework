package org.samchon.simulation.worker
{
	import org.samchon.namtree.NTCriteriaGrid;
	import org.samchon.simulation.simulation.backtesting.history.BTHistory;
	import org.samchon.simulation.simulation.backtesting.history.BTHistoryArray;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.movie.BackTestingMovie;
	import org.samchon.simulation.movie.InquiryMovie;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	
	public class BackTestingWorker extends SimulationWorker
	{
		override protected function getNewHistoryArray():HistoryArray	{	return new BTHistoryArray(this);	}
		public function BackTestingWorker(movie:InquiryMovie)
		{
			super(movie);
		}
		
		/* -------------------------------------------------------
			SIMULATE
		------------------------------------------------------- */
		protected function get criteriaGridArray():Vector.<NTCriteriaGrid>
		{
			var movie:BackTestingMovie = BackTestingMovie(movie);
			return movie.namTreeBoundary.criteriaGridArray;
		}
		
		/* -------------------------------------------------------
			EXPORT MANAGER
		------------------------------------------------------- */
		override public function getFileName():String
		{
			return "back_testing";
		}
	}	
}