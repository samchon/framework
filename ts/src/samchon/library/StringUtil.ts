namespace samchon.library
{
	/**
	 * <p> A utility class supporting static methods of string. </p>
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class StringUtil
	{
		/* ==================================================================
			SUBSTRING
				- BETWEEN(s)
				- TRIM
		=====================================================================
			BETWEEN(s)
		------------------------------------------------------------------ */
		/**
		 * <p> Generate a substring. </p>
		 *
		 * <p> Extracts a substring consisting of the characters from specified start to end.
		 * It's same with str.substring( ? = (str.find(start) + start.size()), str.find(end, ?) ) </p>
		 *
		 * <code>
		 let str = between("ABCD[EFGH]IJK", "[", "]");
		 console.log(str); // PRINTS "EFGH"
		 * </code>
		 *
		 * <ul>
		 *	<li> If start is not specified, extracts from begin of the string to end. </li>
		 *	<li> If end is not specified, extracts from start to end of the string. </li>
		 *	<li> If start and end are all omitted, returns str, itself. </li>
		 * </ul>
		 *
		 * @param str Target string to be applied between
		 * @param start A string for separating substring at the front
		 * @param end A string for separating substring at the end
		 *
		 * @return substring by specified terms
		 */
		public static between(str: string, start: string = "", end: string = ""): string
		{
			if (start == "" && end == "")
				return str;
			else if (start == "")
				return str.substr(0, str.indexOf(end));
			else if (end == "")
				return str.substr(str.indexOf(start) + start.length);
			else
			{
				let startIndex: number = str.indexOf(start);
				if (startIndex == -1)
					return "";

				return str.substring
					(
						startIndex + start.length,
						str.indexOf(end, startIndex + start.length)
					);
			}
		}

		/**
		 * <p> Fetch substrings. </p>
		 *
		 * <p> Splits a string into an array of substrings dividing by specified delimeters of start and end.
		 * It's the array of substrings adjusted the between. </p>
		 *
		 * <ul>
		 *	<li> If startStr is omitted, it's same with the split by endStr not having last item. </li>
		 *	<li> If endStr is omitted, it's same with the split by startStr not having first item. </li>
		 *	<li> If startStr and endStar are all omitted, returns <i>str</i>. </li>
		 * </ul>
		 *
		 * @param str Target string to split by between
		 * @param start A string for separating substring at the front.
		 *				If omitted, it's same with split(end) not having last item
		 * @param end A string for separating substring at the end.
		 *			  If omitted, it's same with split(start) not having first item
		 * @return An array of substrings
		 */
		public static betweens(str: string, start: string = "", end: string = ""): Array<string>
		{
			let substrings: Array<string> = [];

			if (start == "" && end == "")
			{
				// PARAMETER IS NOT SPECIFIED
				// DO NOTHING
				return [str];
			}
			else if (start == end)
			{
				// SPLITTERS START AND END ARE EQUAL
				let prevIndex: number = -1;
				let endIndex: number;
				let n: number = 0;

				while ((endIndex = str.indexOf(start, prevIndex + 1)) != -1)
				{
					if (++n % 2 == 0)
					{
						substrings.push(str.substring(prevIndex, endIndex));
					}
					endIndex = prevIndex;
				}
			}
			else
			{
				substrings = str.split(start).splice(1);

				if (end != "")
					for (let i: number = substrings.length - 1; i >= 0; i--)
						if (substrings[i].indexOf(end) == -1)
							substrings.splice(i, 1);
						else
							substrings[i] = StringUtil.between(substrings[i], "", end);
			}

			return substrings;
		}

		/* ------------------------------------------------------------------
			TRIM
		------------------------------------------------------------------ */
		/**
		 * An array containing whitespaces.
		 */
		private static SPACE_ARRAY: Array<string> = [" ", "\t", "\r", "\n"];

		/**
		 * Remove all designated characters from the beginning and end of the specified string.
		 * 
		 * @param str The string whose designated characters should be trimmed.
		 * @param args Designated character(s).
		 *
		 * @return Updated string where designated characters was removed from the beginning and end.
		 */
		public static trim(str: string, ...args: string[]): string
		{
			if (args.length == 0)
				args = StringUtil.SPACE_ARRAY;

			return StringUtil.ltrim(StringUtil.rtrim(str, ...args), ...args);
		}

		/**
		 * Remove all designated characters from the beginning of the specified string.
		 *
		 * @param str The string should be trimmed.
		 * @param delims Designated character(s).
		 * 
		 * @return Updated string where designated characters was removed from the beginning
		 */
		public static ltrim(str: string, ...args: string[]): string
		{
			if (args.length == 0)
				args = StringUtil.SPACE_ARRAY;

			let index: number = 0;

			while (index < str.length)
			{
				let maxIndex: number = index;
				for (let i: number = 0; i < args.length; i++)
				{
					let myIndex: number = 
						str.indexOf(args[i], maxIndex) // START FROM PREVIOUS MAX_INDEX
							+ args[i].length; // ADD ITS LENGTH
					
					maxIndex = Math.max(maxIndex, myIndex);
				}

				if (maxIndex <= index)
					break; // CAN BE -1
				else
					index = maxIndex;
			}
			
			if (index == str.length)
				return "";
			else
				return str.substr(index);
		}

		/**
		 * Remove all designated characters from the end of the specified string.
		 *
		 * @param str The string should be trimmed.
		 * @param delims Designated character(s).
		 * 
		 * @return Updated string where designated characters was removed from the end.
		 */
		public static rtrim(str: string, ...args: string[]): string
		{
			if (args.length == 0)
				args = StringUtil.SPACE_ARRAY;

			let index: number = str.length;
			
			while (index != 0)
			{
				let minIndex: number = index;
				for (let i: number = 0; i < args.length; i++)
				{
					let myIndex: number = str.lastIndexOf(args[i], minIndex - 1);
					if (myIndex == -1)
						continue;

					minIndex = Math.min(minIndex, myIndex);
				}

				if (minIndex == -1 || minIndex >= index)
					break;
				else
					index = minIndex;
			}

			return str.substr(0, index);
		}

		/* ==================================================================
			REPLACERS
				- SUBSTITUTE
				- REPLACE_ALL
				- MISCELLANEOUS
		=====================================================================
			SUBSTITUTE
		------------------------------------------------------------------ */
		/**
		 * Substitute <code>{n}</code> tokens within the specified string.
		 * 
		 * @param format The string to make substitutions in. This string can contain special tokens of the form
		 *				 <code>{n}</code>, where <code>n</code> is a zero based index, that will be replaced with the 
		 *				 additional parameters found at that index if specified.
		 * @param args Additional parameters that can be substituted in the <i>format</i> parameter at each 
		 *			   <code>{n}</code> location, where <code>n</code> is an integer (zero based) index value into 
		 *			   the array of values specified.
		 *
		 * @return New string with all of the <code>{n}</code> tokens replaced with the respective arguments specified.
		 */
		public static substitute(format: string, ...args: any[]): string
		{
			while (true)
			{
				if (args.length == 0)
					break;

				let parenthesisArray: Array<string> = StringUtil.betweens(format, "{", "}");
				let minIndex: number = Number.MAX_VALUE;

				for (let i: number = 0; i < parenthesisArray.length; i++)
				{
					let index: number = Number(parenthesisArray[i]);
					if (isNaN(index) == true)
						continue;

					minIndex = Math.min(minIndex, index);
				}

				if (minIndex == Number.MAX_VALUE)
					break;

				format = StringUtil.replaceAll(format, "{" + minIndex + "}", args[0]);
			}
			return format;
		}

		/* ------------------------------------------------------------------
			TRIM
		------------------------------------------------------------------ */
		/**
		 * Returns a string specified word is replaced.
		 *
		 * @param str Target string to replace
		 * @param before Specific word you want to be replaced
		 * @param after Specific word you want to replace
		 * 
		 * @return A string specified word is replaced
		 */
		public static replaceAll(str: string, before: string, after: string): string;

		/**
		 * Returns a string specified words are replaced.
		 *
		 * @param str Target string to replace
		 * @param pairs A specific word's pairs you want to replace and to be replaced
		 * 
		 * @return A string specified words are replaced
		 */
		public static replaceAll(str: string, ...pairs: std.Pair<string, string>[]): string;
		
		public static replaceAll(str: string, ...args: any[]): string
		{
			if (args.length == 2 && typeof args[0] == "string")
			{
				let before: string = args[0];
				let after: string = args[1];

				return str.split(before).join(after);
			}
			else
			{
				let pairs: Array<std.Pair<string, string>> = args[0];
				if (pairs.length == 0)
					return str;

				for (var i: number = 0; i < pairs.length; i++)
					str = str.split(pairs[i].first).join(pairs[i].second);

				return str;
			}
		}

		/* ------------------------------------------------------------------
			MISCELLANEOUS
		------------------------------------------------------------------ */
		/**
		 * <p> Get a tabbed string by specified size. </p>
		 */
		public static tab(size: number): string
		{
			var str: string = "";
			for (var i: number = 0; i < size; i++)
				str += "\t";

			return str;
		}

		/**
		 * <p> Get a tabbed HTLM string by specified size. </p>
		 */
		public static htmlTab(size: number): string
		{
			var str: string = "";
			for (var i: number = 0; i < size; i++)
				str += "&nbsp;&nbsp;&nbsp;&nbsp;";

			return str;
		}

		/**
		 * Replace all HTML spaces to a literal space.
		 *
		 * @param str Target string to replace.
		 */
		public static removeHTMLSpaces(str: string): string
		{
			return StringUtil.replaceAll
				(
					str,
					new std.Pair<string, string>("&nbsp;", " "),
					new std.Pair<string, string>("\t", " "),
					new std.Pair<string, string>("  ", " ")
				);
		}
	}
}