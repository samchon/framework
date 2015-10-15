#include <samchon/StringUtil.hpp>

#include <queue>

#ifndef WIN32_LEAN_AND_MEAN 
#define WIN32_LEAN_AND_MEAN 
#endif 
#include <Windows.h>

namespace samchon
{
	const vector<wstring> WStringUtil::SPACE_ARRAY = { L"\n", L"\t", L" " };
	const vector<wstring> WStringUtil::HTML_SPACE_ARRAY = { L"\n", L"\t", L"  " };

	template<> auto WStringUtil::FONT_COLOR(long color) -> wstring
	{
		wstring colorStr;

		if (color == RED)			colorStr = L"red";
		else if (color == BLACK)	colorStr = L"black";
		else if (color == BLUE)		colorStr = L"blue";

		return substitute(L"<font color='{1}'>", colorStr);
	}
	wstring WStringUtil::FONT_END = L"</font>";

	/* ----------------------------------------------------------------------
	SUBSTITUTE -> TO_STRING
	---------------------------------------------------------------------- */
	template<> auto WStringUtil::to_string(const long double &val)->wstring
	{
		return move( std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const double &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const float &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const unsigned long long &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const long long &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const unsigned long &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const long &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const unsigned int &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const int &val)->wstring
	{
		return move(std::to_wstring(val) );
	}
	template<> auto WStringUtil::to_string(const bool &val)->wstring
	{
		return move(std::to_wstring(val) );
	}

	template<> auto WStringUtil::to_string(const wchar_t &val)->wstring
	{
		return{ val };
	}
	template<> auto WStringUtil::to_string(const wchar_t *val)->wstring
	{
		return val;
	}
	template<> auto WStringUtil::to_string(const wstring &val)->wstring
	{
		return val;
	}

	template<> auto WStringUtil::to_sql(const long double &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const double &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const float &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const unsigned long long &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const long long &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const unsigned long &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const long &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const unsigned int &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const int &val) -> wstring
	{
		return (val == LONG_MIN) ? L"NULL" : move(to_string(val));
	};
	template<> auto WStringUtil::to_sql(const bool &val) -> wstring
	{
		return move(to_string(val));
	};

	template<> auto WStringUtil::to_sql(const wchar_t &val) -> wstring
	{
		return move(to_sql(wstring({ val })));
	};
	template<> auto WStringUtil::to_sql(const wchar_t *val) -> wstring
	{
		return move(to_sql(wstring(val)));
	};
	template<> auto WStringUtil::to_sql(const wstring &val) -> wstring
	{
		return (val.empty() == true) ? L"NULL" : move(L"N'" + to_string(val) + L'\'');
	};

	//CLIPBOARD
	void WStringUtil::toClipboard(const wstring &val)
	{
		size_t size = 2 * (val.size() + 1);

		HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, size);
		memcpy(GlobalLock(hMem), val.c_str(), size);
		GlobalUnlock(hMem);
		OpenClipboard(0);
		EmptyClipboard();
		SetClipboardData(CF_UNICODETEXT, hMem);
		CloseClipboard();
	}

	/* ----------------------------------------------------------------------
		NUMBER-FORMAT
			IN MONETARY UNIT, ADD DELIMETER ','
		COLOR-FORMAT
			POSITIVE NUMBER IS RED,
			NEGATIVE NUMBER IS BLUE
	---------------------------------------------------------------------- */
	template<> auto WStringUtil::isNumeric(const wstring &str) -> bool
	{
		size_t nCount = 0;

		for (size_t i = 0; i < str.size(); i++)
			if (L'0' <= str[i] && str[i] <= L'9')
				nCount++;
			else if (str[i] != L'.' && str[i] != L'-')
				return false;

		if (nCount == 0)
			return false;
		else
			return true;
	}
	template<> auto WStringUtil::toNumber(const wstring &str) -> double
	{
		wstring &numStr = replaceAll(str, L",", L"");
		return stod(numStr);
	}

	template<> auto WStringUtil::numberFormat(double value, unsigned int precision) -> wstring
	{
		wstring text;

		//IF VALUE IS ZERO
		if (value == 0.0) {
			return L"0";
		}
		else if (value == LONG_MIN)
			return L"";

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
		for (i = 0; i < cipher + groups; i++) {
			j = cipher + groups - i;
			if (j != 0 && j-- % 4 == 0)
				text += ',';
			else {
				val = ((int)value % (int)pow(10.0, k)) / (int)pow(10.0, k - 1);
				text += to_string(val);
				k--;
			}
		}

		//DECIMAL PART
		if (precision > 0)
		{
			double pointValue = (double)value - (long long)value;
			wstring &precisionText = to_string(pointValue).substr(2);
			text += precisionText;
		}
		//ADD POINT FROM HERE
		if (isPositive == false)
			text = L'-' + text;

		return move(text);
	}
	template<> auto WStringUtil::percentFormat(double value, unsigned int precision) -> wstring
	{
		if (value == LONG_MIN)
			return L"";
		return move(numberFormat(value * 100, precision) + L'%');
	};

	template<> auto WStringUtil::colorNumberFormat(double value, unsigned int precision, double delimiter) -> wstring
	{
		long color;

		if (value > delimiter)			color = RED;
		else if (value == delimiter)	color = BLACK;
		else							color = BLUE;

		return move(FONT_COLOR(color) + numberFormat(value, precision) + FONT_END);
	};
	template<> auto WStringUtil::colorPercentFormat(double value, unsigned int precision, double delimiter) -> wstring
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
	template<> auto WStringUtil::trim(const wstring &val) -> wstring
	{
		return move(trim(val, SPACE_ARRAY));
	};
	template<> auto WStringUtil::ltrim(const wstring &val) -> wstring
	{
		return move(ltrim(val, SPACE_ARRAY));
	};
	template<> auto WStringUtil::rtrim(const wstring &val) -> wstring
	{
		return move(rtrim(val, SPACE_ARRAY));
	};

	template<> auto WStringUtil::trim(const wstring &val, const wstring &delim) -> wstring
	{
		return move(rtrim(ltrim(val, delim), delim));
	};
	template<> auto WStringUtil::ltrim(const wstring &val, const wstring &delim) -> wstring
	{
		size_t size = delim.size();

		size_t beginX = 0;
		size_t tempX;
		size_t x = wstring::npos;

		while (true)
		{
			tempX = val.find(delim, beginX);
			if (tempX != beginX)
				break;

			beginX = tempX + size;
			x = tempX;
		}
		if (x == wstring::npos)
			return val;
		else
			return move(val.substr(x + size));
	};
	template<> auto WStringUtil::rtrim(const wstring &val, const wstring &delim) -> wstring
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

	template<> auto WStringUtil::trim(const wstring &val, const vector<wstring> &delims) -> wstring
	{
		return move(rtrim(ltrim(val, delims), delims));
	};
	template<> auto WStringUtil::ltrim(const wstring &val, const vector<wstring> &delims) -> wstring
	{
		size_t beginX = 0;
		IterPair<size_t> *pair;
		size_t x = wstring::npos;

		while (true)
		{
			pair = &find(val, delims, beginX);
			if (pair->getValue() != beginX)
				break;

			beginX = pair->getValue() + delims[pair->getIndex()].size();
			x = pair->getValue();
		}
		if (x == wstring::npos)
			return val;
		else
			return move(val.substr(x + delims[pair->getIndex()].size()));
	};
	template<> auto WStringUtil::rtrim(const wstring &val, const vector<wstring> &delims) -> wstring
	{
		IterPair<size_t> *pair;
		size_t x = val.size() - 1;

		while (true)
		{
			pair = &rfind(val, delims, x);
			if (pair->getValue() == wstring::npos || pair->getValue() != x - delims[pair->getIndex()].size() + 1)
				break;

			x = pair->getValue() - 1;
		}
		return move(val.substr(0, x + 1));
	};

	/* ----------------------------------------------------------------------
	STRING UTILITY
	---------------------------------------------------------------------- */
	//FIND -> PAIR<INDEX, SIZE_OF_STRING>: FIND THE LAST INDEX OF CONTAINERS
	template<> auto WStringUtil::find(const wstring &val, const vector<wstring> &delims, const size_t x) -> IterPair<size_t>
	{
		vector<size_t> positionVector;
		positionVector.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
			positionVector.push_back(val.find(delims[i], x));

		return Math::calcMin(positionVector);
	};
	template<> auto WStringUtil::rfind(const wstring &val, const vector<wstring> &delims, const size_t x) -> IterPair<size_t>
	{
		vector<size_t> positionVector;
		positionVector.reserve(delims.size());

		size_t position;

		for (size_t i = 0; i < delims.size(); i++)
		{
			position = val.rfind(delims[i], x);

			if (position != wstring::npos)
				positionVector.push_back(position);
		}
		if (positionVector.empty() == true)
			return{ wstring::npos, wstring::npos };
		else
			return Math::calcMax(positionVector);
	};

	//SINGLE STRING
	template<> auto WStringUtil::substring(const wstring &val, size_t begin, size_t end) -> wstring
	{
		if (end == SIZE_MAX)
			return val.substr(begin);
		else
			return val.substr(begin, end - begin);
	};
	template<> auto WStringUtil::between(const wstring &val, const wstring &begin, const wstring &end) -> wstring
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
	template<> auto WStringUtil::addTab(const wstring &str, size_t n) -> wstring
	{
		vector<wstring> &lines = split(str, L"\n");

		wstring val;
		wstring tab;
		size_t i;

		val.reserve(val.size() + lines.size());
		tab.reserve(n);

		for (i = 0; i < n; i++)
			tab += '\t';

		for (i = 0; i < lines.size(); i++)
			val.append(tab + lines[i] + ((i == lines.size() - 1) ? L"" : L"\n"));

		return move(val);
	};

	//MULTIPLE STRINGS
	template<> auto WStringUtil::split(const wstring &val, const wstring &delim) -> vector<wstring>
	{
		//split("A_B_C", "_") = {"A", "B", "C"}
		size_t beginX = 0;

		size_t size = delim.size();
		size_t x;

		//CONSTRUCT THE LIST OF QUOTES
		queue<pair<size_t, size_t>> quoteList;
		while ((x = val.find(delim, beginX)) != wstring::npos)
		{
			quoteList.push({ beginX, x + size - 1 });
			beginX = x + size;
		}
		quoteList.push({ beginX, val.size() });

		//ASSIGN THE STRING_VECTOR BY SUBSTRING
		vector<wstring> vec;
		vec.reserve(quoteList.size());

		while (quoteList.empty() == false)
		{
			vec.push_back(substring(val, quoteList.front().first, quoteList.front().second));
			quoteList.pop();
		}
		return move(vec);
	};
	template<> auto WStringUtil::betweens(const wstring &val, const wstring &begin, const wstring &end) -> vector<wstring>
	{
		//betweens(-AB--CD--EF-, "-", "-") = {"AB", "CD", "EF"}
		vector<wstring> vec;

		if (begin.empty() && end.empty())
			return move(vec);
		else if (begin == end) //공백은 아니나 begin과 end가 같다면
		{
			queue<pair<size_t, size_t>> quoteList;

			size_t x, prevX = -1, n = 0;
			while ((x = val.find(begin, prevX + 1)) != wstring::npos)
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
					if (vec.at(i).find(end) == wstring::npos)
						vec.erase(vec.begin() + i);
					else
						vec.at(i) = move(between(vec.at(i), wstring(), end));
		}
		return move(vec);
	};

	//FILTER
	//ALPHABET-CONVERSION
	template<> auto WStringUtil::toLowerCase(const wstring &str) -> wstring
	{
		wstring dest(str.size(), NULL);

		for (size_t i = 0; i < str.size(); i++)
			if (L'A' <= str[i] && str[i] <= L'Z')
				dest[i] = towlower(str[i]);
			else
				dest[i] = str[i];

		return move(dest);
	}
	template<> auto WStringUtil::toUpperCase(const wstring &str) -> wstring
	{
		wstring dest(str.size(), NULL);

		for (size_t i = 0; i < str.size(); i++)
			if (L'a' <= str[i] && str[i] <= L'z')
				dest[i] = towupper(str[i]);
			else
				dest[i] = str[i];

		return move(dest);
	}
	template<> auto WStringUtil::replaceAll(const wstring &val, const wstring &before, const wstring &after) -> wstring
	{
		queue<size_t> pointList;
		size_t x = 0;
		size_t prevX = 0;
		size_t beforeSize = before.size(), afterSize = after.size();

		while ((x = val.find(before, prevX)) != wstring::npos)
		{
			pointList.push(x);
			prevX = x + beforeSize;
		}
		if (pointList.empty() == true)
			return val;

		wstring res;
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
	template<> auto WStringUtil::replaceAll(const wstring &val, const vector<wstring> &befores, const wstring &after) -> wstring
	{
		wstring res = val;
		//cout << res << endl;

		while (find(res, befores).getValue() != wstring::npos)
			for (size_t i = 0; i < befores.size(); i++)
				res = replaceAll(res, befores[i], after);

		return res;
	};
	template<> auto WStringUtil::removeEmptySpace(const wstring &val) -> wstring
	{
		return replaceAll(val, SPACE_ARRAY, L"");
	};
	template<> auto WStringUtil::removeEmptyHTMLSpace(const wstring &val) -> wstring
	{
		return replaceAll(val, HTML_SPACE_ARRAY, L" ");
	};

	/* ----------------------------------------------------------------------
	URL ENCODING & DECODING
	---------------------------------------------------------------------- */
	template<> auto WStringUtil::encodeURIComponent(const wstring &val) -> wstring
	{
		string &str = StringUtil::encodeURIComponent(WCharset::toUTF8(val));
		wstring &wstr = Charset::toUnicode(str, UTF8);

		return move(wstr);
	}
	template<> auto WStringUtil::decodeURIComponent(const wstring &val) -> wstring
	{
		string &str = StringUtil::decodeURIComponent(WCharset::toUTF8(val));
		wstring &wstr = Charset::toUnicode(str, UTF8);

		return move(wstr);
	}
	template<> auto WStringUtil::encodeURI(const wstring &val) -> wstring
	{
		string &str = StringUtil::encodeURI(WCharset::toUTF8(val));
		wstring &wstr = Charset::toUnicode(str, UTF8);

		return move(wstr);
	}
};