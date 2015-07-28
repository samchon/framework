package org.samchon.simulation.simulation.backtesting.history.trader.aggregation
{
	import mx.controls.Alert;
	
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTradeReturn;

	public class BTTraderArrayReturnTotal extends BTTraderArrayReturnAggregation
	{
		public function BTTraderArrayReturnTotal(traderArray:BTTraderArray)
		{
			super(traderArray);
		}
		
		override protected function calc(type:int):void
		{
			var totalTradeReturn:BTTradeReturn = this.getTradeReturn(type);
			var tradeReturnX:BTTradeReturn;
			var average:Number = 0.0;
			
			var i:int;
			var length:int = 0;
			
			totalTradeReturn.init();
			
			//GET AVERAGE FIRST
			for(i = 0; i < traderArray.length; i++)
			{
				tradeReturnX = traderArray.at(i).getTradeReturn(type);
				if(tradeReturnX.profit == 0.0 || tradeReturnX.profit == Global.NULL)
					continue;
				
				average += tradeReturnX.profit;
				length++;
			}
			if(length == 0)
				return;
			
			average = average / Number(length);
			
			//CALC TOTAL
			for(i = 0; i < traderArray.length; i++)
			{
				tradeReturnX = traderArray.at(i).getTradeReturn(type);
				if(tradeReturnX.profit == 0.0 || tradeReturnX.profit == Global.NULL)
					continue;
				
				totalTradeReturn.profit += tradeReturnX.profit;
				totalTradeReturn.simpleReturn += (tradeReturnX.simpleReturn + 1.0) * (tradeReturnX.profit / average);
				totalTradeReturn.yearReturn += (tradeReturnX.yearReturn + 1.0) * (tradeReturnX.profit / average);
			}
			totalTradeReturn.simpleReturn -= 1.0;
			totalTradeReturn.yearReturn -= 1.0;
		}
	}
}