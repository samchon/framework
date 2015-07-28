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
		template <typename _Elem> class SAMCHON_FRAMEWORK_API BasicStringUtil;
		typedef BasicStringUtil<char> StringUtilA;
		typedef BasicStringUtil<wchar_t> StringUtilW;

		typedef BasicStringUtil<TCHAR> StringUtil;

		template <typename _Elem>
		class SAMCHON_FRAMEWORK_API BasicStringUtil
		{
		protected:
			/* ----------------------------------------------------------------------
				SUBSTITUTE -> BASE METHODS
			---------------------------------------------------------------------- */
			//REPLACER
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

			static const std::vector<std::basic_string<_Elem>> SPACE_ARRAY;
			static const std::vector<std::basic_string<_Elem>> HTML_SPACE_ARRAY;

			enum
			{
				RED = 1, BLACK = 0, BLUE = -1
			};
			static auto FONT_COLOR(long) -> std::basic_string<_Elem>;
			static std::basic_string<_Elem> FONT_END;

		public:
			//SUBSTITUTE
			template <typename _Ty, typename ... Types > static auto substitute(const std::basic_string<_Elem> &format, const _Ty& value, const Types& ... args) -> std::basic_string<_Elem>
			{
				std::basic_string<_Elem> &res = _substitute(format, value);
				return StringUtil::substitute(res, args...);
			};
			template <typename _Ty> static auto substitute(const std::basic_string<_Elem> &format, const _Ty& value) -> std::basic_string<_Elem>
			{
				return _substitute(format, value);
			};

			template <typename _Ty, typename ... Types > static auto substituteSQL(const std::basic_string<_Elem> &format, const _Ty& value, const Types& ... args) -> std::basic_string<_Elem>
			{
				std::basic_string<_Elem> &res = _substituteSQL(format, value);
				return StringUtil::substituteSQL(res, args...);
			};
			template <typename _Ty> static auto substituteSQL(const std::basic_string<_Elem> &format, const _Ty& value) -> std::basic_string<_Elem>
			{
				return _substituteSQL(format, value);
			};

			/* ----------------------------------------------------------------------
				SUBSTITUTE -> TO_STRING
			---------------------------------------------------------------------- */
			static auto toString(const long double &val) -> std::basic_string<_Elem>;
			static auto toString(const double &val) -> std::basic_string<_Elem>;
			static auto toString(const float &val) -> std::basic_string<_Elem>;
			static auto toString(const unsigned long long &val) -> std::basic_string<_Elem>;
			static auto toString(const long long &val) -> std::basic_string<_Elem>;
			static auto toString(const unsigned long &val) -> std::basic_string<_Elem>;
			static auto toString(const long &val) -> std::basic_string<_Elem>;
			static auto toString(const unsigned int &val) -> std::basic_string<_Elem>;
			static auto toString(const int &val) -> std::basic_string<_Elem>;
			static auto toString(const bool &val) -> std::basic_string<_Elem>;

			static auto toString(const _Elem &val) -> std::basic_string<_Elem>;
			static auto toString(const _Elem *val) -> std::basic_string<_Elem>;
			static auto toString(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;

			static auto toSQL(const long double &val) -> std::basic_string<_Elem>;
			static auto toSQL(const double &val) -> std::basic_string<_Elem>;
			static auto toSQL(const float &val) -> std::basic_string<_Elem>;
			static auto toSQL(const unsigned long long &val) -> std::basic_string<_Elem>;
			static auto toSQL(const long long &val) -> std::basic_string<_Elem>;
			static auto toSQL(const unsigned long &val) -> std::basic_string<_Elem>;
			static auto toSQL(const long &val) -> std::basic_string<_Elem>;
			static auto toSQL(const unsigned int &val) -> std::basic_string<_Elem>;
			static auto toSQL(const int &val) -> std::basic_string<_Elem>;
			static auto toSQL(const bool &val) -> std::basic_string<_Elem>;

			static auto toSQL(const _Elem &val) -> std::basic_string<_Elem>;
			static auto toSQL(const _Elem *val)->std::basic_string<_Elem>;
			static auto toSQL(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;

			static void toClipboard(const std::basic_string<_Elem> &val);

			/* ----------------------------------------------------------------------
				NUMBER-FORMAT
					IN MONETARY UNIT, ADD DELIMETER ','
					COLOR-FORMAT
				POSITIVE NUMBER IS RED,
					NEGATIVE NUMBER IS BLUE
			---------------------------------------------------------------------- */
			//CONVERSION
			static auto isNumeric(const std::basic_string<_Elem> &str) -> bool;
			static auto toNumber(const std::basic_string<_Elem> &str) -> double;

			static auto numberFormat(double value, unsigned int precision = 2) -> std::basic_string<_Elem>;
			static auto percentFormat(double value, unsigned int precision = 2) -> std::basic_string<_Elem>;

			static auto colorNumberFormat(double value, unsigned int precision = 2, double delimiter = 0.0) -> std::basic_string<_Elem>;
			static auto colorPercentFormat(double value, unsigned int precision = 2, double delimiter = 0.0) -> std::basic_string<_Elem>;

			/* ----------------------------------------------------------------------
				TRIM -> WITH LTRIM & RTRIM
				IT'S RIGHT, THE TRIM OF ORACLE
			---------------------------------------------------------------------- */
			static auto trim(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;
			static auto ltrim(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;
			static auto rtrim(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;

			static auto trim(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &delim) -> std::basic_string<_Elem>;
			static auto ltrim(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &delim) -> std::basic_string<_Elem>;
			static auto rtrim(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &delim) -> std::basic_string<_Elem>;

			static auto trim(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims) -> std::basic_string<_Elem>;
			static auto ltrim(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims) -> std::basic_string<_Elem>;
			static auto rtrim(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims) -> std::basic_string<_Elem>;

			/* ----------------------------------------------------------------------
				STRING UTILITY
			---------------------------------------------------------------------- */
			//FIND -> PAIR<INDEX, SIZE_OF_STRING>: FIND THE LAST INDEX OF CONTAINERS
			static auto find(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims, const size_t x = 0) -> IndexPair<size_t>;
			static auto rfind(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &delims, const size_t x = SIZE_MAX) -> IndexPair<size_t>;

			//SINGLE STRING
			static auto substring(const std::basic_string<_Elem> &val, size_t begin, size_t end = SIZE_MAX) -> std::basic_string<_Elem>;
			static auto between(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &begin = std::basic_string<_Elem>(), const std::basic_string<_Elem> &end = std::basic_string<_Elem>()) -> std::basic_string<_Elem>;

			//TAB
			static auto addTab(const std::basic_string<_Elem> &str, size_t n = 1) -> std::basic_string<_Elem>;

			//MULTIPLE STRINGS
			static auto split(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &delim)->std::vector < std::basic_string<_Elem> > ;
			static auto betweens(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &begin, const std::basic_string<_Elem> &end = std::basic_string<_Elem>()) -> std::vector<std::basic_string<_Elem>>;

			//FILTER
			//ALPHABET-CONVERSION
			static auto toLowerCase(const std::basic_string<_Elem> &str) -> std::basic_string<_Elem>;
			static auto toUpperCase(const std::basic_string<_Elem> &str) -> std::basic_string<_Elem>;
			static auto replaceAll(const std::basic_string<_Elem> &val, const std::basic_string<_Elem> &before, const std::basic_string<_Elem> &after) -> std::basic_string<_Elem>;
			static auto replaceAll(const std::basic_string<_Elem> &val, const std::vector<std::basic_string<_Elem>> &befores, const std::basic_string<_Elem> &after) -> std::basic_string<_Elem>;
			static auto removeEmptySpace(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;
			static auto removeEmptyHTMLSpace(const std::basic_string<_Elem> &val) -> std::basic_string<_Elem>;
		};
	};
};