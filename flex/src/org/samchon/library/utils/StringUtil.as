package org.samchon.library.utils
{
	import mx.utils.StringUtil;
	
	public class StringUtil 
		extends mx.utils.StringUtil
	{
		/**
		 * @private
		 */
		private static const trimTargets:Array = ["\r", "\n", "\t", " "];
		
		/**
		 * @private
		 */
		private static const HTML_SPACE_ARRAY:Array = ["&nbsp;", "\t","  "];
		
		/**
		 * 
		 */
		public static function replaceAll(value:String, org:*, repl:String):String 
		{
			return value.split(org).join(repl);
		}
		
		/**
		 * 
		 */
		public static function removeHTMLSpaces(str:String):String
		{
			var res:String = str;
			for (var i:int = 0; i < HTML_SPACE_ARRAY.length; i++)
				res = replaceAll(res, HTML_SPACE_ARRAY[i], " ");
			
			return res;
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
		 * <p>Removes all designated characters from the beginning of the specified string.</p>
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
		 * <p>Removes all designated characters from end of the specified string.</p>
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
		 * <p> Generate a substring. </p>
		 * 
		 * <p> Extracts a substring consisting of the characters from specified start to end
		 * It's same with str.substring( ? = (str.find(start) + start.size()), str.find(end, ?) ) </p>
		 * 
		 * <p> ex) between("ABCD[EFGH]IJK", "[", "]") => "EFGH" </p>
		 * 
		 * <ul>
		 * 	<li> If start is not specified, extracts from begin of the string to end. </li>
		 * 	<li> If end is not specified, extracts from start to end of the string. </li>
		 * 	<li> If start and end are all omitted, returns str, itself. </li>
		 * </ul>
		 *
		 * @param str Target string to be applied between
		 * @param start A string for separating substring at the front
		 * @param end A string for separating substring at the end
		 * 			  
		 * @return substring by specified terms
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
		 * <p> Generate substrings from A to B. </p>
		 * 
		 * <p> Splits a string into an array of substrings dividing by specified delimeters of start and end.
		 * It's the array of substrings adjusted the between. </p>
		 *
		 * <ul> 
		 *	<li> If startStr is omitted, it's same with the split by endStr not having last item. </li>
		 *	<li> If endStr is omitted, it's same with the split by startStr not having first item. </li>
		 *	<li> If startStr and endStar are all omitted, returns {str}. </li>
		 * </ul>
		 * 
		 * @param str Target string to split by between
		 * @param start A string for separating substring at the front.
		 *				If omitted, it's same with split(end) not having last item.
		 * @param end A string for separating substring at the end.
		 *			  If omitted, it's same with split(start) not having first item.
		 * @return An array of substrings
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
		
		/**
		 * 
		 */
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