package org.samchon.simulation.simulation.backtesting.history.trader
{
	public class BTTradeRecord
	{
		public var x:int;
		public var direction:int;
		public var volume:int;
		
		public function BTTradeRecord(x:int, direction:int, volume:int)
		{
			this.x = x;
			this.direction = direction;
			this.volume = volume;
		}
		
		public static const DIRECTION_BUY:int = 1;
		public static const DIRECTION_SELL:int = -1;
	}
}