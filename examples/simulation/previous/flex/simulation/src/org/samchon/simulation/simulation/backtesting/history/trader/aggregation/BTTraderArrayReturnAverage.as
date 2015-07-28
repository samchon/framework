package org.samchon.simulation.simulation.backtesting.history.trader.aggregation
{
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTradeReturn;

	public class BTTraderArrayReturnAverage extends BTTraderArrayReturnAggregation
	{
		public function BTTraderArrayReturnAverage(traderArray:BTTraderArray)
		{
			super(traderArray);
		}
		override protected function calc(type:int):void
		{
			var totalTradeReturn:BTTradeReturn = this.getTradeReturn(type);
			var tradeReturnX:BTTradeReturn;
			
			var i:int;
			var length:int = 0;
			
			totalTradeReturn.init();
			totalTradeReturn.profit = Global.NULL;
			
			//GET LENGTH FIRST
			for(i = 0; i < traderArray.length; i++)
			{
				tradeReturnX = traderArray.at(i).getTradeReturn(type);
				if(tradeReturnX.profit == 0.0 || tradeReturnX.profit == Global.NULL)
					continue;
				
				length++;
			}
			
			//CALC AVERAGE
			for(i = 0; i < traderArray.length; i++)
			{
				tradeReturnX = traderArray.at(i).getTradeReturn(type);
				if(tradeReturnX.profit == 0.0 || tradeReturnX.profit == Global.NULL)
					continue;
				
				totalTradeReturn.simpleReturn += tradeReturnX.simpleReturn / Number(length);
				totalTradeReturn.yearReturn += tradeReturnX.simpleReturn / Number(length);
			}
		}
	}
}