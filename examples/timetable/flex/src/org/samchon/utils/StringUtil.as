package org.samchon.utils
{
	import mx.utils.StringUtil;
	
	public class StringUtil extends mx.utils.StringUtil
	{
		protected static const trimTargets:Array = ["\r", "\n", "\t", " "];
		
		/**
		 * ...
		 * @author Jeongho Nam
		 */
		public function StringUtil()
		{
			super();
			
		}
		public static function replace(value:String, org:*, repl:String):String {
			return value.split(org).join(repl);
		}
		
		/*
		====================================================
		TRIM - LTRIM, RTRIM
		====================================================
		*/
		public static function trim(value:String, param:* = null):String {
			return ltrim( rtrim(value, param), param );
		}
		public static function ltrim(value:String, param:* = null):String {
			var args:Array = [];
			if(param == null)
				args = trimTargets;
			else if(param is String)
				args = new Array(param);
			
			for(var i:int = 0; i < args.length; i++)
				while( value.indexOf( args[i] ) == 0 ) {
					if(value.length > args[i].length)
						value = value.substr( args[i].length );
					else
					{
						value = "";
						return value;
					}
					i = -1;
					break;
				}
			return value;
		}
		public static function rtrim(value:String, param:* = null):String {
			var args:Array = [];
			if(param == null)
				args = trimTargets;
			else if(param is String)
				args = new Array(param);
			
			for(var i:int = 0; i < args.length; i++)
				while( value.lastIndexOf( args[i] ) == value.length - args[i].length ) {
					if(value.length > args[i].length)
						value = value.substr( 0, value.length - args[i].length );
					else 
					{
						value = "";
						return value;
					}
					i = -1;
					break;
				}
			return value;
		}
		
		/*
		====================================================
		BETWEEN - BETWEEN, BETWEENS
		====================================================
		*/
		public static function between(value:String, begin:String = null, end:String = null):String {
			if(begin == "")	begin = null;	if(end == "")	end = null;
			if(begin == null && end == null)
				return value;
			else if(begin == null)
				return value.substr(0, value.indexOf(end));
			else if(end == null)
				return value.substr(value.indexOf(begin) + begin.length);
			else {
				var startPoint:int = value.indexOf(begin) + begin.length;
				if(startPoint == -1)	return null;
				var endPoint:int = value.indexOf(end, startPoint);
				if(endPoint == -1)		return null;
				
				return value.substring(startPoint, endPoint);
			}
		}
		public static function betweens(value:String, begin:String, end:String = null):Array {
			var array:Array = value.split(begin);
			array.splice(0, 1);
			
			if(end != null)
				for(var i:int = array.length - 1; i >= 0; i--) {
					array[i] = between(array[i], null, end);
					if( array[i] == null)
						array.splice(i, 1);
				}
			return array;
		}
		
		/*
		====================================================
		TO INT, NUMER
		====================================================
		*/
		public static function toInt(value:String):int {
			return int(toNumber(value));
		}
		public static function toNumber(value:String):Number {
			return Number(toNumberString(value));
		}
		public static function toNumberString(value:String):String {
			value = replace(value, ",", "");
			value = trim(value);
			
			return value;
		}
		
		/*
		====================================================
		SUBSTITUDE
		====================================================
		*/
		public static function sprintf(str:String, ... rest):String {
			return substitute(str, rest);
		}
		public static function substitute(str:String, ... rest):String {
			if (str == null) return '';
			
			// Replace all of the parameters in the msg string.
			var len:uint = rest.length;
			var args:Array;
			if (len == 1 && rest[0] is Array)
			{
				args = rest[0] as Array;
				len = args.length;
			}
			else
			{
				args = rest;
			}
			
			for (var i:int = 0; i < len; i++)
			{
				str = str.replace(new RegExp("\\{"+i+"\\}", "g"), args[i]);
			}
			
			return str;
		}
		
		/*
		====================================================
		URI EN-DECODING
		====================================================
		*/
		public static function encodeURI(value:String):String {
			value = encodeURIComponent(value);
			value = replace(value, "%20", "+");
			
			return value;
		}
		public static function decodeURI(value:String):String {
			value = replace(value, "+", "%20");
			value = decodeURIComponent(value);
			
			return value;
		}
	}
}