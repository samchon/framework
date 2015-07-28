package org.samchon.simulation.math
{
	public class Quotation
	{
		public static const ROUND_FLOOR:int = -1;
		public static const ROUND_OFF:int = 0;
		public static const ROUND_CEIL:int = 1;
		
		public static function roundQuote(price:int, market:int, method:int = ROUND_OFF):int
		{
			var func:Function;
			var value:int;
			var unit:int = getQuotationUnit(price, market);
			var cipher:int = SMath.log10(unit);
			
			if(method == ROUND_FLOOR)		func = SMath.roundFloor;
			else if(method == ROUND_OFF)	func = SMath.roundOff;
			else if(method == ROUND_CEIL)	func = SMath.roundCeil;
			
			if(unit.toString().charAt(0) == "5")
				value = func(price * 2, cipher + 1) / 2;
			else
				value = func(price, cipher);
			
			return value;
		}
		public static function getSlippaged(price:int, slippage:int, market:int):int
		{
			if(slippage == 0)
				return price;
			
			var direction:int = (slippage < 0) ? -1 : 1;
			var length:int = Math.abs(slippage);
			
			for(var i:int = 0; i < length; i++)
				price = _getSlippaged(price, direction, market);
			
			return price;
		}
		
		protected static function getQuotationUnit(price:int, market:int):int
		{
			if(price < 1000)
				return 1;
			if(1000 <= price && price < 5000)
				return 5;
			else if(5000 <= price && price < 10000)
				return 10;
			else if(10000 <= price && price < 50000)
				return 50;
			else
			{
				if(market == 2)
					return 100;
				else
				{
					if(50000 <= price && price < 100000)
						return 100;
					else if(100000 <= price && price < 500000)
						return 500;
					else
						return 1000;
				}
			}
			return Global.NULL;
		}
		protected static function _getSlippaged(price:int, direction:int, market:int):int
		{
			var unit:int = getQuotationUnit( price + direction, market );
			return price + (direction*unit)
		}
	}
}