package org.samchon.simulation.simulation.backtesting.history.trader.aggregation
{
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTradeReturn;
	import org.samchon.simulation.simulation.backtesting.history.trader.BTTrader;
	import org.samchon.utils.StringUtil;

	public class BTTraderArrayReturnAggregation
	{
		protected var traderArray:BTTraderArray;
		
		protected var realReturn:BTTradeReturn;
		protected var paperReturn:BTTradeReturn;
		
		public function BTTraderArrayReturnAggregation(traderArray:BTTraderArray)
		{
			this.traderArray = traderArray;
			
			realReturn = new BTTradeReturn();
			paperReturn = new BTTradeReturn();
			
			//if(init(0) == true)
			calc(Global.RETURN_PAPER);
			calc(Global.RETURN_REAL);
			//if(init(1) == true)
			
		}
		public function getTradeReturn(type:int):BTTradeReturn
		{
			if(type == 0)
				return paperReturn;
			else
				return realReturn;
		}
		public function getExploratoryProfit(direction:int):Number
		{
			if(direction == Global.DIRECTION_BUY)
				return paperReturn.getExploratoryProfit();
			else
				return (.9*realReturn.getExploratoryProfit() + .1*paperReturn.getExploratoryProfit());
		}
		
		protected function init(type:int):Boolean
		{
			for(var i:int = 0; i < traderArray.length; i++)
				if( traderArray.at(i).getTotalVolume(type) > 0)
					return true;
			return false;
		}
		
		protected function calc(type:int):void
		{
			//TARGET OF OVERRIDING
		}
		
		public function toResultXML():String
		{
			var xml:String = 
				StringUtil.sprintf
				(
					"{0} {1}", 
					paperReturn.toXML("paper"), 
					realReturn.toXML("real")
				);
			return xml;
		}
	}
}