#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <string>

#include <vector>
#include <samchon/Charset.hpp>
#include <samchon/IterPair.hpp>
#include <samchon/Math.hpp>

namespace samchon
{
	using namespace std;

	template <typename C> class SAMCHON_LIBRARY_API BasicStringUtil;
	typedef BasicStringUtil<char> StringUtil;
	typedef BasicStringUtil<wchar_t> WStringUtil;

	template <typename C>
	class SAMCHON_LIBRARY_API BasicStringUtil 
		: protected BasicCharset<C>
	{
		/* ----------------------------------------------------------------------
			SUBSTITUTE -> BASE METHODS
		---------------------------------------------------------------------- */
	protected:
		//REPLACER
		template <typename T> static auto _substitute(const basic_string<C> &format, const T& value) -> basic_string<C>
		{
			vector<basic_string<C>> &parenthesisArray = betweens(format, { (C)'{' }, { (C)'}' });
			vector<long> vec;

			for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
				if (isNumeric(*it) == true)
					vec.push_back(stoi(*it));

			size_t index = (size_t)Math::calcMin(vec).getValue();

			//replaceAll
			basic_string<C> &to = to_string(value);
			return replaceAll(format, (C)'{' + to_string(index) + (C)'}', to);
		};
		template <typename T> static auto _substituteSQL(const basic_string<C> &format, const T& value) -> basic_string<C>
		{
			vector<basic_string<C>> &parenthesisArray = betweens(format, { _t("{") }, { _t("}") });
			vector<long> vec;

			for (auto it = parenthesisArray.begin(); it != parenthesisArray.end(); it++)
				if (isNumeric(*it) == true)
					vec.push_back(stoi(*it));

			size_t index = (size_t)Math::calcMin(vec).getValue();

			//replaceAll
			basic_string<C> &to = to_sql(value);
			return replaceAll(format, _t("{") + to_string(index) + _t("}"), to);
		};
		
		static const vector<basic_string<C>> SPACE_ARRAY;
		static const vector<basic_string<C>> HTML_SPACE_ARRAY;

		enum
		{
			RED = 1, BLACK = 0, BLUE = -1
		};
		static auto FONT_COLOR(long) -> basic_string<C>;
		static basic_string<C> FONT_END;

	public:
		//SUBSTITUTE
		template <typename T, typename ... Types > static auto substitute(const basic_string<C> &format, const T& value, const Types& ... args) -> basic_string<C>
		{
			basic_string<C> &res = _substitute(format, value);
			return BasicStringUtil::substitute(res, args...);
		};
		template <typename T> static auto substitute(const basic_string<C> &format, const T& value) -> basic_string<C>
		{
			return _substitute(format, value);
		};

		template <typename T, typename ... Types > static auto substituteSQL(const basic_string<C> &format, const T& value, const Types& ... args) -> basic_string<C>
		{
			basic_string<C> &res = _substituteSQL(format, value);
			return BasicStringUtil::substituteSQL(res, args...);
		};
		template <typename T> static auto substituteSQL(const basic_string<C> &format, const T& value) -> basic_string<C>
		{
			return _substituteSQL(format, value);
		};

		/* ----------------------------------------------------------------------
			SUBSTITUTE -> TO_STRING
		---------------------------------------------------------------------- */
		static auto to_string(const long double &val) -> basic_string<C>;
		static auto to_string(const double &val) -> basic_string<C>;
		static auto to_string(const float &val) -> basic_string<C>;
		static auto to_string(const unsigned long long &val) -> basic_string<C>;
		static auto to_string(const long long &val) -> basic_string<C>;
		static auto to_string(const unsigned long &val) -> basic_string<C>;
		static auto to_string(const long &val) -> basic_string<C>;
		static auto to_string(const unsigned int &val) -> basic_string<C>;
		static auto to_string(const int &val) -> basic_string<C>;
		static auto to_string(const bool &val) -> basic_string<C>;

		static auto to_string(const C &val) -> basic_string<C>;
		static auto to_string(const C *val) -> basic_string<C>;
		static auto to_string(const basic_string<C> &val) -> basic_string<C>;

		static auto to_sql(const long double &val) -> basic_string<C>;
		static auto to_sql(const double &val) -> basic_string<C>;
		static auto to_sql(const float &val) -> basic_string<C>;
		static auto to_sql(const unsigned long long &val) -> basic_string<C>;
		static auto to_sql(const long long &val) -> basic_string<C>;
		static auto to_sql(const unsigned long &val) -> basic_string<C>;
		static auto to_sql(const long &val) -> basic_string<C>;
		static auto to_sql(const unsigned int &val) -> basic_string<C>;
		static auto to_sql(const int &val) -> basic_string<C>;
		static auto to_sql(const bool &val) -> basic_string<C>;
		
		static auto to_sql(const C &val) -> basic_string<C>;
		static auto to_sql(const C *val) -> basic_string<C>;
		static auto to_sql(const basic_string<C> &val) -> basic_string<C>;

		static void toClipboard(const basic_string<C> &val);
	
		/* ----------------------------------------------------------------------
			NUMBER-FORMAT
				IN MONETARY UNIT, ADD DELIMETER ','
			COLOR-FORMAT
				POSITIVE NUMBER IS RED,
				NEGATIVE NUMBER IS BLUE
		---------------------------------------------------------------------- */
		//CONVERSION
		static auto isNumeric(const basic_string<C> &str) -> bool;
		static auto toNumber(const basic_string<C> &str) -> double;

		static auto numberFormat(double value, unsigned int precision = 2) -> basic_string<C>;
		static auto percentFormat(double value, unsigned int precision = 2) -> basic_string<C>;
		
		static auto colorNumberFormat(double value, unsigned int precision = 2, double delimiter = 0.0) -> basic_string<C>;
		static auto colorPercentFormat(double value, unsigned int precision = 2, double delimiter = 0.0) -> basic_string<C>;

		/* ----------------------------------------------------------------------
			TRIM -> WITH LTRIM & RTRIM
				IT'S RIGHT, THE TRIM OF ORACLE
		---------------------------------------------------------------------- */
		static auto trim(const basic_string<C> &val) -> basic_string<C>;
		static auto ltrim(const basic_string<C> &val) -> basic_string<C>;
		static auto rtrim(const basic_string<C> &val) -> basic_string<C>;

		static auto trim(const basic_string<C> &val, const basic_string<C> &delim) -> basic_string<C>;
		static auto ltrim(const basic_string<C> &val, const basic_string<C> &delim) -> basic_string<C>;
		static auto rtrim(const basic_string<C> &val, const basic_string<C> &delim) -> basic_string<C>;

		static auto trim(const basic_string<C> &val, const vector<basic_string<C>> &delims) -> basic_string<C>;
		static auto ltrim(const basic_string<C> &val, const vector<basic_string<C>> &delims) -> basic_string<C>;
		static auto rtrim(const basic_string<C> &val, const vector<basic_string<C>> &delims) -> basic_string<C>;

		/* ----------------------------------------------------------------------
			STRING UTILITY
		---------------------------------------------------------------------- */
		//FIND -> PAIR<INDEX, SIZE_OF_STRING>: FIND THE LAST INDEX OF CONTAINERS
		static auto find(const basic_string<C> &val, const vector<basic_string<C>> &delims, const size_t x = 0) -> IterPair<size_t>;
		static auto rfind(const basic_string<C> &val, const vector<basic_string<C>> &delims, const size_t x = SIZE_MAX) -> IterPair<size_t>;

		//SINGLE STRING
		static auto substring(const basic_string<C> &val, size_t begin, size_t end = SIZE_MAX) -> basic_string<C>;
		static auto between(const basic_string<C> &val, const basic_string<C> &begin = basic_string<C>(), const basic_string<C> &end = basic_string<C>()) -> basic_string<C>;

		//TAB
		static auto addTab(const basic_string<C> &str, size_t n = 1) -> basic_string<C>;
		
		//MULTIPLE STRINGS
		static auto split(const basic_string<C> &val, const basic_string<C> &delim) -> vector<basic_string<C>>;
		static auto betweens(const basic_string<C> &val, const basic_string<C> &begin, const basic_string<C> &end = basic_string<C>()) -> vector<basic_string<C>>;

		//FILTER
		//ALPHABET-CONVERSION
		static auto toLowerCase(const basic_string<C> &str) -> basic_string<C>;
		static auto toUpperCase(const basic_string<C> &str) -> basic_string<C>;
		static auto replaceAll(const basic_string<C> &val, const basic_string<C> &before, const basic_string<C> &after) -> basic_string<C>;
		static auto replaceAll(const basic_string<C> &val, const vector<basic_string<C>> &befores, const basic_string<C> &after) -> basic_string<C>;
		static auto removeEmptySpace(const basic_string<C> &val) -> basic_string<C>;
		static auto removeEmptyHTMLSpace(const basic_string<C> &val) -> basic_string<C>;

		//URL ENCODING
		static auto encodeURIComponent(const basic_string<C> &val) -> basic_string<C>;
		static auto decodeURIComponent(const basic_string<C> &val) -> basic_string<C>;
		static auto encodeURI(const basic_string<C> &val) -> basic_string<C>;
		inline static auto decodeURI(const basic_string<C> &val) -> basic_string<C>
		{
			return decodeURIComponent(val);
		};
	};
};