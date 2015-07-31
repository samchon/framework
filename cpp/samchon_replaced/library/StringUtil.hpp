#pragma once
#include <samchon\API.hpp>

#include <vector>

#include <samchon/String.hpp>
#include <samchon/IndexPair.hpp>
#include <samchon/library/Math.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API StringUtil
		{
		protected:
			/* ----------------------------------------------------------------------
				SUBSTITUTE -> BASE METHODS
			---------------------------------------------------------------------- */
			//REPLACER
			template <typename _Ty> static auto _substitute(const String &format, const _Ty& value) -> String
			{
				std::vector<String> &parenthesisArray = betweens(format, _T("{"), _T("}"));
				std::vector<long> vec;

				for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
					if (isNumeric(*it) == true)
						vec.push_back(stoi(*it));

				size_t index = (size_t)Math::calcMin(vec).getValue();

				//replaceAll
				String &to = toString(value);
				return replaceAll(format, _T("{") + toString(index) + _T("}"), to);
			};
			template <typename _Ty> static auto _substituteSQL(const String &format, const _Ty& value) -> String
			{
				std::vector<String> &parenthesisArray = betweens(format, { _T("{") }, { _T("}") });
				std::vector<long> vec;

				for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
					if (isNumeric(*it) == true)
						vec.push_back(stoi(*it));

				size_t index = (size_t)Math::calcMin(vec).getValue();

				//replaceAll
				String &to = toSQL(value);
				return replaceAll(format, _T('{') + toString(index) + (TCHAR)'}', to);
			};

			static const std::vector<String> SPACE_ARRAY;
			static const std::vector<String> HTML_SPACE_ARRAY;

			enum
			{
				RED = 1, BLACK = 0, BLUE = -1
			};
			static auto FONT_COLOR(long) -> String;
			static String FONT_END;

		public:
			//SUBSTITUTE
			template <typename _Ty, typename ... Types > static auto substitute(const String &format, const _Ty& value, const Types& ... args) -> String
			{
				String &res = _substitute(format, value);
				return StringUtil::substitute(res, args...);
			};
			template <typename _Ty> static auto substitute(const String &format, const _Ty& value) -> String
			{
				return _substitute(format, value);
			};

			template <typename _Ty, typename ... Types > static auto substituteSQL(const String &format, const _Ty& value, const Types& ... args) -> String
			{
				String &res = _substituteSQL(format, value);
				return StringUtil::substituteSQL(res, args...);
			};
			template <typename _Ty> static auto substituteSQL(const String &format, const _Ty& value) -> String
			{
				return _substituteSQL(format, value);
			};

			/* ----------------------------------------------------------------------
				SUBSTITUTE -> TO_STRING
			---------------------------------------------------------------------- */
			static auto toString(const long double &val) -> String;
			static auto toString(const double &val) -> String;
			static auto toString(const float &val) -> String;
			static auto toString(const unsigned long long &val) -> String;
			static auto toString(const long long &val) -> String;
			static auto toString(const unsigned long &val) -> String;
			static auto toString(const long &val) -> String;
			static auto toString(const unsigned int &val) -> String;
			static auto toString(const int &val) -> String;
			static auto toString(const bool &val) -> String;

			static auto toString(const TCHAR &val) -> String;
			static auto toString(const TCHAR *val) -> String;
			static auto toString(const String &val) -> String;

			static auto toSQL(const long double &val) -> String;
			static auto toSQL(const double &val) -> String;
			static auto toSQL(const float &val) -> String;
			static auto toSQL(const unsigned long long &val) -> String;
			static auto toSQL(const long long &val) -> String;
			static auto toSQL(const unsigned long &val) -> String;
			static auto toSQL(const long &val) -> String;
			static auto toSQL(const unsigned int &val) -> String;
			static auto toSQL(const int &val) -> String;
			static auto toSQL(const bool &val) -> String;

			static auto toSQL(const TCHAR &val) -> String;
			static auto toSQL(const TCHAR *val)->String;
			static auto toSQL(const String &val) -> String;

			//static void toClipboard(const String &val);

			/* ----------------------------------------------------------------------
				NUMBER-FORMAT
					IN MONETARY UNIT, ADD DELIMETER ','
					COLOR-FORMAT
				POSITIVE NUMBER IS RED,
					NEGATIVE NUMBER IS BLUE
			---------------------------------------------------------------------- */
			//CONVERSION
			static auto isNumeric(const String &str) -> bool;
			static auto toNumber(const String &str) -> double;

			static auto numberFormat(double value, unsigned int precision = 2) -> String;
			static auto percentFormat(double value, unsigned int precision = 2) -> String;

			static auto colorNumberFormat(double value, unsigned int precision = 2, double delimiter = 0.0) -> String;
			static auto colorPercentFormat(double value, unsigned int precision = 2, double delimiter = 0.0) -> String;

			/* ----------------------------------------------------------------------
				TRIM -> WITH LTRIM & RTRIM
				IT'S RIGHT, THE TRIM OF ORACLE
			---------------------------------------------------------------------- */
			static auto trim(const String &val) -> String;
			static auto ltrim(const String &val) -> String;
			static auto rtrim(const String &val) -> String;

			static auto trim(const String &val, const String &delim) -> String;
			static auto ltrim(const String &val, const String &delim) -> String;
			static auto rtrim(const String &val, const String &delim) -> String;

			static auto trim(const String &val, const std::vector<String> &delims) -> String;
			static auto ltrim(const String &val, const std::vector<String> &delims) -> String;
			static auto rtrim(const String &val, const std::vector<String> &delims) -> String;

			/* ----------------------------------------------------------------------
				STRING UTILITY
			---------------------------------------------------------------------- */
			//FIND -> PAIR<INDEX, SIZE_OF_STRING>: FIND THE LAST INDEX OF CONTAINERS
			static auto find(const String &val, const std::vector<String> &delims, const size_t x = 0) -> IndexPair<size_t>;
			static auto rfind(const String &val, const std::vector<String> &delims, const size_t x = SIZE_MAX) -> IndexPair<size_t>;

			//SINGLE STRING
			static auto substring(const String &val, size_t begin, size_t end = SIZE_MAX) -> String;
			static auto between(const String &val, const String &begin = String(), const String &end = String()) -> String;

			//TAB
			static auto addTab(const String &str, size_t n = 1) -> String;

			//MULTIPLE STRINGS
			static auto split(const String &val, const String &delim)->std::vector < String > ;
			static auto betweens(const String &val, const String &begin, const String &end = _T("")) -> std::vector<String>;

			//FILTER
			//ALPHABET-CONVERSION
			static auto toLowerCase(const String &str) -> String;
			static auto toUpperCase(const String &str) -> String;
			static auto replaceAll(const String &val, const String &before, const String &after) -> String;
			static auto replaceAll(const String &val, const std::vector<String> &befores, const String &after) -> String;
			static auto removeEmptySpace(const String &val) -> String;
			static auto removeEmptyHTMLSpace(const String &val) -> String;
		};
	};
};