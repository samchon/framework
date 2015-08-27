#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ----------------------------------------------------------------------
	SUBSTITUTE -> TO_STRING, TO_SQL
---------------------------------------------------------------------- */
//TO_STRING
template<> auto StringUtil::toString(const WeakString &str) -> String
{
	return move(str.str());
}

//TO_SQL
template<> auto StringUtil::toSQL(const bool &flag) -> String
{
	return toString(flag);
}
template<> auto StringUtil::toSQL(const TCHAR &val) -> String
{
	return { _T('\''), val, _T('\'') };
}
template<> auto StringUtil::toSQL(const String &str) -> String
{
	if (str.empty() == true)
		return _T("NULL");
	else
		return _T('\'') + str + _T('\'');
}
template<> auto StringUtil::toSQL(const WeakString &str) -> String
{
	if (str.empty() == true)
		return _T("NULL");
	else
		return _T('\'') + str.str() + _T('\'');
}

/* ----------------------------------------------------------------------
	NUMBER-FORMAT
		IN MONETARY UNIT, ADD DELIMETER ','
		COLOR-FORMAT

	POSITIVE NUMBER IS RED,
		NEGATIVE NUMBER IS BLUE
		ZERO IS BLACK
---------------------------------------------------------------------- */
auto StringUtil::isNumeric(const String &str) -> bool
{
	try
	{
		stod( replaceAll(str, _T(","), _T("")) );
	}
	catch (std::exception &e)
	{
		return false;
	}
	return true;
}
auto StringUtil::toNumber(const String &str) -> double
{
	String &numStr = replaceAll(str, _T(","), _T(""));
	return stod(numStr);
}

auto StringUtil::numberFormat(double val, int precision) -> String
{
	String text;

	//IF VALUE IS ZERO
	if (val == 0.0)
		return _T("0");
	else if (val == LONG_MIN)
		return _T("");

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
			text += _T(",");
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
		String &precisionText = toString(pointValue).substr(2);
		text += precisionText;
	}
	//ADD POINT FROM HERE
	if (isPositive == false)
		text = _T("-") + text;

	return move(text);
}
auto StringUtil::percentFormat(double val, int precision) -> String
{
	if (val == INT_MIN)
		return _T("");
	return numberFormat(val * 100, precision) + _T("%");
}

auto StringUtil::colorNumberFormat(double value, int precision, double delimiter) -> String
{
	std::string color;

	if (value > delimiter)			color = _T("red");
	else if (value == delimiter)	color = _T("black");
	else							color = _T("blue");

	return substitute
		(
			_T("<font color='{1}'>{2}</font>"),
			color,
			numberFormat(value, precision)
		);
}
auto StringUtil::colorPercentFormat(double value, int precision, double delimiter) -> String
{
	std::string color;

	if (value > delimiter)			color = _T("red");
	else if (value == delimiter)	color = _T("black");
	else							color = _T("blue");

	return substitute
		(
			_T("<font color='{1}'>{2}</font>"),
			color,
			percentFormat(value, precision)
		);
}

/* ----------------------------------------------------------------------
	TRIM -> WITH LTRIM & RTRIM
		IT'S RIGHT, THE TRIM OF ORACLE
---------------------------------------------------------------------- */
auto StringUtil::trim(const String &val, const std::vector<String> &delims) -> String
{
	return move(WeakString(val).trim(delims).str());
}
auto StringUtil::ltrim(const String &val, const std::vector<String> &delims) -> String
{
	return move(WeakString(val).ltrim(delims).str());
}
auto StringUtil::rtrim(const String &val, const std::vector<String> &delims) -> String
{
	return move(WeakString(val).rtrim(delims).str());
}

auto StringUtil::trim(const String &str) -> String
{
	return move(WeakString(str).trim().str());
}
auto StringUtil::ltrim(const String &str) -> String
{
	return move(WeakString(str).ltrim().str());
}
auto StringUtil::rtrim(const String &str) -> String
{
	return move(WeakString(str).rtrim().str());
}

auto StringUtil::trim(const String &str, const String &delim) -> String
{
	return move(WeakString(str).trim(delim).str());
}
auto StringUtil::ltrim(const String &str, const String &delim)->String
{
	return move(WeakString(str).ltrim(delim).str());
}
auto StringUtil::rtrim(const String &str, const String &delim)->String
{
	return move(WeakString(str).rtrim(delim).str());
}

/* ----------------------------------------------------------------------
	EXTRACTORS
---------------------------------------------------------------------- */
//FINDERS
auto StringUtil::finds(const String &str,
	const std::vector<String> &delims, size_t startIndex) -> IndexPair<String>
{
	IndexPair<WeakString> &iPair = WeakString(str).finds(delims, startIndex);
	return { iPair.getIndex(), iPair.getValue().str() };
}
auto StringUtil::rfinds(const String &str,
	const std::vector<String> &delims, size_t endIndex) -> IndexPair<String>
{
	IndexPair<WeakString> &iPair = WeakString(str).rfinds(delims, endIndex);
	return { iPair.getIndex(), iPair.getValue().str() };
}

//SUBSTRING
auto StringUtil::substring(const String &str,
	size_t startIndex, size_t endIndex) -> String
{
	return move(WeakString(str).substring(startIndex, endIndex).str());
}
auto StringUtil::between(const String &str,
	const String &start, const String &end) -> String
{
	return move(WeakString(str).between(start, end).str());
}
auto StringUtil::addTab(const String &str, size_t n) -> String
{
	vector<String> &lines = split(str, _T("\n"));

	String val;
	String tab;
	size_t i;

	val.reserve(val.size() + lines.size());
	tab.reserve(n);

	for (i = 0; i < n; i++)
		tab += _T("\t");

	for (i = 0; i < lines.size(); i++)
		val.append(tab + lines[i] + ((i == lines.size() - 1) ? _T("") : _T("\n")));

	return move(val);
}

//SUBSTRINGS
auto StringUtil::split(const String &str, const String &delim) -> std::vector<String>
{
	std::vector<WeakString> &arr = WeakString(str).split(delim);

	std::vector<String> resArray(arr.size());
	for (size_t i = 0; i < arr.size(); i++)
		resArray[i] = move(arr[i].str());

	return move(resArray);
}
auto StringUtil::betweens(const String &str,
	const String &start, const String &end) -> std::vector<String>
{
	std::vector<WeakString> &arr = WeakString(str).betweens(start, end);

	std::vector<String> resArray(arr.size());
	for (size_t i = 0; i < arr.size(); i++)
		resArray[i] = move(arr[i].str());

	return move(resArray);
}

/* ----------------------------------------------------------------------
	REPLACERS
---------------------------------------------------------------------- */
auto StringUtil::toLowerCase(const String &str) -> String
{
	return move(WeakString(str).toLowerCase());
}
auto StringUtil::toUpperCase(const String &str) -> String
{
	return move(WeakString(str).toUpperCase());
}

auto StringUtil::replaceAll(const String &str,
	const String &before, const String &after) -> String
{
	return move(WeakString(str).replaceAll(before, after));
}
auto StringUtil::replaceAll(const String &str,
	const std::vector<std::pair<String, String>> &pairs) -> String
{
	return move(WeakString(str).replaceAll(pairs));
}
