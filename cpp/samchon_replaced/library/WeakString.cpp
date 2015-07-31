#include <samchon/library/WeakString.hpp>
#include <algorithm>
#include <list>
#include <queue>

#include <samchon/String.hpp>
#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

const vector<String> WeakString::SPACE_ARRAY = { _T("\n"), _T("\t"), _T(" ") };

WeakString::WeakString(const String &str)
	: WeakString(str.data(), str.size())
{
}
WeakString::WeakString(const TCHAR* data, size_t size)
{
	this->data_ = data;
	this->size_ = size;
}

/* ------------------------------------------------------------------------
	ACCESSOR
------------------------------------------------------------------------ */
auto WeakString::size() const -> size_t 
{ 
	return size_; 
}

auto WeakString::at(size_t x) const -> const TCHAR& 
{ 
	return data_[x]; 
}
auto WeakString::operator[](size_t x) const -> const TCHAR& 
{ 
	return data_[x]; 
}

auto WeakString::empty() const -> bool
{
	return size_ == 0;
}

/* ------------------------------------------------------------------------
	FINDER
------------------------------------------------------------------------ */
auto WeakString::find(TCHAR ch, size_t beginX) const -> size_t
{
	for (size_t i = beginX; i < size_; i++)
		if (data_[i] == ch)
			return i;

	return String::npos;
}
auto WeakString::find(const String &str, size_t beginX) const -> size_t
{
	return find(WeakString(str), beginX);
}
auto WeakString::find(const WeakString &str, size_t beginX) const -> size_t
{
	size_t j = 0;
	
	for (size_t i = beginX; i < size_; i++)
		if (data_[i] != str[j++])
			j = 0;
		else if (j == str.size())
			return i - str.size() + 1;
	return String::npos;
}

auto WeakString::rfind(TCHAR ch, size_t endX) const -> size_t
{
	if (empty() == true)
		return String::npos;

	for (long long i = min(endX - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] == ch)
			return (size_t)i;

	return String::npos;
}
auto WeakString::rfind(const String &str, size_t endX) const -> size_t
{
	return rfind(WeakString(str), endX);
}
auto WeakString::rfind(const WeakString &str, size_t endX) const -> size_t
{
	if (empty() == true)
		return String::npos;

	size_t j = str.size() - 1;

	for (long long i = min(endX - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] != str[j]) //NOT MATCHED
			j = str.size() - 1;
		else if (j == 0) //FULLY MATCHED
			return (size_t)i;
		else //PARTIALLY MATCHED,
			j--;

	return String::npos;
}



/* ------------------------------------------------------------------------
	ABSTRACTOR
------------------------------------------------------------------------ */
auto WeakString::substr(size_t beginX, size_t size) const -> WeakString
{
	if (size == SIZE_MAX || beginX + size > size_)
		size = size_ - beginX;
	
	return WeakString(data_ + beginX, size);
}
auto WeakString::substring(size_t beginX, size_t endX) const -> WeakString
{
	if (endX == SIZE_MAX)
		return substr(beginX);
	else
		return substr(beginX, endX - beginX);
}
auto WeakString::between(const String &begin, const String &end) const -> WeakString
{
	//between("ABCDE", "A", "E" = "BCD"
	if (begin.empty() && end.empty())
		return *this;
	else if (begin.empty())
		return substring(0, find(end));
	else if (end.empty())
		return substr(find(begin) + begin.size());
	else
	{
		size_t startPoint = find(begin);
		return substring
			(
				startPoint + begin.size(),
				find(end, startPoint + begin.size())
			);
	}
}

auto WeakString::split(const String &delim) const -> vector<WeakString>
{
	//split("A_B_C", "_" = {"A", "B", "C"}
	size_t beginX = 0;
	size_t x;

	//CONSTRUCT THE LIST OF QUOTES
	queue<pair<size_t, size_t>> quoteList;
	while ((x = find(delim, beginX)) != String::npos)
	{
		quoteList.push({ beginX, x });
		beginX = x + delim.size();
	}
	quoteList.push({ beginX, size() });

	//ASSIGN THE STRING_VECTOR BY SUBSTRING
	vector<WeakString> vec;
	vec.reserve(quoteList.size());

	while (quoteList.empty() == false)
	{
		vec.push_back(substring(quoteList.front().first, quoteList.front().second));
		quoteList.pop();
	}
	return move(vec);
}
auto WeakString::betweens(const String &begin, const String &end) const -> vector<WeakString>
{
	//betweens(-AB--CD--EF-, "-", "-" = {"AB", "CD", "EF"}
	vector<WeakString> vec;

	if (begin.empty() && end.empty())
		return move(vec);
	else if (begin == end) //NOT EMPTY, BUT EQUALS
	{
		queue<pair<size_t, size_t>> quoteList;

		size_t x, prevX = -1, n = 0;
		while ((x = find(begin, prevX + 1)) != String::npos)
		{
			if (++n % 2 == 0) //WHEN THE MATCHED NUMBER IS EVEN
				quoteList.push({ prevX, x });
			prevX = x;
		}

		if (quoteList.size() == 0)
			vec.push_back(*this);
		else
		{
			vec.reserve(quoteList.size());
			while (quoteList.empty() == false)
			{
				pair<size_t, size_t> &quote = quoteList.front();
				vec.push_back(substring(quote.first + begin.size()));

				quoteList.pop();
			}
		}
	}
	else //BEGIN AND END IS DIFFER
	{
		vec = split(begin);
		vec.erase(vec.begin());

		if (end.empty() == false)
			for (long long i = (long long)vec.size() - 1; i >= 0; i--)
				if (vec.at((size_t)i).find(end) == String::npos)
					vec.erase(vec.begin() + (size_t)i);
				else
					vec[(size_t)i] = vec[(size_t)i].between(_T(""), end);
	}
	return move(vec);
}

/* ------------------------------------------------------------------------
	TRIM
------------------------------------------------------------------------ */
//TRIM
auto WeakString::trim() const -> WeakString
{
	return ltrim().rtrim();
}
auto WeakString::trim(const String &val) const -> WeakString
{
	return ltrim(val).rtrim(val);
}
auto WeakString::trim(const vector<String> &vec) const -> WeakString
{
	return ltrim(vec).rtrim(vec);
}

//VOID & A VALUE
auto WeakString::ltrim() const -> WeakString
{
	return ltrim(SPACE_ARRAY);
}
auto WeakString::ltrim(const String &val) const -> WeakString
{
	return ltrim(vector<String>({ val }));
}
auto WeakString::rtrim() const -> WeakString
{
	return rtrim(SPACE_ARRAY);
}
auto WeakString::rtrim(const String &val) const -> WeakString
{
	return rtrim(vector<String>({ val }));
}

//MAIN ALGORITHM
auto WeakString::ltrim(const vector<String> &delims) const -> WeakString
{
	WeakString str(data_, size_);
	IndexPair<size_t> indexPair = {0, 0};
	
	while (str.empty() == false)
	{
		vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
			indexVec.push_back( str.find(delims[i]) );

		indexPair = Math::calcMin(indexVec);
		if (indexPair.getValue() == 0)
		{
			size_t size = delims[ indexPair.getIndex() ].size();

			str.data_ += size;
			str.size_ -= size;
		}
		else
			break;
	}

	return str;
}
auto WeakString::rtrim(const vector<String> &delims) const -> WeakString
{
	WeakString str(data_, size_);
	IndexPair<size_t> pairIndex;

	while (str.empty() == false)
	{
		vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
		{
			size_t index = str.rfind(delims[i]);
			if (index != String::npos)
				indexVec.push_back(index);
		}
		if (indexVec.empty() == true)
			break;

		pairIndex = Math::calcMax(indexVec);
		size_t size = delims[ pairIndex.getIndex() ].size();

		if (pairIndex.getValue() == str.size() - size)
			str.size_ -= size;
		else
			break;
	}
	return str;
}

/* ------------------------------------------------------------------------
	REPLACER
------------------------------------------------------------------------ */
auto WeakString::replace(const String &before, const String &after) const -> String
{
	size_t index = find(before);
	if (index == String::npos)
		return str();

	String str;
	str.reserve(size() - before.size() + after.size());
	str.append(substr(0, index).str());
	str.append(after);
	str.append(substr(index + before.size()).str());

	return str;
}
auto WeakString::replaceAll(const String &before, const String &after) const -> String
{
	return replaceAll({ {before, after} });
}
auto WeakString::replaceAll(const vector<String> &vec, const String &after) const -> String
{
	vector<pair<String, String>> pairArray;
	pairArray.reserve(vec.size());

	for (size_t i = 0; i < vec.size(); i++)
		pairArray.push_back({vec[i], after});

	return replaceAll(pairArray);
}
auto WeakString::replaceAll(const vector<pair<String, String>> &strPairArray) const -> String
{
	if (strPairArray.empty() == true)
		return str();

	list<pair<size_t, size_t>> foundPairList;
		//1ST IS STR-INDEX FROM FIND
		//2ND IS PAIR-INDEX
	
	size_t strSize = size();
	size_t index;
	size_t i;

	//FIND POSITION-INDEX IN ORIGINAL STRING
	for (i = 0; i < strPairArray.size(); i++)
	{
		strSize -= strPairArray[i].first.size();
		strSize += strPairArray[i].second.size();

		index = 0;

		while (true)
		{
			index = find(strPairArray[i].first, index);
			if (index == String::npos)
				break;

			foundPairList.push_back({index++, i});
		}
	}

	if (foundPairList.empty() == true)
		return str();

	foundPairList.sort();

	//REPLACE
	String str;
	str.reserve(strSize);

	index = 0;

	while (foundPairList.empty() == false)
	{
		auto it = foundPairList.begin();
		const String &before = strPairArray[it->second].first;
		const String &after = strPairArray[it->second].second;

 		str.append(substring(index, it->first).str());
 		str.append(after);

		index = it->first + before.size();
 		foundPairList.pop_front();
	}
	if (index <= size() - 1)
		str.append(substr(index).str());

	return str;
}

/* ------------------------------------------------------------------------
	COMPARISON & CONVERT
------------------------------------------------------------------------ */
auto WeakString::operator==(const WeakString &str) const -> bool
{
	if (size() != str.size())
		return false;

	for (size_t i = 0; i < size(); i++)
		if (data_[i] != str.data_[i])
			return false;

	return true;
}
auto WeakString::operator!=(const WeakString &str) const ->  bool
{
	return !operator==(str);
}

auto WeakString::operator==(const String &str) const -> bool
{
	return operator==(WeakString(str));
}
auto WeakString::operator!=(const String &str) const -> bool
{
	return operator!=(WeakString(str));
}

auto WeakString::str() const -> String
{
	return String(data_, data_ + size_);
}