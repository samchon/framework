#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>
#include <samchon/WeakString.hpp>

#include <sstream>
#include <samchon/IndexPair.hpp>
#include <samchon/library/Math.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Utility class for string 
		 * 
		 * @details 
		 * StringUtil is an utility class providing lots of static methods for string 
		 * 
		 * There are two methods to strength std::string to have addictional uility methods like trim and split. 
		 * The way of first is to make String class inheriting from std::string. 
		 * The second is to make StringUtil class having static methods.
		 *
		 * But those methods have problems. String class violates standard and StringUtil class violates principle of Object-Oriented Design.
		 * For the present, I've made the StringUtil class, but if you have a good opinion about the issue, please write your opinion on my github.
		 *
		 * @author Jeongho Nam
		 * @todo modify doxygen comments on replaceAll
		 */
		class SAMCHON_FRAMEWORK_API StringUtil
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
			static auto substitute(const String &format,
				const _Ty& val, const _Args& ... args) -> String
			{
				String &res = _substitute(format, val);
				return StringUtil::substitute(res, args...);
			};
			template <typename _Ty> static auto substitute(const String &format, const _Ty& val) -> String
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
			static auto substituteSQL(const String &format,
				const _Ty& value, const _Args& ... args) -> String
			{
				String &res = _substituteSQL(format, value);
				return StringUtil::substituteSQL(res, args...);
			};
			template <typename _Ty> static auto substituteSQL(const String &format, const _Ty& value) -> String
			{
				return _substituteSQL(format, value);
			};

		protected:
			template <typename _Ty> static auto _substitute(const String &format, const _Ty& value) -> String
			{
				std::vector<String> &parenthesisArray = betweens(format, { (TCHAR)'{' }, { (TCHAR)'}' });
				std::vector<long> vec;

				for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
					if (isNumeric(*it) == true)
						vec.push_back(stoi(*it));

				size_t index = (size_t)Math::calcMin(vec).getValue();

				//replaceAll
				String &to = toString(value);
				return replaceAll(format, (TCHAR)'{' + toString(index) + (TCHAR)'}', to);
			};
			template <typename _Ty> static auto _substituteSQL(const String &format, const _Ty& value) -> String
			{
				std::vector<String> &parenthesisArray = betweens(format, { (TCHAR)'{' }, { (TCHAR)'}' });
				std::vector<long> vec;

				for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
					if (isNumeric(*it) == true)
						vec.push_back(stoi(*it));

				size_t index = (size_t)Math::calcMin(vec).getValue();

				//replaceAll
				String &to = toSQL(value);
				return replaceAll(format, (TCHAR)'{' + toString(index) + (TCHAR)'}', to);
			};

			/* ----------------------------------------------------------------------
				SUBSTITUTE -> TO_STRING
			---------------------------------------------------------------------- */
			template <typename _Ty> 
			static auto toString(const _Ty &val) -> String
			{
				std::basic_stringstream<TCHAR> stream;
				stream << val;

				return move(stream.str());
			};
			template<> static auto toString(const WeakString &str) -> String;

			template <typename _Ty>
			static auto toSQL(const _Ty &val) -> String
			{
				if (val == INT_MIN)
					return _T("NULL");

				std::basic_stringstream<TCHAR> stream;
				stream << val;

				return move(stream.str());
			};
			template<> static auto toSQL(const bool &flag) -> String;
			template<> static auto toSQL(const TCHAR &val) -> String;
			template<> static auto toSQL(const String &str) -> String;
			template<> static auto toSQL(const WeakString &str) -> String;

		public:
			/* ----------------------------------------------------------------------
				NUMBER-FORMAT
					IN MONETARY UNIT, ADD DELIMETER ','
					COLOR-FORMAT

				POSITIVE NUMBER IS RED,
					NEGATIVE NUMBER IS BLUE
					ZERO IS BLACK
			---------------------------------------------------------------------- */
			/**
			 * @brief Returns wheter the String represents Number or not\n
			 *
			 * @param str Target String to check
			 * @return Whether the String can be converted to Number or not
			 */
			static auto isNumeric(const String &str) -> bool;

			/**
			 * @brief Number String to Number having ',' symbols
			 *
			 * @param str Target String you want to convert to Number
			 * @return Number from String
			 */
			static auto toNumber(const String &str) -> double;

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
			static auto numberFormat(double val, int precision = 2) -> String;
			
			/**
			 * @brief
			 * Returns a percentage string converted from the number rounded off from specified precision with &quot;,&quot; symbols\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) percentFormat(11.3391, 1) => 1,133.9%
			 * 
			 * @warning Do not multiply by 100 to the value representing percent
			 * @param val A number wants to convert to percentage string
			 * @param precision Target precision of roundoff
			 */
			static auto percentFormat(double val, int precision = 2) -> String;

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
			static auto colorNumberFormat(double value, int precision = 2, double delimiter = 0.0) -> String;
			
			/**
			 * @brief Returns a percentage string converted from the number rounded off from specified precision with &quot;,&quot; symbols\n
			 * &nbsp;&nbsp;&nbsp;&nbsp; ex) percentFormat(11.3391, 1) => 1,133.9%
			 *
			 * @warning Do not multiply by 100 to the value representing percent
			 * @param val A number wants to convert to percentage string
			 * @param precision Target precision of roundoff
			 */
			static auto colorPercentFormat(double value, int precision = 2, double delimiter = 0.0) -> String;

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
			static auto trim(const String &val, const std::vector<String> &delims) -> String;
			
			/**
			 * @brief Removes all designated characters from the beginning of the specified string
			 *
			 * @param str The string should be trimmed
			 * @param delims Designated character(s)
			 * @return Updated string where designated characters was removed from the beginning
			 */
			static auto ltrim(const String &val, const std::vector<String> &delims) -> String;
			
			/**
			 * @brief Removes all designated characters from the end of the specified string
			 *
			 * @param str The string should be trimmed
			 * @param delims Designated character(s)
			 * @return Updated string where designated characters was removed from the end
			 */
			static auto rtrim(const String &val, const std::vector<String> &delims) -> String;

			static auto trim(const String &str) -> String;
			static auto ltrim(const String &str) -> String;
			static auto rtrim(const String &str) -> String;

			static auto trim(const String &str, const String &delim) -> String;
			static auto ltrim(const String &str, const String &delim) -> String;
			static auto rtrim(const String &str, const String &delim) -> String;

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
			static auto finds(const String &str,
				const std::vector<String> &delims, size_t startIndex = 0) -> IndexPair<String>;
			
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
			static auto rfinds(const String &str,
				const std::vector<String> &delims, size_t endIndex = SIZE_MAX) -> IndexPair<String>;

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
			static auto substring(const String &str, 
				size_t startIndex, size_t endIndex = SIZE_MAX) -> String;
			
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
			static auto between(const String &str,
				const String &start = _T(""), const String &end = _T("")) -> String;

			//TAB
			/**
			 * @brief Adds tab(\t) character to first position of each line
			 *
			 * @param str Target str to add tabs
			 * @param n The size of tab to be added for each line
			 * @return A string added multiple tabs
			 */
			static auto addTab(const String &str, size_t n = 1) -> String;

			//MULTIPLE STRINGS
			/**
			 * @brief Generates substrings
			 * @details Splits a string into an array of substrings by dividing the specified delimiter
			 *
			 * @param str Target string to split
			 * @param delim The pattern that specifies where to split this string
			 * @return An array of substrings
			 */
			static auto split(const String &str, const String &delim) -> std::vector<String>;
			
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
			static auto betweens(const String &str,
				const String &start = _T(""), const String &end = _T("")) -> std::vector<String>;

			/* ----------------------------------------------------------------------
				REPLACERS
			---------------------------------------------------------------------- */
			//ALPHABET-CONVERSION
			/**
			 * @brief Returns a string that all uppercase characters are converted to lowercase\n
			 * @param str Target string to convert uppercase to lowercase
			 * @return A string converted to lowercase
			 */
			static auto toLowerCase(const String &str) -> String;
			
			/**
			 * Returns a string all lowercase characters are converted to uppercase\n
			 *
			 * @param str Target string to convert lowercase to uppercase
			 * @return A string converted to uppercase
			 */
			static auto toUpperCase(const String &str) -> String;

			/**
			 * @brief Returns a string specified word is replaced
			 *
			 * @param str Target string to replace
			 * @param before Specific word you want to be replaced
			 * @param after Specific word you want to replace
			 * @return A string specified word is replaced
			 */
			static auto replaceAll(const String &str,
				const String &before, const String &after) -> String;
			
			/**
			 * @brief Returns a string specified words are replaced
			 *
			 * @param str Target string to replace
			 * @param pairs A specific word's pairs you want to replace and to be replaced
			 * @return A string specified words are replaced
			 */
			static auto replaceAll(const String &str,
				const std::vector<std::pair<String, String>> &pairs) -> String;
		};
	};
};