#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ----------------------------------------------------------------------
	SUBSTITUTE -> TO_STRING, TO_SQL
---------------------------------------------------------------------- */
//TO_STRING
template<> auto StringUtil::toString(const WeakString &str) -> std::string
{
	return move(str.str());
}

//TO_SQL
template<> auto StringUtil::toSQL(const bool &flag) -> std::string
{
	return toString(flag);
}
template<> auto StringUtil::toSQL(const char &val) -> std::string
{
	return {'\'', val, '\'' };
}
template<> auto StringUtil::toSQL(const std::string &str) -> std::string
{
	if (str.empty() == true)
		return "NULL";
	else
		return "'" + str + "'";
}
template<> auto StringUtil::toSQL(const WeakString &str) -> std::string
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
auto StringUtil::isNumeric(const std::string &str) -> bool
{
	try
	{
		stod( replaceAll(str, ",", "") );
	}
	catch (std::exception &e)
	{
		return false;
	}
	return true;
}
auto StringUtil::toNumber(const std::string &str) -> double
{
	std::string &numStr = replaceAll(str, ",", "");
	return stod(numStr);
}

auto StringUtil::numberFormat(double val, int precision) -> std::string
{
	std::string text;

	//IF VALUE IS ZERO
	if (val == 0.0)
		return "0";
	else if (val == LONG_MIN)
		return "";

	//SETTING
	bool isPositive = (val > 0);
	val = abs(val);
	//cout << "value: " << value << endl;
	int cipher = (int)log10(val) + 1;

	int i, j, k;
	int groups = (cipher - 1) / 3;

	if (val == (long long)val)
		precision = 0;

	//RESERVE
	text.reserve(cipher + groups + precision + 5);

	k = cipher;
	for (i = 0; i < cipher + groups; i++)
	{
		j = cipher + groups - i;

		if (j != 0 && j-- % 4 == 0)
			text += ",";
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
		std::string &precisionText = toString(pointValue).substr(2);
		text += precisionText;
	}
	//ADD POINT FROM HERE
	if (isPositive == false)
		text = "-" + text;

	return move(text);
}
auto StringUtil::percentFormat(double val, int precision) -> std::string
{
	if (val == INT_MIN)
		return "";
	return numberFormat(val * 100, precision) + "%";
}

auto StringUtil::colorNumberFormat(double value, int precision, double delimiter) -> std::string
{
	std::string color;

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
auto StringUtil::colorPercentFormat(double value, int precision, double delimiter) -> std::string
{
	std::string color;

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
auto StringUtil::trim(const std::string &val, const std::vector<std::string> &delims) -> std::string
{
	return move(WeakString(val).trim(delims).str());
}
auto StringUtil::ltrim(const std::string &val, const std::vector<std::string> &delims) -> std::string
{
	return move(WeakString(val).ltrim(delims).str());
}
auto StringUtil::rtrim(const std::string &val, const std::vector<std::string> &delims) -> std::string
{
	return move(WeakString(val).rtrim(delims).str());
}

auto StringUtil::trim(const std::string &str) -> std::string
{
	return move(WeakString(str).trim().str());
}
auto StringUtil::ltrim(const std::string &str) -> std::string
{
	return move(WeakString(str).ltrim().str());
}
auto StringUtil::rtrim(const std::string &str) -> std::string
{
	return move(WeakString(str).rtrim().str());
}

auto StringUtil::trim(const std::string &str, const std::string &delim) -> std::string
{
	return move(WeakString(str).trim(delim).str());
}
auto StringUtil::ltrim(const std::string &str, const std::string &delim)->std::string
{
	return move(WeakString(str).ltrim(delim).str());
}
auto StringUtil::rtrim(const std::string &str, const std::string &delim)->std::string
{
	return move(WeakString(str).rtrim(delim).str());
}

/* ----------------------------------------------------------------------
	EXTRACTORS
---------------------------------------------------------------------- */
//FINDERS
auto StringUtil::finds(const std::string &str,
	const std::vector<std::string> &delims, size_t startIndex) -> IndexPair<std::string>
{
	IndexPair<WeakString> &iPair = WeakString(str).finds(delims, startIndex);
	return { iPair.getIndex(), iPair.getValue().str() };
}
auto StringUtil::rfinds(const std::string &str,
	const std::vector<std::string> &delims, size_t endIndex) -> IndexPair<std::string>
{
	IndexPair<WeakString> &iPair = WeakString(str).rfinds(delims, endIndex);
	return { iPair.getIndex(), iPair.getValue().str() };
}

//SUBSTRING
auto StringUtil::substring(const std::string &str,
	size_t startIndex, size_t endIndex) -> std::string
{
	return move(WeakString(str).substring(startIndex, endIndex).str());
}
auto StringUtil::between(const std::string &str,
	const std::string &start, const std::string &end) -> std::string
{
	return move(WeakString(str).between(start, end).str());
}
auto StringUtil::addTab(const std::string &str, size_t n) -> std::string
{
	vector<std::string> &lines = split(str, "\n");

	std::string val;
	std::string tab;
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
auto StringUtil::split(const std::string &str, const std::string &delim) -> std::vector<std::string>
{
	std::vector<WeakString> &arr = WeakString(str).split(delim);

	std::vector<std::string> resArray(arr.size());
	for (size_t i = 0; i < arr.size(); i++)
		resArray[i] = move(arr[i].str());

	return move(resArray);
}
auto StringUtil::betweens(const std::string &str,
	const std::string &start, const std::string &end) -> std::vector<std::string>
{
	std::vector<WeakString> &arr = WeakString(str).betweens(start, end);

	std::vector<std::string> resArray(arr.size());
	for (size_t i = 0; i < arr.size(); i++)
		resArray[i] = move(arr[i].str());

	return move(resArray);
}

/* ----------------------------------------------------------------------
	REPLACERS
---------------------------------------------------------------------- */
auto StringUtil::toLowerCase(const std::string &str) -> std::string
{
	return move(WeakString(str).toLowerCase());
}
auto StringUtil::toUpperCase(const std::string &str) -> std::string
{
	return move(WeakString(str).toUpperCase());
}

auto StringUtil::replaceAll(const std::string &str,
	const std::string &before, const std::string &after) -> std::string
{
	return move(WeakString(str).replaceAll(before, after));
}
auto StringUtil::replaceAll(const std::string &str,
	const std::vector<std::pair<std::string, std::string>> &pairs) -> std::string
{
	return move(WeakString(str).replaceAll(pairs));
}
