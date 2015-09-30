#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ----------------------------------------------------------------------
	SUBSTITUTE -> TO_STRING, TO_SQL
---------------------------------------------------------------------- */
//TO_STRING
template<> auto StringUtil::toString(const WeakString &str) -> string
{
	return move(str.str());
}

//TO_SQL
template<> auto StringUtil::toSQL(const bool &flag) -> string
{
	return toString(flag);
}
template<> auto StringUtil::toSQL(const char &val) -> string
{
	return {'\'', val, '\'' };
}
template<> auto StringUtil::toSQL(const string &str) -> string
{
	if (str.empty() == true)
		return "NULL";
	else
		return "'" + str + "'";
}
template<> auto StringUtil::toSQL(const WeakString &str) -> string
{
	if (str.empty() == true)
		return "NULL";
	else
		return "'" + str.str() + "'";
}

/* ----------------------------------------------------------------------
	NUMBER-FORMAT
		IN MONETARY UNIT, ADD DELIMETER ','
		COLOR-FORMAT

	POSITIVE NUMBER IS RED,
		NEGATIVE NUMBER IS BLUE
		ZERO IS BLACK
---------------------------------------------------------------------- */
auto StringUtil::isNumeric(const string &str) -> bool
{
	try
	{
		stod( replaceAll(str, ",", "") );
	}
	catch (exception &e)
	{
		e;

		return false;
	}
	return true;
}
auto StringUtil::toNumber(const string &str) -> double
{
	string &numStr = replaceAll(str, ",", "");
	return stod(numStr);
}

auto StringUtil::numberFormat(double val, int precision) -> string
{
	//IF VALUE IS ZERO OR NULL
	if (val == 0.0)
		return "0";
	else if (val == INT_MIN)
		return "";

	string str = "";

	//SETTING
	bool isNegative = (val < 0);
	val = abs(val);
	
	int cipher = (int)log10(val) + 1;

	//PRECISION
	if (val != (unsigned long long)val)
	{
		int pointValue = (int)round((val - (unsigned long long)val) * pow(10.0, (double)precision));
		str = "." + to_string(pointValue);
	}

	//NATURAL NUMBER
	for (int i = 0; i < cipher; i++)
	{
		int num = (int)((unsigned long long)val % (unsigned long long)pow(10.0, i + 1.0)); //TRUNCATE UPPER DIGIT VALUE
		num = (int)(num / pow(10.0, (double)i));

		str = (char)(num + '0') + str;
		if((i + 1) % 3 == 0 && i < cipher - 1)
			str = "," + str;
	}
	
	//NEGATIVE NUMBER
	if(isNegative == true)
		str = "-" + str;

	return move(str);
}
auto StringUtil::percentFormat(double val, int precision) -> string
{
	if (val == INT_MIN)
		return "";
	return numberFormat(val * 100, precision) + "%";
}

auto StringUtil::colorNumberFormat(double value, int precision, double delimiter) -> string
{
	string color;

	if (value > delimiter)			color = "red";
	else if (value == delimiter)	color = "black";
	else							color = "blue";

	return substitute
		(
			"<font color='{1}'>{2}</font>",
			color,
			numberFormat(value, precision)
		);
}
auto StringUtil::colorPercentFormat(double value, int precision, double delimiter) -> string
{
	string color;

	if (value > delimiter)			color = "red";
	else if (value == delimiter)	color = "black";
	else							color = "blue";

	return substitute
		(
			"<font color='{1}'>{2}</font>",
			color,
			percentFormat(value, precision)
		);
}

/* ----------------------------------------------------------------------
	TRIM -> WITH LTRIM & RTRIM
		IT'S RIGHT, THE TRIM OF ORACLE
---------------------------------------------------------------------- */
auto StringUtil::trim(const string &val, const vector<string> &delims) -> string
{
	return move(WeakString(val).trim(delims).str());
}
auto StringUtil::ltrim(const string &val, const vector<string> &delims) -> string
{
	return move(WeakString(val).ltrim(delims).str());
}
auto StringUtil::rtrim(const string &val, const vector<string> &delims) -> string
{
	return move(WeakString(val).rtrim(delims).str());
}

auto StringUtil::trim(const string &str) -> string
{
	return move(WeakString(str).trim().str());
}
auto StringUtil::ltrim(const string &str) -> string
{
	return move(WeakString(str).ltrim().str());
}
auto StringUtil::rtrim(const string &str) -> string
{
	return move(WeakString(str).rtrim().str());
}

auto StringUtil::trim(const string &str, const string &delim) -> string
{
	return move(WeakString(str).trim(delim).str());
}
auto StringUtil::ltrim(const string &str, const string &delim)->string
{
	return move(WeakString(str).ltrim(delim).str());
}
auto StringUtil::rtrim(const string &str, const string &delim)->string
{
	return move(WeakString(str).rtrim(delim).str());
}

/* ----------------------------------------------------------------------
	EXTRACTORS
---------------------------------------------------------------------- */
//FINDERS
auto StringUtil::finds(const string &str,
	const vector<string> &delims, size_t startIndex) -> IndexPair<string>
{
	IndexPair<WeakString> &iPair = WeakString(str).finds(delims, startIndex);
	return { iPair.getIndex(), iPair.getValue().str() };
}
auto StringUtil::rfinds(const string &str,
	const vector<string> &delims, size_t endIndex) -> IndexPair<string>
{
	IndexPair<WeakString> &iPair = WeakString(str).rfinds(delims, endIndex);
	return { iPair.getIndex(), iPair.getValue().str() };
}

//SUBSTRING
auto StringUtil::substring(const string &str,
	size_t startIndex, size_t endIndex) -> string
{
	return move(WeakString(str).substring(startIndex, endIndex).str());
}
auto StringUtil::between(const string &str,
	const string &start, const string &end) -> string
{
	return move(WeakString(str).between(start, end).str());
}
auto StringUtil::addTab(const string &str, size_t n) -> string
{
	vector<string> &lines = split(str, "\n");

	string val;
	string tab;
	size_t i;

	val.reserve(val.size() + lines.size());
	tab.reserve(n);

	for (i = 0; i < n; i++)
		tab += "\t";

	for (i = 0; i < lines.size(); i++)
		val.append(tab + lines[i] + ((i == lines.size() - 1) ? "" : "\n"));

	return move(val);
}

//SUBSTRINGS
auto StringUtil::split(const string &str, const string &delim) -> vector<string>
{
	vector<WeakString> &arr = WeakString(str).split(delim);

	vector<string> resArray(arr.size());
	for (size_t i = 0; i < arr.size(); i++)
		resArray[i] = move(arr[i].str());

	return move(resArray);
}
auto StringUtil::betweens(const string &str,
	const string &start, const string &end) -> vector<string>
{
	vector<WeakString> &arr = WeakString(str).betweens(start, end);

	vector<string> resArray(arr.size());
	for (size_t i = 0; i < arr.size(); i++)
		resArray[i] = move(arr[i].str());

	return move(resArray);
}

/* ----------------------------------------------------------------------
	REPLACERS
---------------------------------------------------------------------- */
auto StringUtil::toLowerCase(const string &str) -> string
{
	return move(WeakString(str).toLowerCase());
}
auto StringUtil::toUpperCase(const string &str) -> string
{
	return move(WeakString(str).toUpperCase());
}

auto StringUtil::replaceAll(const string &str,
	const string &before, const string &after) -> string
{
	return move(WeakString(str).replaceAll(before, after));
}
auto StringUtil::replaceAll(const string &str,
	const vector<pair<string, string>> &pairs) -> string
{
	return move(WeakString(str).replaceAll(pairs));
}
