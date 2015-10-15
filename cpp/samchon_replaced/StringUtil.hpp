#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>
#include <samchon/library/WeakString.hpp>
#include <sstream>
#include <vector>

#include <samchon/IndexPair.hpp>
#include <samchon/library/Math.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Elem> class BasicStringUtil;
		typedef BasicStringUtil<char> StringUtil;
		typedef BasicStringUtil<wchar_t> WStringUtil;

		typedef BasicStringUtil<TCHAR> TStringUtil;

		/**
		 * @brief StringUtil is an utility class providing lots of static methods for string 
		 * 
		 * @details 
		 * There are two methods to strength std::string to have addictional uility methods like trim and split. 
		 * The way of first is to make String class inheriting from std::string. 
		 * The second is to make StringUtil class having static methods.
		 * But those methods have problems. String class violates standard and StringUtil class violates principle of Object-Oriented Design.\n
		 * \n
		 * For the present, I've made the StringUtil class, but if you have a good opinion about the issue, please write your opinion on my github.
		 *
		 * @author Jeongho Nam
		 * @todo modify doxygen comments on replaceAll
		 */
		template <typename _Elem>
		class BasicStringUtil
		{
		public:
			/* ----------------------------------------------------------------------
				SUBSTITUTE
			---------------------------------------------------------------------- */
			/**
			 * @brief Substitutes &quot;{n}&quot; tokens within the specified string with the respective arguments passed in.
			 *
			 * @param format The string to make substitutions in.\n
			 *				 This string can contain special tokens of the form {n}, where n is a zero based index,
			 *				 that will be replaced with the additional parameters found at that index if specified
			 * @param val Target value to substitute the minimum {n} tokens
			 * @param args Additional parameters that can be substituted in the str parameter at each {n} location,
			 *			   where n is an integer (zero based) index value into the varadics of values specified.
			 * @return New string with all of the {n} tokens replaced with the respective arguments specified.
			 */
			template <typename _Ty, typename ... _Args>
			static auto substitute(const std::basic_string<_Elem> &format,
				const _Ty& val, const _Args& ... args) -> std::basic_string<_Elem>
			{
				std::basic_string<_Elem> &res = _substitute(format, val);
				return TStringUtil::substitute(res, args...);
			};
			template <typename _Ty> static auto substitute(const std::basic_string<_Elem> &format, const _Ty& val) -> std::basic_string<_Elem>
			{
				return _substitute(format, val);
			};

			/**
			 * @brief Substitutes &quot;{n}&quot; tokens within the specified sql-string with the respective arguments passed in.\n
			 * @warning substituteSQL creates the dynamic sql-statement.\n
			 *			Not recommended when the dynamic sql-statement is not only for procedure.
			 *
			 * @param format The string to make substitutions in.\n
			 *				 This string can contain special tokens of the form {n}, where n is a zero based index,
			 *				 that will be replaced with the additional parameters found at that index if specified
			 * @param val Target value to substitute the minimum {n} tokens
			 * @param args Additional parameters that can be substituted in the str parameter at each {n} location,
			 *			   where n is an integer (zero based) index value into the varadics of values specified.
			 * @return New sql-string with all of the {n} tokens replaced with the respective arguments specified.
			 */
			template <typename _Ty, typename ... _Args >
			static auto substituteSQL(const std::basic_string<_Elem> &format,
				const _Ty& value, const _Args& ... args) -> std::basic_string<_Elem>
			{
				std::basic_string<_Elem> &res = _substituteSQL(format, value);
				return TStringUtil::substituteSQL(res, args...);
			};
			template <typename _Ty> static auto substituteSQL(const std::basic_string<_Elem> &format, const _Ty& value) -> std::basic_string<_Elem>
			{
				return _substituteSQL(format, value);
			};

		protected:
			template <typename _Ty> static auto _substitute(const std::basic_string<_Elem> &format, const _Ty& value) -> std::basic_string<_Elem>
			{
				std::vector<std::basic_string<_Elem>> &parenthesisArray = betweens(format, { (_Elem)'{' }, { (_Elem)'}' });
				std::vector<long> vec;

				for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
					if (isNumeric(*it) == true)
						vec.push_back(stoi(*it));

				size_t index = (size_t)Math::calcMin(vec).getValue();

				//replaceAll
				std::basic_string<_Elem> &to = toString(value);
				return replaceAll(format, (_Elem)'{' + toString(index) + (_Elem)'}', to);
			};
			template <typename _Ty> static auto _substituteSQL(const std::basic_string<_Elem> &format, const _Ty& value) -> std::basic_string<_Elem>
			{
				std::vector<std::basic_string<_Elem>> &parenthesisArray = betweens(format, { (_Elem)'{' }, { (_Elem)'}' });
				std::vector<long> vec;

				for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
					if (isNumeric(*it) == true)
						vec.push_back(stoi(*it));

				size_t index = (size_t)Math::calcMin(vec).getValue();

				//replaceAll
				std::basic_string<_Elem> &to = toSQL(value);
				return replaceAll(format, (_Elem)'{' + toString(index) + (_Elem)'}', to);
			};

			/* ----------------------------------------------------------------------
				SUBSTITUTE -> TO_STRING
			---------------------------------------------------------------------- */
			template <typename _Ty> 
			static auto toString(const _Ty &val) -> std::basic_string<_Elem>
			{
				std::basic_stringstream<_Elem> stream;
				stream << val;

				return move(stream.str());
			};
			template<> static auto toString(const BasicWeakString<_Elem> &str) -> std::basic_string<_Elem>
			{
				return move(str.str());
			};

			template <typename _Ty>
			static auto toSQL(const _Ty &val) -> std::basic_string<_Elem>
			{
				if (val == INT_MIN)
					return iconv("NULL");

				std::basic_stringstream<_Elem> stream;
				stream << val;

				return move(stream.str());
			};
			template<> static auto toSQL(const bool &flag) -> std::basic_string<_Elem>
			{
				return toString(flag);
			};
			template<> static auto toSQL(const _Elem &val) -> std::basic_string<_Elem>
			{
				return {'\'', val, '\''};
			};
			template<> static auto toSQL(const std::basic_string<_Elem> &str) -> std::basic_string<_Elem>
			{
				if(str.empty() == true)
					return iconv("NULL");
				else
					return '\'' + str + '\'';
			};
			template<> static auto toSQL(const BasicWeakString<_Elem> &str) -> std::basic_string<_Elem>
			{
				if (str.empty() == true)
					return iconv("NULL");
				else
					return '\'' + str.str() + '\'';
			};

			static auto iconv(std::string &str) -> std::basic_string<_Elem>
			{
				return move( std::basic_string<_Elem>(str.begin(), str.end()) );
			};

		public:
			/* ----------------------------------------------------------------------
				NUMBER-FORMAT
					IN MONETARY UNIT, ADD DELIMETER ','
					COLOR-FORMAT
				POSITIVE NUMBER IS RED,
					NEGATIVE NUMBER IS BLUE
			---------------------------------------------------------------------- */
			/**
			 * @brief Returns wheter the String represents Number or not\n
			 *
			 * @param str Target String to check
			 * @return Whether the String can be converted to Number or not
			 */
			static auto isNumeric(const std::basic_string<_Elem> &str) -> bool
			{
				try
				{
					//replaceAll(str, (_Elem)',', iconv(""));
				}
				catch (std::exception &e)
				{
					return false;
				}
				return true;
			};

			/**
			 * @brief Number String to Number having ',' symbols
			 *
			 * @param str Target String you want to convert to Number
			 * @return Number from String
			 */
			static auto toNumber(const std::basic_string<_Elem> &str) -> double
			{
				std::basic_string<_Elem> &numStr = replaceAll(str, (_Elem)',', {});
				return stod(numStr);
			};

			/**
			 * @brief 
			 *
			 * @details
			 * Returns a string converted from the number rounded off from specified precision with &quot;,&quot; symbols
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) numberFormat(17151.339, 2) => 17,151.34
			 *
			 * @param val A number wants to convert to string
			 * @param precision Target precision of roundoff
			 * @return A string representing the number with roundoff and &quot;,&quot; symbols
			 */
			static auto numberFormat(double val, int precision = 2) -> std::basic_string<_Elem>
			{
				std::basic_string<_Elem> text;

				//IF VALUE IS ZERO
				if (val == 0.0) {
					return '0';
				}
				else if (val == LONG_MIN)
					return {};

				//SETTING
				bool isPositive = (val > 0);
				val = abs(val);
				//cout << "value: " << value << endl;
				int cipher = (int)log10(val) + 1;

				int i, j, k;
				int groups = (cipher - 1) / 3;
				int val;

				if (val == (long long)val)
					precision = 0;

				//RESERVE
				text.reserve(cipher + groups + precision + 5);

				k = cipher;
				for (i = 0; i < cipher + groups; i++)
				{
					j = cipher + groups - i;
					if (j != 0 && j-- % 4 == 0)
						text += ',';
					else
					{
						val = ((int)val % (int)pow(10.0, k)) / (int)pow(10.0, k - 1);
						text += toString(val);
						k--;
					}
				}

				//DECIMAL PART
				if (precision > 0)
				{
					double pointValue = (double)val - (long long)val;
					wstring &precisionText = toString(pointValue).substr(2);
					text += precisionText;
				}
				//ADD POINT FROM HERE
				if (isPositive == false)
					text = '-' + text;

				return move(text);
			}
			
			/**
			 * @brief
			 * Returns a percentage string converted from the number rounded off from specified precision with &quot;,&quot; symbols\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) percentFormat(11.3391, 1) => 1,133.9%
			 * 
			 * @warning Do not multiply by 100 to the value representing percent
			 * @param val A number wants to convert to percentage string
			 * @param precision Target precision of roundoff
			 */
			static auto percentFormat(double val, int precision = 2)->std::basic_string<_Elem>
			{
				if (val == INT_MIN)
					return {};
				return numberFormat(val * 100, precision) + '%';
			};

			/**
			 * @brief
			 * Returns a string converted from the number rounded off from specified precision with &quot;,&quot; symbols and color tag\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) numberFormat(17151.339, 2) => <font color='red'>17,151.34</font>
			 * 
			 * @details
			 * Which color would be chosen
			 *	\li Number is positive, color is RED
			 *	\li Number is zero (0), color is BLACK
			 *	\li Number is negative, color is BLUE
			 *
			 * @param val A number wants to convert to colored string
			 * @param precision Target precision of roundoff
			 * @return A colored string representing the number with roundoff and &quot;,&quot; symbols
			 */
			static auto colorNumberFormat(double value, int precision = 2, double delimiter = 0.0)->std::basic_string<_Elem>
			{
				std::string color;

				if (value > delimiter)			color = "red";
				else if (value == delimiter)	color = "black";
				else							color = "blue";

				return iconv("<font color=\"" + color + "\">") + numberFormat(value, precision) + iconv("</font>");
			};
			
			/**
			 * @brief Returns a percentage string converted from the number rounded off from specified precision with &quot;,&quot; symbols\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) percentFormat(11.3391, 1) => 1,133.9%
			 *
			 * @warning Do not multiply by 100 to the value representing percent
			 * @param val A number wants to convert to percentage string
			 * @param precision Target precision of roundoff
			 */
			static auto colorPercentFormat(double value, int precision = 2, double delimiter = 0.0)->std::basic_string<_Elem>
			{
				std::string color;

				if (value > delimiter)			color = "red";
				else if (value == delimiter)	color = "black";
				else							color = "blue";

				return iconv("<font color=\"" + color + "\">") + percentFormat(value, precision) + iconv("</font>");
			}

			/* ----------------------------------------------------------------------
				TRIM -> WITH LTRIM & RTRIM
					IT'S RIGHT, THE TRIM OF ORACLE
			---------------------------------------------------------------------- */
			/**
			 * @brief Removes all designated characters from the beginning and end of the specified string
			 *
			 * @param str The string should be trimmed
			 * @param delims Designated character(s)
			 * @return Updated string where designated characters was removed from the beginning and end
			 */
			static auto trim(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims) -> std::basic_string<_Elem>
			{
				return move( BasicWeakString<_Elem>(val).trim(delims).str() );
			};
			
			/**
			 * @brief Removes all designated characters from the beginning of the specified string
			 *
			 * @param str The string should be trimmed
			 * @param delims Designated character(s)
			 * @return Updated string where designated characters was removed from the beginning
			 */
			static auto ltrim(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims)->std::basic_string<_Elem>
			{
				return move( BasicWeakString<_Elem>(val).ltrim(delims).str() );
			};
			
			/**
			 * @brief Removes all designated characters from the end of the specified string
			 *
			 * @param str The string should be trimmed
			 * @param delims Designated character(s)
			 * @return Updated string where designated characters was removed from the end
			 */
			static auto rtrim(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims) -> std::basic_string<_Elem>
			{
				return move( BasicWeakString<_Elem>(val).rtrim(delims).str() );
			};

			static auto trim(const std::basic_string<_Elem> &str) -> std::basic_string<_Elem>
			{
				return move( BasicWeakString<_Elem>(str).trim().str() );
			};
			static auto ltrim(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).ltrim().str());
			};
			static auto rtrim(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).rtrim().str());
			};

			static auto trim(const std::basic_string<_Elem> &str, const std::basic_string<_Elem> &delim) -> std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).trim(delim).str());
			};
			static auto ltrim(const std::basic_string<_Elem> &str, const std::basic_string<_Elem> &delim)->std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).ltrim(delim).str());
			};
			static auto rtrim(const std::basic_string<_Elem> &str, const std::basic_string<_Elem> &delim)->std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).rtrim(delim).str());
			};

			/* ----------------------------------------------------------------------
				EXTRACTORS
			---------------------------------------------------------------------- */
			/**
			 * @brief Finds first occurence in string
			 *
			 * @details 
			 * Finds first occurence position of each delim in the string after startIndex 
			 * and returns the minimum position of them\n
			 * \n
			 * If startIndex is not specified, then starts from 0.\n
			 * If failed to find any substring, returns -1 (std::string::npos)
			 *
			 * @param str Target string to find
			 * @param delims The substrings of target(str) which to find
			 * @param startIndex Specified starting index of find. Default is 0
			 * @return pair\<size_t := position, string := matched substring\>
			 */
			static auto finds(const std::basic_string<_Elem> &str,
				const std::vector<std::basic_string<_Elem>> &delims, size_t startIndex = 0) -> IndexPair<std::basic_string<_Elem>>
			{
				IndexPair<BasicWeakString<_Elem>> &iPair = BasicWeakString<_Elem>(str).finds(delims, startIndex);
				return{ iPair.getIndex(), iPair.getValue().str() }
			};
			
			/**
			 * @brief Finds last occurence in string
			 *
			 * @details
			 * Finds last occurence position of each delim in the string before endIndex
			 * and returns the maximum position of them\n
			 * \n
			 * If index is not specified, then starts str.size() - 1\n
			 * If failed to find any substring, returns -1 (std::string::npos)
			 *
			 * @param str Target string to find
			 * @param delims The substrings of target(str) which to find
			 * @param endIndex Specified starting index of find. Default is str.size() - 1
			 * @return pair\<size_t := position, string := matched substring\>
			*/
			static auto rfinds(const std::basic_string<_Elem> &str,
				const std::vector<std::basic_string<_Elem>> &delims, size_t endIndex = SIZE_MAX) -> IndexPair<std::basic_string<_Elem>>
			{
				IndexPair<BasicWeakString<_Elem>> &iPair = BasicWeakString<_Elem>(str).rfinds(delims, endIndex);
				return {iPair.getIndex(), iPair.getValue().str()}
			};

			/**
			 * @brief Generates a substring
			 * 
			 * @details
			 * Extracts a string consisting of the character specified by startIndex and all characters up to endIndex - 1
			 * If endIndex is not specified, string::size() will be used instead.\n
			 * If endIndex is greater than startIndex, then those will be swapped
			 *
			 * @param str Target string to be applied substring
			 * @param startIndex Index of the first character.\n
			 *					 If startIndex is greater than endIndex, those will be swapped
			 * @param endIndex Index of the last character - 1.\n
							   If not specified, then string::size() will be used instead
			 * @return Extracted string by specified index(es)
			 */
			static auto substring(const std::basic_string<_Elem> &str, 
				size_t startIndex, size_t endIndex = SIZE_MAX) -> std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).substring(startIndex, endIndex).str());
			};
			
			/**
			 * @brief Generates a substring
			 * 
			 * @details 
			 * Extracts a substring consisting of the characters from specified start to end
			 * It's same with str.substring( ? = (str.find(start) + start.size()), str.find(end, ?) )\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) between("ABCD[EFGH]IJK", "[", "]") => "EFGH"\n
			 * \n
			 * If start is not specified, extracts from begin of the string to end\n
			 * If end is not specified, extracts from start to end of the string\n
			 * If start and end are all omitted, returns str, itself.
			 *
			 * @param str Target string to be applied between
			 * @param start A string for separating substring at the front
			 * @param end A string for separating substring at the end
			 * @return substring by specified terms
			 */
			static auto between(const std::basic_string<_Elem> &str,
				const std::basic_string<_Elem> &start = {}, const std::basic_string<_Elem> &end = {}) -> std::basic_string<_Elem>
			{
				return move(BasicWeakString<_Elem>(str).between(start, end).str());
			};

			//TAB
			/**
			 * @brief Adds tab(\t) character to first position of each line
			 *
			 * @param str Target str to add tabs
			 * @param n The size of tab to be added for each line
			 * @return A string added multiple tabs
			 */
			static auto addTab(const std::basic_string<_Elem> &str, size_t n = 1) -> std::basic_string<_Elem>
			{
				vector<std::basic_string<_Elem>> &lines = split(str, '\n');

				std::basic_string<_Elem> val;
				std::basic_string<_Elem> tab;
				size_t i;

				val.reserve(val.size() + lines.size());
				tab.reserve(n);

				for (i = 0; i < n; i++)
					tab += '\t';

				for (i = 0; i < lines.size(); i++)
					val.append(tab + lines[i] + ((i == lines.size() - 1) ? {} : '\n'));

				return move(val);
			};

			//MULTIPLE STRINGS
			/**
			 * @brief Generates substrings
			 * @details Splits a string into an array of substrings by dividing the specified delimiter
			 *
			 * @param str Target string to split
			 * @param delim The pattern that specifies where to split this string
			 * @return An array of substrings
			 */
			static auto split(const std::basic_string<_Elem> &str, 
				const std::basic_string<_Elem> &delim) -> std::vector<std::basic_string<_Elem>>
			{
				std::vector<BasicWeakString<_Elem>> &arr = BasicWeakString<_Elem>(str).split(delim);

				std::vector<std::basic_string<_Elem>> resArray(arr.size());
				for (size_t i = 0; i < arr.size(); i++)
					resArray[i] = move(arr[i].str());

				return move(resArray);
			};
			
			/**
			 * @brief Generates substrings
			 *
			 * @details
			 * Splits a string into an array of substrings dividing by specified delimeters of start and end\n
			 * It's the array of substrings adjusted the between\n
			 * \n
			 * If startStr is omitted, it's same with the split by endStr not having last item\n
			 * If endStr is omitted, it's same with the split by startStr not having first item\n
			 * If startStr and endStar are all omitted, returns {str}
			 *
			 * @param str Target string to split by between
			 * @param start A string for separating substring at the front\n
			 *				If omitted, it's same with split(end) not having last item
			 * @param end A string for separating substring at the end\n
			 *			  If omitted, it's same with split(start) not having first item
			 * @return An array of substrings
			 */
			static auto betweens(const std::basic_string<_Elem> &str,
				const std::basic_string<_Elem> &start = {},
				const std::basic_string<_Elem> &end = {}) -> std::vector<std::basic_string<_Elem>>
			{
				std::vector<BasicWeakString<_Elem>> &arr = BasicWeakString<_Elem>(str).betweens(start, end);

				std::vector<std::basic_string<_Elem>> resArray(arr.size());
				for (size_t i = 0; i < arr.size(); i++)
					resArray[i] = move(arr[i].str());

				return move(resArray);
			};

			/* ----------------------------------------------------------------------
				REPLACERS
			---------------------------------------------------------------------- */
			//ALPHABET-CONVERSION
			/**
			 * @brief Returns a string that all uppercase characters are converted to lowercase\n
			 * @param str Target string to convert uppercase to lowercase
			 * @return A string converted to lowercase
			 */
			static auto toLowerCase(const std::basic_string<_Elem> &str) -> std::basic_string<_Elem>
			{
				return move(BasicStringUtil<_Elem>(str).toLowerCase());
			};
			
			/**
			 * Returns a string all lowercase characters are converted to uppercase\n
			 *
			 * @param str Target string to convert lowercase to uppercase
			 * @return A string converted to uppercase
			 */
			static auto toUpperCase(const std::basic_string<_Elem> &str) -> std::basic_string<_Elem>
			{
				return move(BasicStringUtil<_Elem>(str).toUpperCase());
			};

			/**
			 * @brief Returns a string specified word is replaced
			 *
			 * @param str Target string to replace
			 * @param before Specific word you want to be replaced
			 * @param after Specific word you want to replace
			 * @return A string specified word is replaced
			 */
			static auto replaceAll(const std::basic_string<_Elem> &str,
				const std::basic_string<_Elem> &before, const std::basic_string<_Elem> &after) -> std::basic_string<_Elem>
			{
				return move( BasicWeakString<_Elem>(str).replaceAll(before, after) );
			};
			
			/**
			 * @brief Returns a string specified words are replaced
			 *
			 * @param str Target string to replace
			 * @param pairs A specific word's pairs you want to replace and to be replaced
			 * @return A string specified words are replaced
			 */
			static auto replaceAll(const std::basic_string<_Elem> &str,
				const std::vector<std::pair<std::basic_string<_Elem>, std::basic_string<_Elem>>> &pairs) -> std::basic_string<_Elem>
			{
				return move( BasicStringUtil<_Elem>(str).replaceAll(pairs) );
			};
		};
	};
};