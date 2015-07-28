package org.samchon.simulation.math
{
	public class SMath
	{
		public static function montecarlo(price:int, mean:Number, variance:Number, t:int):int 
		{
			var normsinv:Number = Normalization.normsinv(Math.random());
			
			var exponent:Number = (mean - .5 * variance) * t + Math.sqrt(t * variance) * normsinv;
			var result:int = price * Math.exp(exponent);
			
			return result;
		}
		
		public static function roundOff(value:Number, unit:int):Number {
			var theNumber:Number = value;
			theNumber = theNumber / Math.pow(10, unit);
			theNumber = Math.round(theNumber);
			theNumber = theNumber * Math.pow(10, unit);
			value = theNumber;
			
			return theNumber;
		}
		public static function roundFloor(value:Number, unit:int):Number {
			var theNumber:Number = value;
			theNumber = theNumber / Math.pow(10, unit);
			theNumber = Math.floor(theNumber);
			theNumber = theNumber * Math.pow(10, unit);
			value = theNumber;
			
			return theNumber;
		}
		public static function roundCeil(value:Number, unit:int):Number {
			var theNumber:Number = value;
			theNumber = theNumber / Math.pow(10, unit);
			theNumber = Math.ceil(theNumber);
			theNumber = theNumber * Math.pow(10, unit);
			value = theNumber;
			
			return theNumber;
		}
		public static function log10(val:Number):Number
		{
			return Math.log(val) / Math.log(10);
		}
	}
}