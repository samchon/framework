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
		public static function between(value:String, start:String = null, end:String = null):String 
		{
			if (start == "")	start = null;
			if (end == "")		end = null;
			
			if (start == null && end == null)
				return value;
			else if (start == null)
				return value.substr(0, value.indexOf(end));
			else if (end == null)
				return value.substr(value.indexOf(start) + start.length);
			else
			{
				var startIndex:int = value.indexOf(start);
				
				return value.substring
					(
						startIndex + start.length,
						value.indexOf(end + startIndex + start.length)
					);
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
		public static function betweens(value:String, start:String = null, end:String = null):Array 
		{
			if (start == "")	start = null;
			if (end == "")		end = null;
			
			var array:Array = [];
			var i:int;
			
			if (start == null && end == null)
				return array;
			else if (start == end)
			{
				// NOT EMPTY, BUT EQUALS
				var indexPairArray:Vector.<IndexPair> = new Vector.<IndexPair>();
				
				var index:int = 0;
				var prev:int = -1;
				var n:int = 0;
				
				while((index = value.indexOf(start, prev + 1)) != -1)
				{
					if (++n % 2 == 0)
						indexPairArray.push(new IndexPair(prev, index));
					
					prev = index;
				}
				
				if (indexPairArray.length == 0)
					return array;
				else
				{
					for (i = 0; i < indexPairArray.length; i++)
					{
						var indexPair:IndexPair = indexPairArray[i];
						
						array.push(value.substr(indexPair.start, indexPair.end));
					}
				}
			}
			else
			{
				// DIFFERENT
				array = value.split(start);
				array.splice(0, 1);
				
				if (end != null)
				{
					for (i = array.length - 1; i >= 0; i--)
					{
						if (array[i].indexOf(end) == -1)
							array.splice(i, 1);
						else
							array[i] = between(array[i], null, end);
					}
				}
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

class IndexPair
{
	public var start:int;
	public var end:int;
	
	public function IndexPair(start:int, end:int)
	{
		this.start = start;
		this.end = end;
	}
}