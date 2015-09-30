package samchon.library.utils
{
	import mx.utils.StringUtil;
	
	public class StringUtil 
		extends mx.utils.StringUtil
	{
		/**
		 * @private
		 */
		private static const trimTargets:Array = ["\r", "\n", "\t", " "];
		
		public static function replaceAll(value:String, org:*, repl:String):String 
		{
			return value.split(org).join(repl);
		}
		
		/*
		====================================================
			TRIM - LTRIM, RTRIM
		====================================================
		*/
		/**
		 * <p>Removes all designated characters from the beginning and end of the specified string</p>
		 * 
		 * @param str The String should be trimmed
		 * @param target Designated character(s)
		 * @return Updated String where designated characters was removed from the beginning and end
		 */
		public static function trim(str:String, target:* = null):String 
		{
			return ltrim( rtrim(str, target), target );
		}
		/**
		 * <p>Removes all designated characters from the beginning of the specified string</p>
		 * 
		 * @param str The String should be trimmed
		 * @param target Designated character(s)
		 * @return Updated String where designated characters was removed from the beginning
		 */
		public static function ltrim(value:String, target:* = null):String 
		{
			var args:Array = [];
			if(target == null)
				args = trimTargets;
			else if(target is String)
				args = new Array(target);
			
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
		/**
		 * <p>Removes all designated characters from end of the specified string</p>
		 * 
		 * @param str The String should be trimmed
		 * @param target Designated character(s)
		 * @return Updated String where designated characters was removed from the end
		 */
		public static function rtrim(value:String, target:* = null):String 
		{
			var args:Array = [];
			if(target == null)
				args = trimTargets;
			else if(target is String)
				args = new Array(target);
			
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
		/**
		 * 
		 */
		public static function between(value:String, begin:String = null, end:String = null):String 
		{
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
		/**
		 * 
		 */
		public static function betweens(value:String, begin:String, end:String = null):Array 
		{
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
		/**
		 * 
		 */
		public static function stoi(value:String):int 
		{
			return int(stod(value));
		}
		public static function stod(value:String):Number 
		{
			return Number(eraseComma(value));
		}
		/**
		 * @private
		 */
		private static function eraseComma(value:String):String 
		{
			value = replaceAll(value, ",", "");
			value = trim(value);
			
			return value;
		}
		
		/*
		====================================================
		SUBSTITUDE
		====================================================
		*/
		/**
		 * @copy mx.utils.StringUtil.substitute()
		 */
		public static function substitute(str:String, ... rest):String 
		{
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
		
		/**
		 * <p>Add tab(s) to the front of each line.</p>
		 * 
		 * @param str The String wants to add tab(s)
		 * @param size The size of tab
		 * @return The String that is tabbed
		 */
		public static function addTab(str:String, size:int = 1):String
		{
			var i:int;
			
			var tab:String = "";
			for(i = 0; i < size; i++)
				tab += "\t";
			
			var value:String = "";
			var array:Array = str.split("\n");
			
			for(i = 0; i < array.length; i++)
			{
				value += tab + array[i];
				if(i < array.length - 1)
					value += "\n";
			}
			return value;
		}
	}
}