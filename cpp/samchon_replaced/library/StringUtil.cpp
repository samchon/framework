#include <samchon/library/StringUtil.hpp>
#include <queue>

using namespace std;
using namespace samchon;
using namespace samchon::library;

const vector<String> StringUtil::SPACE_ARRAY = { _T("\n"), _T("\t"), _T(" ") };
const vector<String> StringUtil::HTML_SPACE_ARRAY = { _T("\n"), _T("\t"), _T("  ") };

auto StringUtil::FONT_COLOR(long color) -> String
{
	String colorStr;

	if (color == RED)			colorStr = _T("red");
	else if (color == BLACK)	colorStr = _T("black");
	else if (color == BLUE)		colorStr = _T("blue");

	return substitute(_T("<font color='{1}'>"), colorStr);
}
String StringUtil::FONT_END = _T("</font>");

/* ----------------------------------------------------------------------
	SUBSTITUTE -> TO_STRING
---------------------------------------------------------------------- */
auto StringUtil::toString(const long double &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const double &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const float &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const unsigned long long &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const long long &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const unsigned long &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const long &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const unsigned int &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const int &val) -> String
{
	return ::toString(val);
}
auto StringUtil::toString(const bool &val) -> String
{
	return ::toString(val);
}

auto StringUtil::toString(const TCHAR &val) -> String
{
	return{ val };
}
auto StringUtil::toString(const TCHAR *val) -> String
{
	return val;
}
auto StringUtil::toString(const String &val) -> String
{
	return val;
}

auto StringUtil::toSQL(const long double &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const double &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const float &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const unsigned long long &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const long long &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const unsigned long &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const long &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const unsigned int &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const int &val) -> String
{
	return (val == LONG_MIN) ? _T("NULL") : toString(val);
};
auto StringUtil::toSQL(const bool &val) -> String
{
	return toString(val);
};

auto StringUtil::toSQL(const TCHAR &val) -> String
{
	return toSQL(String({ val }));
};
auto StringUtil::toSQL(const TCHAR *val) -> String
{
	return toSQL(String(val));
};
auto StringUtil::toSQL(const String &val) -> String
{
	return (val.empty() == true) ? _T("NULL") : _T("'") + toString(val) + _T("'");
};

//CLIPBOARD
/*void StringUtil::toClipboard(const String &val)
{
	size_t size = val.size() + 1;

	HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, size);
	memcpy(GlobalLock(hMem), val.c_str(), size);
	GlobalUnlock(hMem);
	OpenClipboard(0);
	EmptyClipboard();
	SetClipboardData(CF_TEXT, hMem);
	CloseClipboard();
}*/

/* ----------------------------------------------------------------------
	NUMBER-FORMAT
		IN MONETARY UNIT, ADD DELIMETER ','
	COLOR-FORMAT
		POSITIVE NUMBER IS RED,
		NEGATIVE NUMBER IS BLUE
---------------------------------------------------------------------- */
auto StringUtil::isNumeric(const String &str) -> bool
{
	size_t nCount = 0;

	for (size_t i = 0; i < str.size(); i++)
		if (_T('0') <= str[i] && str[i] <= _T('9'))
			nCount++;
		else if (str[i] != _T('.') && str[i] != _T('-'))
			return false;

	if (nCount == 0)
		return false;
	else
		return true;
}
auto StringUtil::toNumber(const String &str) -> double
{
	String &numStr = replaceAll(str, _T(","), _T(""));
	return stod(numStr);
}

auto StringUtil::numberFormat(double value, unsigned int precision) -> String
{
	String text;

	//IF VALUE IS ZERO
	if (value == 0.0) {
		return _T("0");
	}
	else if (value == LONG_MIN)
		return _T("");

	//SETTING
	bool isPositive = (value > 0);
	value = abs(value);
	//cout << "value: " << value << endl;
	int cipher = (int)log10(value) + 1;

	int i, j, k;
	int groups = (cipher - 1) / 3;
	int val;

	if (value == (long long)value)
		precision = 0;

	//RESERVE
	text.reserve(cipher + groups + precision + 5);

	k = cipher;
	for (i = 0; i < cipher + groups; i++)
	{
		j = cipher + groups - i;
		if (j != 0 && j-- % 4 == 0)
			text += _T(',');
		else
		{
			val = ((int)value % (int)pow(10.0, k)) / (int)pow(10.0, k - 1);
			text += toString(val);
			k--;
		}
	}

	//DECIMAL PART
	if (precision > 0)
	{
		double pointValue = (double)value - (long long)value;
		String &precisionText = toString(pointValue).substr(2);
		text += precisionText;
	}
	//ADD POINT FROM HERE
	if (isPositive == false)
		text = _T('-') + text;

	return move(text);
}
auto StringUtil::percentFormat(double value, unsigned int precision) -> String
{
	if (value == LONG_MIN)
		return _T("");
	return move(numberFormat(value * 100, precision) + _T('%'));
};

auto StringUtil::colorNumberFormat(double value, unsigned int precision, double delimiter) -> String
{
	long color;

	if (value > delimiter)			color = RED;
	else if (value == delimiter)	color = BLACK;
	else							color = BLUE;

	return move(FONT_COLOR(color) + numberFormat(value, precision) + FONT_END);
};
auto StringUtil::colorPercentFormat(double value, unsigned int precision, double delimiter) -> String
{
	long color;

	if (value > delimiter)			color = RED;
	else if (value == delimiter)	color = BLACK;
	else							color = BLUE;

	return move(FONT_COLOR(color) + percentFormat(value, precision) + FONT_END);
};

/* ----------------------------------------------------------------------
	TRIM -> WITH LTRIM & RTRIM
		IT'S RIGHT, THE TRIM OF ORACLE
---------------------------------------------------------------------- */
auto StringUtil::trim(const String &val) -> String
{
	return move(trim(val, SPACE_ARRAY));
};
auto StringUtil::ltrim(const String &val) -> String
{
	return move(ltrim(val, SPACE_ARRAY));
};
auto StringUtil::rtrim(const String &val) -> String
{
	return move(rtrim(val, SPACE_ARRAY));
};

auto StringUtil::trim(const String &val, const String &delim) -> String
{
	return move(rtrim(ltrim(val, delim), delim));
};
auto StringUtil::ltrim(const String &val, const String &delim) -> String
{
	size_t size = delim.size();

	size_t beginX = 0;
	size_t tempX;
	size_t x = String::npos;

	while (true)
	{
		tempX = val.find(delim, beginX);
		if (tempX != beginX)
			break;

		beginX = tempX + size;
		x = tempX;
	}
	if (x == String::npos)
		return val;
	else
		return move(val.substr(x + size));
};
auto StringUtil::rtrim(const String &val, const String &delim) -> String
{
	size_t size = delim.size();

	size_t endX = SIZE_MAX;
	size_t tempX;
	size_t x = val.size();

	while ((tempX = val.rfind(delim, endX)) == x - size)
	{
		x = tempX;
		endX = x - size;
	}
	return move(val.substr(0, x));
};

auto StringUtil::trim(const String &val, const vector<String> &delims) -> String
{
	return move(rtrim(ltrim(val, delims), delims));
};
auto StringUtil::ltrim(const String &val, const vector<String> &delims) -> String
{
	size_t beginX = 0;
	IndexPair<size_t> *pair;
	size_t x = String::npos;

	while (true)
	{
		pair = &find(val, delims, beginX);
		if (pair->getValue() != beginX)
			break;

		beginX = pair->getValue() + delims[pair->getIndex()].size();
		x = pair->getValue();
	}
	if (x == String::npos)
		return val;
	else
		return move(val.substr(x + delims[pair->getIndex()].size()));
};
auto StringUtil::rtrim(const String &val, const vector<String> &delims) -> String
{
	IndexPair<size_t> *pair;
	size_t x = val.size() - 1;

	while (true)
	{
		pair = &rfind(val, delims, x);
		if (pair->getValue() == String::npos || pair->getValue() != x - delims[pair->getIndex()].size() + 1)
			break;

		x = pair->getValue() - 1;
	}
	return move(val.substr(0, x + 1));
};

/* ----------------------------------------------------------------------
	STRING UTILITY
---------------------------------------------------------------------- */
//FIND -> PAIR<INDEX, SIZE_OF_STRING>: FIND THE LAST INDEX OF CONTAINERS
auto StringUtil::find(const String &val, const vector<String> &delims, const size_t x) -> IndexPair<size_t>
{
	vector<size_t> positionVector;
	positionVector.reserve(delims.size());

	for (size_t i = 0; i < delims.size(); i++)
		positionVector.push_back(val.find(delims[i], x));

	return Math::calcMin(positionVector);
};
auto StringUtil::rfind(const String &val, const vector<String> &delims, const size_t x) -> IndexPair<size_t>
{
	vector<size_t> positionVector;
	positionVector.reserve(delims.size());

	size_t position;

	for (size_t i = 0; i < delims.size(); i++)
	{
		position = val.rfind(delims[i], x);

		if (position != String::npos)
			positionVector.push_back(position);
	}
	if (positionVector.empty() == true)
		return{ String::npos, String::npos };
	else
		return Math::calcMax(positionVector);
};

//SINGLE STRING
auto StringUtil::substring(const String &val, size_t begin, size_t end) -> String
{
	if (end == SIZE_MAX)
		return val.substr(begin);
	else
		return val.substr(begin, end - begin);
};
auto StringUtil::between(const String &val, const String &begin, const String &end) -> String
{
	//between("ABCDE", "A", "E" = "BCD"
	if (begin.empty() && end.empty())
		return val;
	else if (begin.empty())
		return substring(val, 0, val.find(end));
	else if (end.empty())
		return val.substr(val.find(begin) + begin.size());
	else
	{
		size_t startPoint = val.find(begin);
		return substring
			(
			val,
			startPoint + begin.size(),
			val.find(end, startPoint + begin.size())
			);
	}
};

//TAB
auto StringUtil::addTab(const String &str, size_t n) -> String
{
	vector<String> &lines = split(str, _T("\n"));

	String val;
	String tab;
	size_t i;

	val.reserve(val.size() + lines.size());
	tab.reserve(n);

	for (i = 0; i < n; i++)
		tab += '\t';

	for (i = 0; i < lines.size(); i++)
		val.append(tab + lines[i] + ((i == lines.size() - 1) ? _T("") : _T("\n")));

	return move(val);
};

//MULTIPLE STRINGS
auto StringUtil::split(const String &val, const String &delim) -> vector<String>
{
	//split("A_B_C", "_" = {"A", "B", "C"}
	size_t beginX = 0;

	size_t size = delim.size();
	size_t x;

	//CONSTRUCT THE LIST OF QUOTES
	queue<pair<size_t, size_t>> quoteList;
	while ((x = val.find(delim, beginX)) != String::npos)
	{
		quoteList.push({ beginX, x });
		beginX = x + size;
	}
	quoteList.push({ beginX, val.size() });

	//ASSIGN THE STRING_VECTOR BY SUBSTRING
	vector<String> vec;
	vec.reserve(quoteList.size());

	while (quoteList.empty() == false)
	{
		vec.push_back(substring(val, quoteList.front().first, quoteList.front().second));
		quoteList.pop();
	}
	return move(vec);
};
auto StringUtil::betweens(const String &val, const String &begin, const String &end) -> vector<String>
{
	//betweens(-AB--CD--EF-, "-", "-" = {"AB", "CD", "EF"}
	vector<String> vec;

	if (begin.empty() && end.empty())
		return move(vec);
	else if (begin == end) //공백은 아니나 begin과 end가 같다면
	{
		queue<pair<size_t, size_t>> quoteList;

		size_t x, prevX = -1, n = 0;
		while ((x = val.find(begin, prevX + 1)) != String::npos)
		{
			if (++n % 2 == 0) //짝수개 째
				quoteList.push({ prevX, x });
			prevX = x;
		}

		if (quoteList.size() == 0)
			vec.push_back(val);
		else
		{
			vec.reserve(quoteList.size());
			while (quoteList.empty() == false)
			{
				pair<size_t, size_t> &quote = quoteList.front();
				vec.push_back(substring(val, quote.first + begin.size(), quote.second));

				quoteList.pop();
			}
		}
	}
	else //begin과 end가 다르다
	{
		vec = split(val, begin);
		vec.erase(vec.begin());

		if (end.empty() == false)
			for (long long i = vec.size() - 1; i >= 0; i--)
				if (vec.at((size_t)i).find(end) == String::npos)
					vec.erase(vec.begin() + (size_t)i);
				else
					vec[(size_t)i] = move(between(vec[(size_t)i], String(), end));
	}
	return move(vec);
};

//FILTER
//ALPHABET-CONVERSION
auto StringUtil::toLowerCase(const String &str) -> String
{
	String dest;
	dest.assign(NULL, str.size());

	for (size_t i = 0; i < str.size(); i++)
		if ('A' <= str[i] && str[i] <= 'Z')
			dest[i] = tolower(str[i]);

	return move(dest);
}
auto StringUtil::toUpperCase(const String &str) -> String
{
	String dest;
	dest.assign(NULL, str.size());

	for (size_t i = 0; i < str.size(); i++)
		if ('a' <= str[i] && str[i] <= 'z')
			dest[i] = toupper(str[i]);

	return move(dest);
}
auto StringUtil::replaceAll(const String &val, const String &before, const String &after) -> String
{
	queue<size_t> pointList;
	size_t x = 0;
	size_t prevX = 0;
	size_t beforeSize = before.size(), afterSize = after.size();

	while ((x = val.find(before, prevX)) != String::npos)
	{
		pointList.push(x);
		prevX = x + beforeSize;
	}
	if (pointList.empty() == true)
		return val;

	String res;
	res.reserve(val.size() + pointList.size()*(afterSize - beforeSize) + 1);

	//첫 문장 입력
	x = pointList.front();
	res.append(val.substr(0, x));

	while (pointList.size() > 1)
	{
		prevX = x;
		pointList.pop();
		x = pointList.front();

		res.append(after);
		res.append(substring(val, prevX + beforeSize, x));
	}
	pointList.pop();

	//마지막 교체 입력 및 문장 입력
	res.append(after);
	res.append(val.substr(x + beforeSize));

	return move(res);
};
auto StringUtil::replaceAll(const String &val, const vector<String> &befores, const String &after) -> String
{
	String res = val;
	//cout << res << endl;

	while (find(res, befores).getValue() != String::npos)
		for (size_t i = 0; i < befores.size(); i++)
			res = replaceAll(res, befores[i], after);

	return res;
};
auto StringUtil::removeEmptySpace(const String &val) -> String
{
	return replaceAll(val, SPACE_ARRAY, _T(""));
};
auto StringUtil::removeEmptyHTMLSpace(const String &val) -> String
{
	return replaceAll(val, HTML_SPACE_ARRAY, _T(" "));
};