package org.samchon.simulation.simulation.backtesting.history.trader
{
	public class HPR
	{
		private var priceBought:Number;
		private var priceSold:Number;
		private var volume:int;
		private var days:int;
		
		public function HPR(B:Number, S:Number, Q:int, startDate:String, endDate:String) 
		{
			priceBought = B;
			priceSold = S;
			volume = Q;
			days = getDays(startDate, endDate);
		}
		public function getHPR():Number 
		{
			if(days == 0 || priceSold == 0.0)
				return Global.NULL;
			
			var hpr:Number =
				Math.pow
				(
					priceSold / priceBought, 
					1 / (days/360)
				);
			return hpr;
		}
		public function getWeighted(unit:Number):Number 
		{
			var hpr:Number = getHPR();
			if(hpr == Global.NULL)
				return Global.NULL;
			else
				return Math.pow(hpr, volume / unit);
		}
		public static function getDays(start:String, end:String):int 
		{
			var starts:Array = start.split("-");
			var ends:Array = end.split("-");
			
			var beginDate:Date = new Date(int(starts[0]), int(starts[1]), int(starts[2]));
			var endDate:Date = new Date(int(ends[0]), int(ends[1]), int(ends[2]));
			
			var days:int = Number(endDate.time - beginDate.time) / Number(60*60*24*1000);
			return days;
		}
	}
}