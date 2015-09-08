#include <samchon/WeakString.hpp>

#include <list>
#include <queue>
#include <utility>

#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

const vector<String> WeakString::SPACE_ARRAY = { _T(" "), _T("\t"), _T("\r"), _T("\n") };

/* --------------------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------------------- */
WeakString::WeakString()
{
	this->data_ = nullptr;
	this->size_ = 0;
}
WeakString::WeakString(const TCHAR *data, size_t size)
{
	this->data_ = data;
	this->size_ = std::min<size_t>(std::char_traits<TCHAR>::length(data), size);
}
WeakString::WeakString(const TCHAR *begin, const TCHAR *end)
	: WeakString(begin, end - begin)
{
}
WeakString::WeakString(const TCHAR *data)
{
	this->data_ = data;

	if (data == nullptr)
		this->size_ = 0;
	else
		this->size_ = std::char_traits<TCHAR>::length(data);
}
WeakString::WeakString(const TCHAR &ch)
{
	this->data_ = &ch;
	this->size_ = 1;
}
WeakString::WeakString(std::initializer_list<TCHAR> &il)
{
	if (il.size() == 0)
		this->data_ = nullptr;
	else
		this->data_ = il.begin();

	this->size_ = il.size();
}
WeakString::WeakString(const String &str)
{
	this->data_ = str.data();
	this->size_ = str.size();
}

/* --------------------------------------------------------------------
	ELEMENT ACCESSORS
-------------------------------------------------------------------- */
auto WeakString::data() const -> const TCHAR*
{
	return data_;
}
auto WeakString::size() const -> size_t
{
	return size_;
}

auto WeakString::empty() const -> bool
{
	return (size_ == 0 || data_ == nullptr);
}

auto WeakString::at(size_t index) const -> const TCHAR&
{
	return *(data_ + index);
}
auto WeakString::operator[](size_t index) const -> const TCHAR&
{
	return *(data_ + index);
}

/* --------------------------------------------------------------------
	FINDERS
-------------------------------------------------------------------- */
auto WeakString::find(const WeakString &delim, size_t startIndex) const -> size_t
{
	size_t j = 0;

	for (size_t i = startIndex; i < size_; i++)
		if (data_[i] != delim[j++])
			j = 0;
		else if (j == delim.size())
			return i - delim.size() + 1;

	return npos;
}
auto WeakString::rfind(const WeakString &delim, size_t endIndex) const -> size_t
{
	if (empty() == true)
		return npos;

	size_t j = delim.size() - 1;

	for (long long i = std::min(endIndex - 1, size_ - 1); i >= 0; i--)
		if (data_[(size_t)i] != delim[j]) //NOT MATCHED
			j = delim.size() - 1;
		else if (j == 0) //FULLY MATCHED
			return (size_t)i;
		else //PARTIALLY MATCHED,
			j--;

		return npos;
}

auto WeakString::finds(const std::vector<String> &delims, size_t startIndex) const -> IndexPair<WeakString>
{
	std::vector<WeakString> wdelims(delims.size());
	for (size_t i = 0; i < delims.size(); i++)
		wdelims[i] = delims[i];

	return finds(wdelims, startIndex);
}
auto WeakString::finds(const std::vector<WeakString> &delims, size_t startIndex) const -> IndexPair<WeakString>
{
	std::vector<size_t> positionVector;
	positionVector.reserve(delims.size());

	for (size_t i = 0; i < delims.size(); i++)
		positionVector.push_back(find(delims[i], startIndex));

	IndexPair<size_t> &iPair = Math::min(positionVector);
	return{ iPair.getIndex(), delims[iPair.getValue()] };
}

auto WeakString::rfinds(const std::vector<String> &delims, size_t endIndex) const -> IndexPair<WeakString>
{
	std::vector<WeakString> wdelims(delims.size());
	for (size_t i = 0; i < delims.size(); i++)
		wdelims[i] = delims[i];

	return rfinds(wdelims, endIndex);
}
auto WeakString::rfinds(const std::vector<WeakString> &delims, size_t endIndex) const -> IndexPair<WeakString>
{
	vector<size_t> positionVector;
	positionVector.reserve(delims.size());

	size_t position;

	for (size_t i = 0; i < delims.size(); i++)
	{
		position = rfind(delims[i], endIndex);

		if (position != wstring::npos)
			positionVector.push_back(position);
	}

	if (positionVector.empty() == true)
		return{ wstring::npos, WeakString() };

	IndexPair<size_t> &iPair = Math::max(positionVector);
	return{ iPair.getIndex(), delims[iPair.getValue()] };
}

/* --------------------------------------------------------------------
	FINDERS
-------------------------------------------------------------------- */
auto WeakString::substr(size_t startIndex, size_t size) const -> WeakString
{
	if (startIndex > size - 1)
		return WeakString();

	if (startIndex + size > size_)
		size = size_ - startIndex;

	return WeakString(data_, size);
}
auto WeakString::substring(size_t startIndex, size_t endIndex) const -> WeakString
{
	if (startIndex > endIndex)
		swap(startIndex, endIndex);

	if (startIndex == endIndex || startIndex > size_ - 1)
		return WeakString();

	if (endIndex > size_)
		endIndex = size_;

	return WeakString(data_ + startIndex, data_ + endIndex);
}
auto WeakString::between(const WeakString &start, const WeakString &end) const -> WeakString
{
	if (start.empty() == true && end.empty() == true)
		return *this;
	else if (start.empty() == true)
		return substring(0, find(end));
	else if (end.empty() == true)
		return substr(find(start) + start.size());

	size_t startIndex = find(start);
	return substring
		(
			startIndex + start.size(),
			find(end, startIndex + start.size())
			);
}
auto WeakString::split(const WeakString &delim) const -> std::vector<WeakString>
{
	size_t startIndex = 0;
	size_t x;

	//CONSTRUCT THE LIST OF QUOTES
	std::queue<std::pair<size_t, size_t>> quoteList;
	while ((x = find(delim, startIndex)) != npos)
	{
		quoteList.push({ startIndex, x });
		startIndex = x + delim.size();
	}
	quoteList.push({ startIndex, size() });

	//ASSIGN THE STRING_VECTOR BY SUBSTRING
	std::vector<WeakString> vec;
	vec.reserve(quoteList.size());

	while (quoteList.empty() == false)
	{
		vec.push_back(substring(quoteList.front().first, quoteList.front().second));
		quoteList.pop();
	}
	return move(vec);
}
auto WeakString::betweens(const WeakString &start, const WeakString &end) const -> std::vector<WeakString>
{
	std::vector<WeakString> vec;

	if (start.empty() == true && end.empty() == true)
		return move(vec);
	else if (start == end) //NOT EMPTY, BUT EQUALS
	{
		std::queue<std::pair<size_t, size_t>> quoteList;

		size_t x, prevX = -1, n = 0;
		while ((x = find(start, prevX + 1)) != npos)
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
				std::pair<size_t, size_t> &quote = quoteList.front();
				vec.push_back(substring(quote.first + start.size()));

				quoteList.pop();
			}
		}
	}
	else //BEGIN AND END IS DIFFER
	{
		vec = split(start);
		vec.erase(vec.begin());

		if (end.empty() == false)
			for (long long i = (long long)vec.size() - 1; i >= 0; i--)
				if (vec.at((size_t)i).find(end) == npos)
					vec.erase(vec.begin() + (size_t)i);
				else
					vec[(size_t)i] = vec[(size_t)i].between(_T(""), end);
	}
	return move(vec);
}

/* --------------------------------------------------------------------
	TRIMS
-------------------------------------------------------------------- */
auto WeakString::trim(const std::vector<WeakString> &delims) const -> WeakString
{
	return ltrim(delims).rtrim(delims);
}
auto WeakString::ltrim(const std::vector<WeakString> &delims) const-> WeakString
{
	WeakString str(data_, size_);
	IndexPair<size_t> indexPair = { 0, 0 };

	while (str.empty() == false)
	{
		std::vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
			indexVec.push_back(str.find(delims[i]));

		indexPair = Math::min(indexVec);
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
auto WeakString::rtrim(const std::vector<WeakString> &delims) const-> WeakString
{
	WeakString str(data_, size_);
	IndexPair<size_t> pairIndex;

	while (str.empty() == false)
	{
		std::vector<size_t> indexVec;
		indexVec.reserve(delims.size());

		for (size_t i = 0; i < delims.size(); i++)
		{
			size_t index = str.rfind(delims[i]);
			if (index != npos)
				indexVec.push_back(index);
		}
		if (indexVec.empty() == true)
			break;

		pairIndex = Math::max(indexVec);
		size_t size = delims[pairIndex.getIndex()].size();

		if (pairIndex.getValue() == str.size() - size)
			str.size_ -= size;
		else
			break;
	}
	return str;
}

auto WeakString::trim() const -> WeakString
{
	return trim(SPACE_ARRAY);
}
auto WeakString::ltrim() const -> WeakString
{
	return ltrim(SPACE_ARRAY);
}
auto WeakString::rtrim() const -> WeakString
{
	return rtrim(SPACE_ARRAY);
}

auto WeakString::trim(const WeakString &delim) const -> WeakString
{
	return trim(vector<WeakString>({ delim }));
}
auto WeakString::ltrim(const WeakString &delim) const -> WeakString
{
	return ltrim(vector<WeakString>({ delim }));
}
auto WeakString::rtrim(const WeakString &delim) const -> WeakString
{
	return rtrim(vector<WeakString>({ delim }));
}

auto WeakString::trim(const std::vector<String> &delims) const -> WeakString
{
	std::vector<WeakString> wdelims(delims.size());
	for (size_t i = 0; i < delims.size(); i++)
		wdelims[i] = delims[i];

	return trim(wdelims);
}
auto WeakString::ltrim(const std::vector<String> &delims) const -> WeakString
{
	std::vector<WeakString> wdelims(delims.size());
	for (size_t i = 0; i < delims.size(); i++)
		wdelims[i] = delims[i];

	return ltrim(wdelims);
}
auto WeakString::rtrim(const std::vector<String> &delims) const -> WeakString
{
	std::vector<WeakString> wdelims(delims.size());
	for (size_t i = 0; i < delims.size(); i++)
		wdelims[i] = delims[i];

	return rtrim(wdelims);
}

/* --------------------------------------------------------------------
	REPLACERS
-------------------------------------------------------------------- */
auto WeakString::replace(const WeakString &before, const WeakString &after) const -> String
{
	size_t index = find(before);
	if (index == npos)
		return move(str());

	String str;
	str.reserve(size() - before.size() + after.size());

	str.append(substr(0, index).str());
	str.append(after.str());
	str.append(substr(index + before.size()).str());

	return move(str);
}

auto WeakString::replaceAll(const WeakString &before, const WeakString &after) const -> String
{
	//to replaceAll(vector<pair<string, string>>)
	return move(replaceAll({ { before, after } }));
}
auto WeakString::replaceAll(const std::vector<std::pair<String, String>> &pairs) const -> String
{
	std::vector<std::pair<WeakString, WeakString>> wPairs(pairs.size());
	for (size_t i = 0; i < pairs.size(); i++)
		wPairs[i] = { pairs[i].first, pairs[i].second };

	return move(replaceAll(wPairs));
}
auto WeakString::replaceAll(const std::vector<std::pair<WeakString, WeakString>> &pairs) const -> String
{
	if (pairs.empty() == true)
		return this->str();

	std::list<std::pair<size_t, size_t>> foundPairList;
	//1ST IS STR-INDEX FROM FIND
	//2ND IS PAIR-INDEX

	size_t strSize = size();
	size_t index;
	size_t i;

	//FIND POSITION-INDEX IN ORIGINAL STRING
	for (i = 0; i < pairs.size(); i++)
	{
		strSize -= pairs[i].first.size();
		strSize += pairs[i].second.size();

		index = 0;

		while (true)
		{
			index = find(pairs[i].first, index);
			if (index == npos)
				break;

			foundPairList.push_back({ index++, i });
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
		auto &before = pairs[it->second].first;
		auto &after = pairs[it->second].second;

		str.append(substring(index, it->first).str());
		str.append(after.str());

		index = it->first + before.size();
		foundPairList.pop_front();
	}
	if (index <= size() - 1)
		str.append(substr(index).str());

	return str;
}

auto WeakString::toLowerCase() const -> String
{
	String &str = this->str();
	for (size_t i = 0; i < str.size(); i++)
		if ('A' <= str[i] && str[i] <= 'Z')
			str[i] = tolower(str[i]);

	return move(str);
}
auto WeakString::toUpperCase() const -> String
{
	String &str = this->str();
	for (size_t i = 0; i < str.size(); i++)
		if ('a' <= str[i] && str[i] <= 'z')
			str[i] = toupper(str[i]);

	return move(str);
};

/* --------------------------------------------------------------------
	COMPARISONS
-------------------------------------------------------------------- */
auto WeakString::operator==(const WeakString &str) const -> bool
{
	if (this->size() != str.size())
		return false;

	for (size_t i = 0; i < size(); i++)
		if (this->at(i) != str[i])
			return false;

	return true;
};
auto WeakString::operator<(const WeakString &str) const -> bool
{
	size_t minSize = std::min(size(), str.size());

	for (size_t i = 0; i < minSize; i++)
		if (this->at(i) == str[i])
			continue;
		else if (this->at(i) < str[i])
			return true;
		else
			return false;

		if (this->size() == minSize && this->size() != str.size())
			return true;
		else
			return false;
};
OPERATOR_METHODS_BODY(WeakString, WeakString)

/* --------------------------------------------------------------------
	CONVERSIONS
-------------------------------------------------------------------- */
auto WeakString::str() const -> String
{
	return move(String(data_, data_ + size_));
};
WeakString::operator String()
{
	return move(str());
};
