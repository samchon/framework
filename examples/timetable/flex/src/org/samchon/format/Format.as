package org.samchon.format
{
	import mx.charts.chartClasses.IAxis;
	
	import spark.formatters.NumberFormatter;
	
	public class Format
	{
		private static var intFormatter:NumberFormatter = new NumberFormatter();
		private static var doubleFormatter:NumberFormatter = new NumberFormatter();
		
		private static var isLoaded:Boolean = false;
		
		private static function formatterMain():void {
			intFormatter.useGrouping = true;
			intFormatter.fractionalDigits = 0;
			
			doubleFormatter.useGrouping = true;
			doubleFormatter.fractionalDigits = 2;
			
			isLoaded = true;
		}
		
		/*
		=============================================
		NUMBER FORMAT
		=============================================
		*/
		public static function intFormat(value:Number, skipBillion:Boolean = true):String {
			return numberFormat(value, skipBillion, true);
		}
		public static function intPercentFormat(value:Number, skipBillion:Boolean = true):String {
			return percentFormat(value, skipBillion, true);
		}
		public static function numberFormat(value:Number, skipBillion:Boolean = true, onlyInt:Boolean = false, fractionalDigits:int = 2):String {
			if(isLoaded == false)
				formatterMain();
			
			var unit:String = "";
			
			if(value == Global.NULL)
				return "";
			if(Math.abs(value) > Math.pow(1000, 3) && skipBillion == true) 
			{
				unit = "B";
				value = value / Math.pow(1000, 3);
			}
			
			if(Math.floor(value) == value || onlyInt == true)
				return intFormatter.format(value) + unit;
			else
			{
				doubleFormatter.fractionalDigits = fractionalDigits;
				return doubleFormatter.format(value) + unit;
			}
		}
		public static function percentFormat(value:Number, skipBillion:Boolean = true, onlyInt:Boolean = false, fractionalDigits:int = 2):String {
			if(value == Global.NULL)
				return "";
			return numberFormat(value * 100, skipBillion, onlyInt, fractionalDigits) + "%";
		}
		
		public static function getValue(str:String):Number {
			if(str.indexOf(",") != -1)
				str = str.replace(RegExp(/,/g), "");
			return Number(str);
		}
		public static function getTime(value:int):String {
			if(value % 100 < 10)
				return int(value / 100) + ":0" + value % 100;
			else
				return int(value / 100) + ":"  + value % 100;
		}
		
		/*
		==========================================================
		HTML PART
		==========================================================
		*/
		public static function intColorFormat(value:Number, skipBillion:Boolean = true):String {
			return colorNumberFormat(value, skipBillion, true);
		}
		public static function intColorPercentFormat(value:Number, skipBillion:Boolean = true):String {
			return colorPercentFormat(value, skipBillion, true);
		}
		public static function colorNumberFormat(value:Number, skipBillion:Boolean = true, onlyInt:Boolean = false):String {
			return "<font color='" + getColor(value) + "'>" + numberFormat(value, skipBillion, onlyInt) + "</font>";
		}
		public static function colorPercentFormat(value:Number, skipBillion:Boolean = true, onlyInt:Boolean = false):String {
			return "<font color='" + getColor(value) + "'>" + percentFormat(value, skipBillion, onlyInt) + "</font>";
		}
		protected static function getColor(value:Number):String {
			var color:String;
			if(value > 0)
				color = "#FF0000";
			else if(value == 0)
				color = "#black";
			else
				color = "#0000FF";
			
			return color;
		}
	}
}