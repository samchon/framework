package org.samchon.simulation.simulation.backtesting.history
{
	import org.samchon.namtree.NTCriteriaGrid;
	import org.samchon.simulation.inquiry.price.candle.CandleArray;
	import org.samchon.simulation.movie.BackTestingMovie;
	import org.samchon.simulation.movie.SimulationMovie;
	import org.samchon.simulation.simulation.abstract.history.History;
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTrader;
	import org.samchon.simulation.simulation.backtesting.request.BTRequestParameter;
	
	public class BTHistory extends History
	{
		//protected var algorithmArray:Vector.<BTTrader>;
		
		protected function get btHistoryArray():BTHistoryArray	{	return historyArray as BTHistoryArray;	}
		
		/* -------------------------------------------------------
			CONSTRUCTOR
		------------------------------------------------------- */
		public function BTHistory(historyArray:HistoryArray, code:String, name:String, market:int)
		{
			//수수료율 외에는 별도로 하는 역할이 없다.
			super(historyArray, code, name, market);
		}
		public function getBuyingCommission():Number	{	return btHistoryArray.getBuyingCommission();	}
		public function getSellingCommission():Number	{	return btHistoryArray.getSellingCommission();	}
	}
}