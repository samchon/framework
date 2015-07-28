#include <samchon/library/WeakString.hpp>
#include <algorithm>
#include <list>
#include <queue>

#include <samchon/String.hpp>
#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

const vector<wstring> WeakStringW::SPACE_ARRAY = { L"\n", L"\t", L" " };

WeakStringW::BasicWeakString(const wstring &str)
	: WeakStringW(str.data(), str.size())
{
}
template<> WeakStringW::BasicWeakString(const wchar_t* data, size_t size)
{
	this->data_ = data;
	this->size_ = size;
}

/* ------------------------------------------------------------------------
	ACCESSOR
------------------------------------------------------------------------ */
template<> auto WeakStringW::size() const -> size_t 
{ 
	return size_; 
}

template<> auto WeakStringW::at(size_t x) const -> const wchar_t& 
{ 
	return data_[x]; 
}
template<> auto WeakStringW::operator[](size_t x) const -> const wchar_t& 
{ 
	return data_[x]; 
}

template<> auto WeakStringW::empty() const -> bool
{
	return size_ == 0;
}

/* ------------------------------------------------------------------------
	FINDER
------------------------------------------------------------------------ */
template<> auto WeakStringW::find(wchar_t ch, size_t beginX) const -> size_t
{
	for (size_t i = beginX; i < size_; i++)
		if (data_[i] == ch)
			return i;

	return wstring::npos;
}
template<> auto WeakStringW::find(const wstring &str, size_t beginX) const -> size_t
{
	return find(WeakStringW(str), beginX);
}
template<> auto WeakStringW::find(const WeakStringW &str, size_t beginX) const -> size_t
{
	size_t j = 0;
	
	for (size_t i = beginX; i < size_; i++)
		if (data_[i] != str[j++])
			j = 0;
		else if (j == str.size())
			return i - str.size() + 1;
	return wstring::npos;
}

template<> auto WeakStringW::rfind(wchar_t ch, size_t endX) const -> size_t
{
	if (empty() == true)
		return wstring::npos;

	for (long long i = std::min(endX - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] == ch)
			return (size_t)i;

	return wstring::npos;
}
template<> auto WeakStringW::rfind(const wstring &str, size_t endX) const -> size_t
{
	return rfind(WeakStringW(str), endX);
}
template<> auto WeakStringW::rfind(const WeakStringW &str, size_t endX) const -> size_t
{
	if (empty() == true)
		return wstring::npos;

	size_t j = str.size() - 1;

	for (long long i = std::min(endX - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] != str[j]) //NOT MATCHED
			j = str.size() - 1;
		else if (j == 0) //FULLY MATCHED
			return (size_t)i;
		else //PARTIALLY MATCHED,
			j--;

	return wstring::npos;
}



/* ------------------------------------------------------------------------
	ABSTRACTOR
------------------------------------------------------------------------ */
template<> auto WeakStringW::substr(size_t beginX, size_t size) const -> WeakStringW
{
	if (size == SIZE_MAX || beginX + size > size_)
		size = size_ - beginX;
	
	return WeakStringW(data_ + beginX, size);
}
template<> auto WeakStringW::substring(size_t beginX, size_t endX) const -> WeakStringW
{
	if (endX == SIZE_MAX)
		return substr(beginX);
	else
		return substr(beginX, endX - beginX);
}
template<> auto WeakStringW::between(const wstring &begin, const wstring &end) const -> WeakStringW
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

template<> auto WeakStringW::split(const wstring &delim) const -> vector<WeakStringW>
{
	//split("A_B_C", "_" = {"A", "B", "C"}
	size_t beginX = 0;
	size_t x;

	//CONSTRUCT THE LIST OF QUOTES
	queue<pair<size_t, size_t>> quoteList;
	while ((x = find(delim, beginX)) != wstring::npos)
	{
		quoteList.push({ beginX, x });
		beginX = x + delim.size();
	}
	quoteList.push({ beginX, size() });

	//ASSIGN THE STRING_VECTOR BY SUBSTRING
	vector<WeakStringW> vec;
	vec.reserve(quoteList.size());

	while (quoteList.empty() == false)
	{
		vec.push_back(substring(quoteList.front().first, quoteList.front().second));
		quoteList.pop();
	}
	return move(vec);
}
template<> auto WeakStringW::betweens(const wstring &begin, const wstring &end) const -> vector<WeakStringW>
{
	//betweens(-AB--CD--EF-, "-", "-" = {"AB", "CD", "EF"}
	vector<WeakStringW> vec;

	if (begin.empty() && end.empty())
		return move(vec);
	else if (begin == end) //NOT EMPTY, BUT EQUALS
	{
		queue<pair<size_t, size_t>> quoteList;

		size_t x, prevX = -1, n = 0;
		while ((x = find(begin, prevX + 1)) != wstring::npos)
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
				if (vec.at((size_t)i).find(end) == wstring::npos)
					vec.erase(vec.begin() + (size_t)i);
				else
					vec[(size_t)i] = vec[(size_t)i].between(L"", end);
	}
	return move(vec);
}

/* ------------------------------------------------------------------------
	TRIM
------------------------------------------------------------------------ */
//TRIM
template<> auto WeakStringW::trim() const -> WeakStringW
{
	return ltrim().rtrim();
}
template<> auto WeakStringW::trim(const wstring &val) const -> WeakStringW
{
	return ltrim(val).rtrim(val);
}
template<> auto WeakStringW::trim(const std::vector<wstring> &vec) const -> WeakStringW
{
	return ltrim(vec).rtrim(vec);
}

//VOID & A VALUE
template<> auto WeakStringW::ltrim() const -> WeakStringW
{
	return ltrim(SPACE_ARRAY);
}
template<> auto WeakStringW::ltrim(const wstring &val) const -> WeakStringW
{
	return ltrim(vector<wstring>({ val }));
}
template<> auto WeakStringW::rtrim() const -> WeakStringW
{
	return rtrim(SPACE_ARRAY);
}
template<> auto WeakStringW::rtrim(const wstring &val) const -> WeakStringW
{
	return rtrim(vector<wstring>({ val }));
}

//MAIN ALGORITHM
template<> auto WeakStringW::ltrim(const vector<wstring> &delims) const -> WeakStringW
{
	WeakStringW str(data_, size_);
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
template<> auto WeakStringW::rtrim(const vector<wstring> &delims) const -> WeakStringW
{
	WeakStringW str(data_, size_);
	IndexPair<size_t> pairIndex;

	while (str.empty() == false)
	{
		vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
		{
			size_t index = str.rfind(delims[i]);
			if (index != wstring::npos)
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
template<> auto WeakStringW::replace(const wstring &before, const wstring &after) const -> wstring
{
	size_t index = find(before);
	if (index == wstring::npos)
		return str();

	wstring str;
	str.reserve(size() - before.size() + after.size());
	str.append(substr(0, index).str());
	str.append(after);
	str.append(substr(index + before.size()).str());

	return str;
}
template<> auto WeakStringW::replaceAll(const wstring &before, const wstring &after) const -> wstring
{
	return replaceAll({ {before, after} });
}
template<> auto WeakStringW::replaceAll(const std::vector<wstring> &vec, const wstring &after) const -> wstring
{
	vector<pair<wstring, wstring>> pairArray;
	pairArray.reserve(vec.size());

	for (size_t i = 0; i < vec.size(); i++)
		pairArray.push_back({vec[i], after});

	return replaceAll(pairArray);
}
template<> auto WeakStringW::replaceAll(const std::vector<std::pair<wstring, wstring>> &strPairArray) const -> wstring
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
			if (index == wstring::npos)
				break;

			foundPairList.push_back({index++, i});
		}
	}

	if (foundPairList.empty() == true)
		return str();

	foundPairList.sort();

	//REPLACE
	wstring str;
	str.reserve(strSize);

	index = 0;

	while (foundPairList.empty() == false)
	{
		auto it = foundPairList.begin();
		const wstring &before = strPairArray[it->second].first;
		const wstring &after = strPairArray[it->second].second;

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
template<> auto WeakStringW::operator==(const WeakStringW &str) const -> bool
{
	if (size() != str.size())
		return false;

	for (size_t i = 0; i < size(); i++)
		if (data_[i] != str.data_[i])
			return false;

	return true;
}
template<> auto WeakStringW::operator!=(const WeakStringW &str) const ->  bool
{
	return !operator==(str);
}

template<> auto WeakStringW::operator==(const wstring &str) const -> bool
{
	return operator==(WeakStringW(str));
}
template<> auto WeakStringW::operator!=(const wstring &str) const -> bool
{
	return operator!=(WeakStringW(str));
}

template<> auto WeakStringW::str() const -> wstring
{
	return wstring(data_, data_ + size_);
}