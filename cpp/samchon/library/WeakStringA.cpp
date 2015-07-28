#include <samchon/library/WeakString.hpp>
#include <algorithm>
#include <list>
#include <queue>

#include <samchon/String.hpp>
#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

const vector<string> WeakStringA::SPACE_ARRAY = { "\n", "\t", " " };

WeakStringA::BasicWeakString(const string &str)
	: WeakStringA(str.data(), str.size())
{
}
template<> WeakStringA::BasicWeakString(const char* data, size_t size)
{
	this->data_ = data;
	this->size_ = size;
}

/* ------------------------------------------------------------------------
ACCESSOR
------------------------------------------------------------------------ */
template<> auto WeakStringA::size() const -> size_t
{
	return size_;
}

template<> auto WeakStringA::at(size_t x) const -> const char&
{
	return data_[x];
}
template<> auto WeakStringA::operator[](size_t x) const -> const char&
{
	return data_[x];
}

template<> auto WeakStringA::empty() const -> bool
{
	return size_ == 0;
}

/* ------------------------------------------------------------------------
FINDER
------------------------------------------------------------------------ */
template<> auto WeakStringA::find(char ch, size_t beginX) const -> size_t
{
	for (size_t i = beginX; i < size_; i++)
		if (data_[i] == ch)
		return i;

	return string::npos;
}
template<> auto WeakStringA::find(const string &str, size_t beginX) const -> size_t
{
	return find(WeakStringA(str), beginX);
}
template<> auto WeakStringA::find(const WeakStringA &str, size_t beginX) const -> size_t
{
	size_t j = 0;

	for (size_t i = beginX; i < size_; i++)
		if (data_[i] != str[j++])
		j = 0;
		else if (j == str.size())
			return i - str.size() + 1;
	return string::npos;
}

template<> auto WeakStringA::rfind(char ch, size_t endX) const -> size_t
{
	if (empty() == true)
		return string::npos;

	for (long long i = std::min(endX - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] == ch)
		return (size_t)i;

	return string::npos;
}
template<> auto WeakStringA::rfind(const string &str, size_t endX) const -> size_t
{
	return rfind(WeakStringA(str), endX);
}
template<> auto WeakStringA::rfind(const WeakStringA &str, size_t endX) const -> size_t
{
	if (empty() == true)
		return string::npos;

	size_t j = str.size() - 1;

	for (long long i = std::min(endX - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] != str[j]) //NOT MATCHED
		j = str.size() - 1;
		else if (j == 0) //FULLY MATCHED
			return (size_t)i;
		else //PARTIALLY MATCHED,
			j--;

		return string::npos;
}



/* ------------------------------------------------------------------------
ABSTRACTOR
------------------------------------------------------------------------ */
template<> auto WeakStringA::substr(size_t beginX, size_t size) const -> WeakStringA
{
	if (size == SIZE_MAX || beginX + size > size_)
		size = size_ - beginX;

	return WeakStringA(data_ + beginX, size);
}
template<> auto WeakStringA::substring(size_t beginX, size_t endX) const -> WeakStringA
{
	if (endX == SIZE_MAX)
		return substr(beginX);
	else
		return substr(beginX, endX - beginX);
}
template<> auto WeakStringA::between(const string &begin, const string &end) const -> WeakStringA
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

template<> auto WeakStringA::split(const string &delim) const -> vector<WeakStringA>
{
	//split("A_B_C", "_" = {"A", "B", "C"}
	size_t beginX = 0;
	size_t x;

	//CONSTRUCT THE LIST OF QUOTES
	queue<pair<size_t, size_t>> quoteList;
	while ((x = find(delim, beginX)) != string::npos)
	{
		quoteList.push({ beginX, x });
		beginX = x + delim.size();
	}
	quoteList.push({ beginX, size() });

	//ASSIGN THE STRING_VECTOR BY SUBSTRING
	vector<WeakStringA> vec;
	vec.reserve(quoteList.size());

	while (quoteList.empty() == false)
	{
		vec.push_back(substring(quoteList.front().first, quoteList.front().second));
		quoteList.pop();
	}
	return move(vec);
}
template<> auto WeakStringA::betweens(const string &begin, const string &end) const -> vector<WeakStringA>
{
	//betweens(-AB--CD--EF-, "-", "-" = {"AB", "CD", "EF"}
	vector<WeakStringA> vec;

	if (begin.empty() && end.empty())
		return move(vec);
	else if (begin == end) //NOT EMPTY, BUT EQUALS
	{
		queue<pair<size_t, size_t>> quoteList;

		size_t x, prevX = -1, n = 0;
		while ((x = find(begin, prevX + 1)) != string::npos)
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
			if (vec.at((size_t)i).find(end) == string::npos)
			vec.erase(vec.begin() + (size_t)i);
			else
				vec[(size_t)i] = vec[(size_t)i].between("", end);
	}
	return move(vec);
}

/* ------------------------------------------------------------------------
TRIM
------------------------------------------------------------------------ */
//TRIM
template<> auto WeakStringA::trim() const -> WeakStringA
{
	return ltrim().rtrim();
}
template<> auto WeakStringA::trim(const string &val) const -> WeakStringA
{
	return ltrim(val).rtrim(val);
}
template<> auto WeakStringA::trim(const std::vector<string> &vec) const -> WeakStringA
{
	return ltrim(vec).rtrim(vec);
}

//VOID & A VALUE
template<> auto WeakStringA::ltrim() const -> WeakStringA
{
	return ltrim(SPACE_ARRAY);
}
template<> auto WeakStringA::ltrim(const string &val) const -> WeakStringA
{
	return ltrim(vector<string>({ val }));
}
template<> auto WeakStringA::rtrim() const -> WeakStringA
{
	return rtrim(SPACE_ARRAY);
}
template<> auto WeakStringA::rtrim(const string &val) const -> WeakStringA
{
	return rtrim(vector<string>({ val }));
}

//MAIN ALGORITHM
template<> auto WeakStringA::ltrim(const vector<string> &delims) const -> WeakStringA
{
	WeakStringA str(data_, size_);
	IndexPair<size_t> indexPair = { 0, 0 };

	while (str.empty() == false)
	{
		vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
			indexVec.push_back(str.find(delims[i]));

		indexPair = Math::calcMin(indexVec);
		if (indexPair.getValue() == 0)
		{
			size_t size = delims[indexPair.getIndex()].size();

			str.data_ += size;
			str.size_ -= size;
		}
		else
			break;
	}

	return str;
}
template<> auto WeakStringA::rtrim(const vector<string> &delims) const -> WeakStringA
{
	WeakStringA str(data_, size_);
	IndexPair<size_t> pairIndex;

	while (str.empty() == false)
	{
		vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
		{
			size_t index = str.rfind(delims[i]);
			if (index != string::npos)
				indexVec.push_back(index);
		}
		if (indexVec.empty() == true)
			break;

		pairIndex = Math::calcMax(indexVec);
		size_t size = delims[pairIndex.getIndex()].size();

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
template<> auto WeakStringA::replace(const string &before, const string &after) const -> string
{
	size_t index = find(before);
	if (index == string::npos)
		return str();

	string str;
	str.reserve(size() - before.size() + after.size());
	str.append(substr(0, index).str());
	str.append(after);
	str.append(substr(index + before.size()).str());

	return str;
}
template<> auto WeakStringA::replaceAll(const string &before, const string &after) const -> string
{
	return replaceAll({ { before, after } });
}
template<> auto WeakStringA::replaceAll(const std::vector<string> &vec, const string &after) const -> string
{
	vector<pair<string, string>> pairArray;
	pairArray.reserve(vec.size());

	for (size_t i = 0; i < vec.size(); i++)
		pairArray.push_back({ vec[i], after });

	return replaceAll(pairArray);
}
template<> auto WeakStringA::replaceAll(const std::vector<std::pair<string, string>> &strPairArray) const -> string
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
			if (index == string::npos)
				break;

			foundPairList.push_back({ index++, i });
		}
	}

	if (foundPairList.empty() == true)
		return str();

	foundPairList.sort();

	//REPLACE
	string str;
	str.reserve(strSize);

	index = 0;

	while (foundPairList.empty() == false)
	{
		auto it = foundPairList.begin();
		const string &before = strPairArray[it->second].first;
		const string &after = strPairArray[it->second].second;

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
template<> auto WeakStringA::operator==(const WeakStringA &str) const -> bool
{
	if (size() != str.size())
		return false;

	for (size_t i = 0; i < size(); i++)
		if (data_[i] != str.data_[i])
		return false;

	return true;
}
template<> auto WeakStringA::operator!=(const WeakStringA &str) const ->  bool
{
	return !operator==(str);
}

template<> auto WeakStringA::operator==(const string &str) const -> bool
{
	return operator==(WeakStringA(str));
}
template<> auto WeakStringA::operator!=(const string &str) const -> bool
{
	return operator!=(WeakStringA(str));
}

template<> auto WeakStringA::str() const -> string
{
	return string(data_, data_ + size_);
}