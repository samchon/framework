package org.samchon.simulation.simulation.backtesting.history.trader.aggregation
{
	import org.samchon.simulation.simulation.abstract.history.HistoryArray;
	import org.samchon.simulation.simulation.backtesting.history.BTHistory;
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTrader;
	
	public dynamic class BTTraderArray extends Array
	{
		//베이스 데이터
		protected var historyArray:HistoryArray;
		
		//수익률
		protected var totalAggregation:BTTraderArrayReturnTotal = null;
		protected var averageAggregation:BTTraderArrayReturnAverage = null;
		protected var managerAggregation:BTTraderArrayReturnManager = null;
		
		public function BTTraderArray(historyArray:HistoryArray)
		{
			super();
			this.historyArray = historyArray;
			
			for(var i:int = 0; i < historyArray.length; i++)
				this.push
				(
					new BTTrader
					(
						historyArray.at(i) as BTHistory
					)
				);	
		}
		public function at(x:int):BTTrader
		{
			return this[x] as BTTrader;
		}
		public function getAverageAggregation():BTTraderArrayReturnAggregation
		{
			return this.averageAggregation;
		}
		
		public function getExploratoryProfit(direction:int):Number
		{
			if(averageAggregation == null)
				calc();
			
			return managerAggregation.getExploratoryProfit(direction);
		}
		
		public function calc():void
		{
			if(totalAggregation != null)
				return;
			
			for(var i:int = 0; i < this.length; i++)
				at(i).calc();
			
			//집계 
			totalAggregation = new BTTraderArrayReturnTotal(this);
			averageAggregation = new BTTraderArrayReturnAverage(this);
			managerAggregation = new BTTraderArrayReturnManager(this);
		}
		
		public function toResultXMLAt(x:int):String
		{
			calc();
			
			//이름은 algorithm에 있다. 여기서는 수익행만 출력
			if(x == Global.AGGREGATION_AVERAGE)
				return averageAggregation.toResultXML();
			else if(x == Global.AGGREGATION_TOTAL)
				return totalAggregation.toResultXML();
			else
				return this.at(x).toResultXML();
		}
		public function toHTMLAt(x:int):String
		{
			return this.at(x).toHTML();
		}
		public function toCandleXMLAt(x:int):String
		{
			return this.at(x).toCandleXML();
		}
	}
}