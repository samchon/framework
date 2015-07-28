package org.samchon.simulation.math
{
	public class Normalization
	{
		public static function normsinv(y:Number):Number
		{
			if (y >= 1.0)
			{
				return 5.0;
			}
			else if(y <= 0.0)
			{
				return 0.0;
			}
			/*else if(normsinv_map.hasOwnProperty(y) == true)
			{
				return normsinv_map[y];
			}*/
			
			var x:Number;
			var tst:Number;
			var incr:Number;
			
			x = 0.0;
			incr = y - 0.5;
			
			while (Math.abs(incr) > 0.0000001)
			{
				if (Math.abs(incr) < 0.0001 && (x <= -5.0 || x >= 5.0))
				{
					break;
				}
				x +=  incr;
				tst = normsdist(x);
				if ((tst > y && incr > 0) || (tst < y && incr < 0))
				{
					incr *=  -0.5;
				}
			}
			//normsinv_map[y] = x;
			return x;
		}
		public static function normsdist(x:Number):Number
		{
			if (normsdist_initiationFlag == false)
				initNormsdist();
			
			var scale:Number = 0.5;
			var sign:int = (x < 0.0) ? -1:1;
			
			if (x == 0)
				return scale;
			
			x = Math.abs(x);
			if(x >= 6.0)
				return (sign == 1) ? 1 : 0;
			
			return 0.5 + sign * normsdistVector[ int(x * NORMSDIST_UNIT) ];
		}
		public static function integralNorm( pX:Number ):Number
		{
			var pY:Number;
			pY = 1 / Math.sqrt( 2 * Math.PI ) * Math.exp( -pX * pX / 2 );
			return pY;
		}
		
		/* -----------------------------------------------
			PRE-CALCULATED -> NORMSDIST
		----------------------------------------------- */
		private static var NORMSDIST_UNIT:int = 10000;
		
		private static var normsdist_initiationFlag:Boolean = false;
		private static var normsdistVector:Vector.<Number >  = new Vector.<Number > (6 * NORMSDIST_UNIT,true);
		
		private static function initNormsdist():void
		{
			var bin:Number = 1 / Number(NORMSDIST_UNIT);
			var cumulated:Number = .5;
			var x:Number;
			
			normsdistVector[0] = cumulated;
			for (var i:int = 1; i < 6 * NORMSDIST_UNIT; i++)
			{
				x = i / Number(NORMSDIST_UNIT);
				
				cumulated += integralNorm(x) * bin;
				normsdistVector[ i ] = cumulated - .5;
			}
			normsdist_initiationFlag = true;
		}
	}
}