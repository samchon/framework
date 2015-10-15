#include <samchon/StringUtil.hpp>

#include <queue>

#ifndef WIN32_LEAN_AND_MEAN 
#define WIN32_LEAN_AND_MEAN 
#endif 
#include <Windows.h>

namespace samchon
{
	const vector<string> StringUtil::SPACE_ARRAY = {"\n", "\t", " "};
	const vector<string> StringUtil::HTML_SPACE_ARRAY = { "\n", "\t", "  " };

	template<> auto StringUtil::FONT_COLOR(long color) -> string
	{
		string colorStr;

		if (color == RED)			colorStr = "red";
		else if (color == BLACK)	colorStr = "black";
		else if (color == BLUE)		colorStr = "blue";

		return substitute("<font color='{1}'>", colorStr);
	}
	string StringUtil::FONT_END = "</font>";

	/* ----------------------------------------------------------------------
		SUBSTITUTE -> TO_STRING
	---------------------------------------------------------------------- */
	template<> auto StringUtil::to_string(const long double &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const double &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const float &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const unsigned long long &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const long long &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const unsigned long &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const long &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const unsigned int &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const int &val) -> string
	{
		return std::to_string(val);
	}
	template<> auto StringUtil::to_string(const bool &val) -> string
	{
		return std::to_string(val);
	}
	
	template<> auto StringUtil::to_string(const char &val) -> string
	{
		return{ val };
	}
	template<> auto StringUtil::to_string(const char *val) -> string
	{
		return val;
	}
	template<> auto StringUtil::to_string(const string &val) -> string
	{
		return val;
	}

	template<> auto StringUtil::to_sql(const long double &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const double &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const float &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const unsigned long long &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const long long &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const unsigned long &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const long &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const unsigned int &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const int &val) -> string
	{ 
		return (val == LONG_MIN) ? "NULL" : to_string(val); 
	};
	template<> auto StringUtil::to_sql(const bool &val) -> string
	{ 
		return to_string(val); 
	};
	
	template<> auto StringUtil::to_sql(const char &val) -> string
	{
		return to_sql(string({ val }));
	};
	template<> auto StringUtil::to_sql(const char *val) -> string
	{
		return to_sql(string(val));
	};
	template<> auto StringUtil::to_sql(const string &val) -> string
	{
		return (val.empty() == true) ? "NULL" : '\'' + to_string(val) + '\'';
	};

	//CLIPBOARD
	template<> void StringUtil::toClipboard(const string &val)
	{
		size_t size = val.size() + 1;

		HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, size);
		memcpy(GlobalLock(hMem), val.c_str(), size);
		GlobalUnlock(hMem);
		OpenClipboard(0);
		EmptyClipboard();
		SetClipboardData(CF_TEXT, hMem);
		CloseClipboard();
	}

	/* ----------------------------------------------------------------------
		NUMBER-FORMAT
			IN MONETARY UNIT, ADD DELIMETER ','
		COLOR-FORMAT
			POSITIVE NUMBER IS RED,
			NEGATIVE NUMBER IS BLUE
	---------------------------------------------------------------------- */
	template<> auto StringUtil::isNumeric(const string &str) -> bool
	{
		size_t nCount = 0;

		for (size_t i = 0; i < str.size(); i++)
			if ('0' <= str[i] && str[i] <= '9')
				nCount++;
			else if (str[i] != '.' && str[i] != '-')
				return false;

		if (nCount == 0)
			return false;
		else
			return true;
	}
	template<> auto StringUtil::toNumber(const string &str) -> double
	{
		string &numStr = replaceAll(str, ",", "");
		return stod(numStr);
	}

	template<> auto StringUtil::numberFormat(double value, unsigned int precision) -> string
	{
		string text;

		//IF VALUE IS ZERO
		if (value == 0.0) {
			return "0";
		}
		else if (value == LONG_MIN)
			return "";

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
				text += ',';
			else 
			{
				val = ((int)value % (int)pow(10.0, k)) / (int)pow(10.0, k - 1);
				text += to_string(val);
				k--;
			}
		}

		//DECIMAL PART
		if (precision > 0)
		{
			double pointValue = (double)value - (long long)value;
			string &precisionText = to_string(pointValue).substr(2);
			text += precisionText;
		}
		//ADD POINT FROM HERE
		if (isPositive == false)
			text = '-' + text;

		return move(text);
	}
	template<> auto StringUtil::percentFormat(double value, unsigned int precision) -> string
	{
		if (value == LONG_MIN)
			return "";
		return move( numberFormat(value * 100, precision) + '%');
	};

	template<> auto StringUtil::colorNumberFormat(double value, unsigned int precision, double delimiter) -> string
	{
		long color;

		if (value > delimiter)			color = RED;
		else if (value == delimiter)	color = BLACK;
		else							color = BLUE;

		return move( FONT_COLOR(color) + numberFormat(value, precision) + FONT_END );
	};
	template<> auto StringUtil::colorPercentFormat(double value, unsigned int precision, double delimiter) -> string
	{
		long color;

		if (value > delimiter)			color = RED;
		else if (value == delimiter)	color = BLACK;
		else							color = BLUE;

		return move( FONT_COLOR(color) + percentFormat(value, precision) + FONT_END );
	};

	/* ----------------------------------------------------------------------
		TRIM -> WITH LTRIM & RTRIM
			IT'S RIGHT, THE TRIM OF ORACLE
	---------------------------------------------------------------------- */
	template<> auto StringUtil::trim(const string &val) -> string
	{
		return move( trim(val, SPACE_ARRAY) );
	};
	template<> auto StringUtil::ltrim(const string &val) -> string
	{
		return move( ltrim(val, SPACE_ARRAY) );
	};
	template<> auto StringUtil::rtrim(const string &val) -> string
	{
		return move( rtrim(val, SPACE_ARRAY) );
	};

	template<> auto StringUtil::trim(const string &val, const string &delim) -> string
	{
		return move( rtrim(ltrim(val, delim), delim) );
	};
	template<> auto StringUtil::ltrim(const string &val, const string &delim) -> string
	{
		size_t size = delim.size();

		size_t beginX = 0;
		size_t tempX;
		size_t x = string::npos;

		while (true)
		{
			tempX = val.find(delim, beginX);
			if (tempX != beginX)
				break;

			beginX = tempX + size;
			x = tempX;
		}
		if (x == string::npos)
			return val;
		else
			return move( val.substr(x + size) );
	};
	template<> auto StringUtil::rtrim(const string &val, const string &delim) -> string
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
		return move( val.substr(0, x) );
	};

	template<> auto StringUtil::trim(const string &val, const vector<string> &delims) -> string
	{
		return move( rtrim(ltrim(val, delims), delims) );
	};
	template<> auto StringUtil::ltrim(const string &val, const vector<string> &delims) -> string
	{
		size_t beginX = 0;
		IterPair<size_t> *pair;
		size_t x = string::npos;

		while (true)
		{
			pair = &find(val, delims, beginX);
			if (pair->getValue() != beginX)
				break;

			beginX = pair->getValue() + delims[pair->getIndex()].size();
			x = pair->getValue();
		}
		if (x == string::npos)
			return val;
		else
			return move( val.substr(x + delims[pair->getIndex()].size()) );
	};
	template<> auto StringUtil::rtrim(const string &val, const vector<string> &delims) -> string
	{
		IterPair<size_t> *pair;
		size_t x = val.size() - 1;

		while (true)
		{
			pair = &rfind(val, delims, x);
			if (pair->getValue() == string::npos || pair->getValue() != x - delims[pair->getIndex()].size() + 1)
				break;

			x = pair->getValue() - 1;
		}
		return move( val.substr(0, x + 1) );
	};

	/* ----------------------------------------------------------------------
		STRING UTILITY
	---------------------------------------------------------------------- */
	//FIND -> PAIR<INDEX, SIZE_OF_STRING>: FIND THE LAST INDEX OF CONTAINERS
	template<> auto StringUtil::find(const string &val, const vector<string> &delims, const size_t x) -> IterPair<size_t>
	{
		vector<size_t> positionVector;
		positionVector.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
			positionVector.push_back(val.find(delims[i], x));

		return Math::calcMin(positionVector);
	};
	template<> auto StringUtil::rfind(const string &val, const vector<string> &delims, const size_t x) -> IterPair<size_t>
	{
		vector<size_t> positionVector;
		positionVector.reserve(delims.size());

		size_t position;

		for (size_t i = 0; i < delims.size(); i++)
		{
			position = val.rfind(delims[i], x);

			if (position != string::npos)
				positionVector.push_back(position);
		}
		if (positionVector.empty() == true)
			return{ string::npos, string::npos };
		else
			return Math::calcMax(positionVector);
	};

	//SINGLE STRING
	template<> auto StringUtil::substring(const string &val, size_t begin, size_t end) -> string
	{
		if (end == SIZE_MAX)
			return val.substr(begin);
		else
			return val.substr(begin, end - begin);
	};
	template<> auto StringUtil::between(const string &val, const string &begin, const string &end) -> string
	{
		//between("ABCDE", "A", "E") = "BCD"
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
	template<> auto StringUtil::addTab(const string &str, size_t n) -> string
	{
		vector<string> &lines = split(str, "\n");

		string val;
		string tab;
		size_t i;

		val.reserve(val.size() + lines.size());
		tab.reserve(n);

		for (i = 0; i < n; i++)
			tab += '\t';

		for (i = 0; i < lines.size(); i++)
			val.append(tab + lines[i] + ((i == lines.size() - 1) ? "" : "\n"));

		return move(val);
	};

	//MULTIPLE STRINGS
	template<> auto StringUtil::split(const string &val, const string &delim) -> vector<string>
	{
		//split("A_B_C", "_") = {"A", "B", "C"}
		size_t beginX = 0;

		size_t size = delim.size();
		size_t x;

		//CONSTRUCT THE LIST OF QUOTES
		queue<pair<size_t, size_t>> quoteList;
		while ((x = val.find(delim, beginX)) != string::npos)
		{
			quoteList.push({ beginX, x + size - 1 });
			beginX = x + size;
		}
		quoteList.push({ beginX, val.size() });

		//ASSIGN THE STRING_VECTOR BY SUBSTRING
		vector<string> vec;
		vec.reserve(quoteList.size());

		while (quoteList.empty() == false)
		{
			vec.push_back(substring(val, quoteList.front().first, quoteList.front().second));
			quoteList.pop();
		}
		return move(vec);
	};
	template<> auto StringUtil::betweens(const string &val, const string &begin, const string &end) -> vector<string>
	{
		//betweens(-AB--CD--EF-, "-", "-") = {"AB", "CD", "EF"}
		vector<string> vec;

		if (begin.empty() && end.empty())
			return move(vec);
		else if (begin == end) //공백은 아니나 begin과 end가 같다면
		{
			queue<pair<size_t, size_t>> quoteList;

			size_t x, prevX = -1, n = 0;
			while ((x = val.find(begin, prevX + 1)) != string::npos)
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
					if (vec.at(i).find(end) == string::npos)
						vec.erase(vec.begin() + i);
					else
						vec.at(i) = move(between(vec.at(i), string(), end));
		}
		return move(vec);
	};

	//FILTER
	//ALPHABET-CONVERSION
	template<> auto StringUtil::toLowerCase(const string &str) -> string
	{
		string dest;
		dest.assign(NULL, str.size());

		for (size_t i = 0; i < str.size(); i++)
			if ('A' <= str[i] && str[i] <= 'Z')
				dest[i] = tolower(str[i]);

		return move(dest);
	}
	template<> auto StringUtil::toUpperCase(const string &str) -> string
	{
		string dest;
		dest.assign(NULL, str.size());

		for (size_t i = 0; i < str.size(); i++)
			if ('a' <= str[i] && str[i] <= 'z')
				dest[i] = toupper(str[i]);

		return move(dest);
	}
	template<> auto StringUtil::replaceAll(const string &val, const string &before, const string &after) -> string
	{
		queue<size_t> pointList;
		size_t x = 0;
		size_t prevX = 0;
		size_t beforeSize = before.size(), afterSize = after.size();

		while ((x = val.find(before, prevX)) != string::npos)
		{
			pointList.push(x);
			prevX = x + beforeSize;
		}
		if (pointList.empty() == true)
			return val;

		string res;
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
	template<> auto StringUtil::replaceAll(const string &val, const vector<string> &befores, const string &after) -> string
	{
		string res = val;
		//cout << res << endl;

		while (find(res, befores).getValue() != string::npos)
			for (size_t i = 0; i < befores.size(); i++)
				res = replaceAll(res, befores[i], after);

		return res;
	};
	template<> auto StringUtil::removeEmptySpace(const string &val) -> string
	{
		return replaceAll(val, SPACE_ARRAY, "");
	};
	template<> auto StringUtil::removeEmptyHTMLSpace(const string &val) -> string
	{
		return replaceAll(val, HTML_SPACE_ARRAY, " ");
	};

	/* ----------------------------------------------------------------------
		URL ENCODING & DECODING
	---------------------------------------------------------------------- */
	template<> auto StringUtil::encodeURIComponent(const string &val) -> string
	{
		size_t size = val.size();
		char *destination = new char[size * 3 + 1];

		unsigned short asc;
		unsigned char c;
		size_t index = 0;

		for (size_t i = 0; i < size; i++) {
			c = val[i];
			asc = (int)c;

			if (47 < asc && asc < 58 || 64 < asc && asc < 91 || 96 < asc && asc < 123)
				destination[index++] = c;
			else if (asc == 32)
				destination[index++] = '+';
			else {
				char temp[4];
				sprintf_s(temp, "%%%2x", asc);
				if ((unsigned short)temp[1] == 32) temp[1] = '0';
				destination[index++] = temp[0];
				destination[index++] = temp[1];
				destination[index++] = temp[2];
			}
		}
		destination[index] = 0;

		string result = destination;
		delete[] destination;

		return move(result);
	}
	template<> auto StringUtil::decodeURIComponent(const string &val) -> string
	{
		size_t size = val.size();

		const char* original = val.c_str();
		char *destination = new char[size + 1];

		size_t index = 0;
		size_t num = 0;
		size_t retval = 0;

		while (*original)
		{
			if (*original == '%')
			{
				num = 0;
				retval = 0;
				for (int i = 0; i < 2; i++)	{
					*original++;
					if (*(original) < ':')
						num = *(original)-48;
					else if (*(original) > '@' && *(original) < '[')
						num = (*(original)-'A') + 10;
					else
						num = (*(original)-'a') + 10;

					if ((16 * (1 - i)))
						num = (num * 16);
					retval += num;
				}
				//%20 AND +
				if (retval == '+')
					retval = ' ';
				destination[index++] = retval;
			}
			else
				destination[index++] = *original;
			*original++;
		}
		destination[index] = 0;

		string result = destination;
		delete[] destination;

		return move(result);
	}
	template<> auto StringUtil::encodeURI(const string &val) -> string
	{
		size_t size = val.size();

		char *destination = new char[size * 3 + 1];

		unsigned short asc;
		unsigned char c;
		size_t index = 0;

		for (size_t i = 0; i < size; i++) {
			c = val[i];
			asc = (int)c;

			if (c == '&' || c == '=')
				continue;

			if (47 < asc && asc < 58 || 64 < asc && asc < 91 || 96 < asc && asc < 123)
				destination[index++] = c;
			else if (asc == 32)
				destination[index++] = '+';
			else {
				char temp[4];
				sprintf_s(temp, "%%%2x", asc);
				if ((unsigned short)temp[1] == 32) temp[1] = '0';
				destination[index++] = temp[0];
				destination[index++] = temp[1];
				destination[index++] = temp[2];
			}
		}
		destination[index] = 0;

		string result = destination;
		delete[] destination;

		return move(result);
	}
};