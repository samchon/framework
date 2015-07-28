package org.samchon.simulation.simulation.backtesting.history.trader.aggregation
{
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTradeReturn;

	public class BTTraderArrayReturnManager extends BTTraderArrayReturnAverage
	{
		public function BTTraderArrayReturnManager(traderArray:BTTraderArray)
		{
			super(traderArray);
		}
		
		override protected function calc(type:int):void
		{
			var totalTradeReturn:BTTradeReturn = this.getTradeReturn(type);
			var tradeReturnX:BTTradeReturn;
			
			totalTradeReturn.init();
			
			//CALC AVERAGE
			for(var i:int = 0; i < traderArray.length; i++)
			{
				tradeReturnX = traderArray.at(i).getTradeReturn(type);
				if(tradeReturnX.profit == 0.0 || tradeReturnX.profit == Global.NULL)
					continue;
				
				totalTradeReturn.simpleReturn += tradeReturnX.simpleReturn / Number(traderArray.length);
				totalTradeReturn.yearReturn += tradeReturnX.simpleReturn / Number(traderArray.length);
			}
		}
	}
}