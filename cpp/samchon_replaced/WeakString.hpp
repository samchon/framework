#pragma once
#include <samchon/String.hpp>

#include <vector>
#include <list>
#include <queue>

#include <samchon/IndexPair.hpp>

#include <samchon/library/IOperator.hpp>
#include <samchon/library/Math.hpp>

namespace samchon
{
	template <typename _Elem> class BasicWeakString;

	typedef BasicWeakString<char> WeakString;
	typedef BasicWeakString<wchar_t> WWeakString;
	typedef BasicWeakString<char16_t> U16WeakString;
	typedef BasicWeakString<char32_t> U32WeakString;

	typedef BasicWeakString<TCHAR> TWeakString;

	/**
	* @brief WeakString is a string class only references characeters, reference only
	*
	* @details
	* WeakSring does not consider any construction, modification and destruction of characters\n
	* Thus, you can have greater advantages than std::string on the side of performance and memory,
	* but of course, you can't modify the characeters at all.
	*
	* @warning
	* /li WeakString not copy(strcpy) characeters but only references characeters.\n
	*	   Be careful about destruction of the characters being referenced by the WeakString
	* /li WeakString will be used for basic data type in most case.\n
	*	   Avoid to use WeakString by pre-definition in header (*.hpp)
	*
	* @author Jeongho Nam
	* @todo modify doxygen comments on replace, replaceAll
	*/
	template <typename _Elem>
	class BasicWeakString
	{
	private:
		static const std::vector<std::basic_string<_Elem>> SPACE_ARRAY;

	public:
		static const size_t npos = -1;

	private:
		const _Elem *data_;
		size_t size_;

	public:
		/**
		* @brief Default Constructor does not reference any character
		* @details Constructs an empty string, with zero size
		*/
		BasicWeakString()
		{
			this->data_ = nullptr;
			this->size_ = 0;
		};

		/**
		* @brief
		* Constructor by characters with specified size
		*
		* @details
		* Constructs by characters to be referenced with limited size\n
		* Although the original size of data is over the specified size,
		* you can limit referencing size of the characters
		* \li Referencing a part of characters
		*
		* @warning WeakString only references. Be careful about destruction of the characters (data)
		* @param data Target characters to be referenced by string
		* @param size Specified limit-size of characters to be referenced.\n
		*			   But if the specified size is greater than original size, it will be ignored
		*/
		BasicWeakString(const _Elem *data, size_t size)
		{
			this->data_ = data;
			this->size_ = std::min<size_t>(std::char_traits<_Elem>::length(data), size);
		};

		/**
		* @brief
		* Constructor by characters of begin and end
		*
		* @details
		* Constructs by characters to be referenced with its end position\n
		* Although the original end point of data is over the specified end,
		* you can limit end point of the characters
		* \li Referencing a part of characters
		*
		* @warning WeakString only references. Be careful about destruction of the characters (data)
		* @param begin Target characters to be referenced by string
		* @param end Specified end point of characters to be referenced.\n
		*			   But if the specified end point is greater than original end point, it will be ignored
		*/
		BasicWeakString(const _Elem *begin, const _Elem *end)
			: BasicWeakString(begin, end - begin)
		{
		};

		/**
		* @brief Constructor by characters
		* @details References the null-terminated character sequence pointed by ptr
		*
		* @warning WeakString only references. Be careful about destruction of the characeters (data)
		* @param data Target characters to be referenced by string
		*/
		BasicWeakString(const _Elem *data)
		{
			this->data_ = data;

			if (data == nullptr)
				this->size_ = 0;
			else
				this->size_ = std::char_traits<_Elem>::length(data);
		};

		/**
		* @brief Constructor by a single character
		* @details References a single character
		*
		* @warning WeakString only references. Be careful about destruction of the characeter (data)
		* @param ch Target character to be referenced by string
		*/
		BasicWeakString(const _Elem &ch)
		{
			this->data_ = &ch;
			this->size_ = 1;
		};

		/**
		* @brief Constructor by a initializer list
		* @details References initializer list of character
		*
		* @warning WeakString only references. Be careful about destruction of the characeters (data)
		* @param ch Target character to be referenced by string
		*/
		BasicWeakString(std::initializer_list<_Elem> &il)
		{
			if (il.size() == 0)
				this->data_ = nullptr;
			else
				this->data_ = il.begin();

			this->size_ = il.size();
		};

		/**
		* @brief Constructor by string
		* @details References whole chracters of the string
		*
		* @warning WeakString only references. Be careful about destruction of the string
		* @param str Target string to be referenced by string
		*/
		BasicWeakString(const std::basic_string<_Elem> &str)
		{
			this->data_ = str.data();
			this->size_ = str.size();
		};

		/* --------------------------------------------------------------------
		ELEMENT ACCESSORS
		-------------------------------------------------------------------- */
		/**
		* @brief Get string data; referenced characeters
		*
		* @details
		* Returns a pointer to an array that contains a null-terminated sequence of
		* characters representing the current value of the string object
		*
		* @warning Returned pointer's size can be longer than string's specified size
		*			if the string references only a part of the characters
		* @return A pointer of characters being referenced by the string
		*/
		auto data() const -> const _Elem*
		{
			return data_;
		}

			/**
			* @brief Returns size of the characters which are being referenced
			* @details Returns the length of the string, in terms of number of referenced characters
			*
			* @return size of characters being referenced by string
			*/
			auto size() const -> size_t
		{
			return size_;
		};

		/**
		* @brief Tests wheter string is emtpy
		*
		* @detail
		* Returns wheter characters' size is zero or not.\n
		* Of course, string references nothing, then returns false, too
		*
		* @return Wheter size is zero or not
		*/
		auto empty() const -> bool
		{
			return (size_ == 0 || data_ == nullptr);
		};

		/**
		* @brief Get character of string
		* @detail Returns a const reference to the character at the specified position
		*
		* @return const reference of character at the specified index
		*/
		auto at(size_t index) const -> const _Elem&
		{
			return *(data_ + index);
		};

		/**
		* @copy BasicWeakString::at(size_t)
		*/
		auto operator[](size_t index) const -> const _Elem&
		{
			return *(data_ + index);
		};

		/* --------------------------------------------------------------------
		FINDERS
		-------------------------------------------------------------------- */
		/**
		* @brief Finds first occurence in string

		* @details
		* Finds the string after startIndex and returns the position of first occurence of delim\n
		* If delim is not found, returns -1 (npos)
		*
		* @param delim The substring of the string which to find
		* @param startIndex Specified starting index of find. Default is 0
		* @return Index of first occurence of the specified substring or -1
		*/
		auto find(const BasicWeakString &delim, size_t startIndex = NULL) const -> size_t
		{
			size_t j = 0;

			for (size_t i = startIndex; i < size_; i++)
				if (data_[i] != delim[j++])
					j = 0;
				else if (j == delim.size())
					return i - delim.size() + 1;

			return npos;
		};

		/**
		* @brief Finds last occurence in string

		* @details
		* Finds the string before endIndex and returns the position of last occurence of delim\n
		* If delim is not found, returns -1 (npos)
		*
		* @param delim The substring of the string which to find
		* @param endIndex Specified last index of find. Default is size() - 1
		* @return Index of first occurence of the specified substring or -1
		*/
		auto rfind(const BasicWeakString &delim, size_t endIndex = SIZE_MAX) const -> size_t
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
		};

		/**
		* @brief Finds first occurence in string
		*
		* @details
		* Finds first occurence position of each delim in the string after startIndex
		* and returns the minimum position of them\n
		* \n
		* If startIndex is not specified, then starts from 0.\n
		* If failed to find any substring, returns -1 (npos)
		*
		* @param delims The substrings of target(str) which to find
		* @param startIndex Specified starting index of find. Default is 0
		* @return pair\<size_t := position, string := matched substring\>
		*/
		auto finds(const std::vector<std::basic_string<_Elem>> &delims, size_t startIndex = 0) const -> IndexPair<BasicWeakString>
		{
			std::vector<BasicWeakString> wdelims(delims.size());
			for (size_t i = 0; i < delims.size(); i++)
				wdelims[i] = delims[i];

			return finds(wdelims, startIndex);
		};
		auto finds(const std::vector<BasicWeakString> &delims, size_t startIndex = 0) const -> IndexPair<BasicWeakString>
		{
			std::vector<size_t> positionVector;
			positionVector.reserve(delims.size());

			for (size_t i = 0; i < delims.size(); i++)
				positionVector.push_back(val.find(delims[i], x));

			IndexPair<size_t> &iPair = Math::calcMin(positionVector);
			return{ iPair.getIndex(), delims[iPair.getValue()] };
		};

		/**
		* @brief Finds last occurence in string
		*
		* @details
		* Finds last occurence position of each delim in the string before endIndex
		* and returns the maximum position of them\n
		* \n
		* If index is not specified, then starts str.size() - 1\n
		* If failed to find any substring, returns -1 (npos)
		*
		* @param delims The substrings of target(str) which to find
		* @param endIndex Specified starting index of find. Default is size() - 1
		* @return pair\<size_t := position, string := matched substring\>
		*/
		auto rfinds(const std::vector<std::basic_string<_Elem>> &delims, size_t endIndex = SIZE_MAX) const -> IndexPair<BasicWeakString>
		{
			std::vector<BasicWeakString> wdelims(delims.size());
			for (size_t i = 0; i < delims.size(); i++)
				wdelims[i] = delims[i];

			return rfinds(wdelims, startIndex);
		};
		auto rfinds(const std::vector<BasicWeakString> &delims, size_t endIndex = SIZE_MAX) const -> IndexPair<BasicWeakString>
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
				return{ wstring::npos,{} };

			IndexPair<size_t> &iPair = Math::calcMax(positionVector);
			return{ iPair.getIndex(), delims[iPair.getValue()] };
		};

		/* --------------------------------------------------------------------
		EXTRACTORS
		-------------------------------------------------------------------- */
		/**
		* @brief Generates a substring
		*
		* @details
		* Extracts a substring consisting of the characters starts from
		* startIndex and with a size specified size
		*
		* @param startIndex Index of the first character.\n
		*					 If startIndex is greater than endIndex, those will be swapped
		* @param endIndex Number of characters to include in substring\n
		*				   If the specified size is greater than last index of characeters, it will be shrinked
		* @return Sub string by specified index and size
		*/
		auto substr(size_t startIndex, size_t endIndex = SIZE_MAX) const -> BasicWeakString
		{
			if (startIndex > endIndex)
				swap(startIndex, endIndex);

			if (startIndex == endIndex || startIndex > size_ - 1)
				return BasicWeakString();

			if (endIndex > size_)
				endIndex = size_;

			return BasicWeakString(data_ + startIndex, data_ + endIndex);
		};

		/**
		* @brief Generates a substring
		*
		* @details
		* Extracts a substring consisting of the character specified by
		* startIndex and all characters up to endIndex - 1\n
		* If endIndex is not specified, string::size() will be used instead.\n
		* If endIndex is greater than startIndex, then those will be swapped
		*
		* @param startIndex Index of the first character.\n
		*					 If startIndex is greater than endIndex, those will be swapped
		* @param size Index of the last character - 1.\n
		*				   If not specified, then string::size() will be used instead
		* @return Sub string by specified index(es)
		*/
		auto substring(size_t startIndex, size_t size = SIZE_MAX) const -> BasicWeakString
		{
			if (startIndex > size - 1)
				return BasicWeakString();

			if (startIndex + size > size_)
				size = size_ - startIndex;

			return BasicWeakString(data_, size);
		};

		/**
		* @brief Generates a substring
		*
		* @details
		* Extracts a substring consisting of the characters from specified start to end
		* It's same with substring( ? = (str.find(start) + start.size()), find(end, ?) )\n
		* &nbsp;&nbsp;&nbsp;&nbsp; ex) between("ABCD[EFGH]IJK", "[", "]") => "EFGH"\n
		* \n
		* If start is not specified, extracts from begin of the string to end\n
		* If end is not specified, extracts from start to end of the string\n
		* If start and end are all omitted, returns str, itself.
		*
		* @param start A string for separating substring at the front
		* @param end A string for separating substring at the end
		* @return substring by specified terms
		*/
		auto between(const BasicWeakString &start = {}, const BasicWeakString &end = {}) const -> BasicWeakString
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
		};

		/**
		* @brief Generates substrings
		* @details Splits a string in to an array of substrings dividing by the specified delimiter
		*
		* @param delim The pattern which specifies where to split the string
		* @return An array of substrings
		*/
		auto split(const BasicWeakString &delim) const -> std::vector<BasicWeakString>
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
			std::vector<BasicWeakString> vec;
			vec.reserve(quoteList.size());

			while (quoteList.empty() == false)
			{
				vec.push_back(substring(quoteList.front().first, quoteList.front().second));
				quoteList.pop();
			}
			return move(vec);
		};

		/**
		* @brief Generates substrings
		*
		* @details
		* Splits a string into an array of substrings dividing by delimeters of start and end\n
		* It's the array of substrings adjusted the between\n
		* \n
		* If start is omitted, it's same with the split by endStr not having last item\n
		* If end is omitted, it's same with the split by startStr not having first item\n
		* If start and end are all omitted, returns string, itself
		*
		* @param start A string for separating substring at the front\n
		*				If omitted, it's same with split(end) not having last item
		* @param end A string for separating substring at the end\n
		*			  If omitted, it's same with split(start) not having first item
		* @return An array of substrings
		*/
		auto betweens(const BasicWeakString &start = {}, const BasicWeakString &end = {}) const -> std::vector<BasicWeakString>
		{
			std::vector<BasicWeakString> vec;

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
							vec[(size_t)i] = vec[(size_t)i].between({}, end);
			}
			return move(vec);
		};

		/* --------------------------------------------------------------------
		TRIMS
		-------------------------------------------------------------------- */
		/**
		* @brief Removes all designated characters from the beginning and end of the specified string
		*
		* @param delims Designated character(s)
		* @return Updated string where designated characters was removed from the beginning and end
		*/
		auto trim(const std::vector<std::basic_string<_Elem>> &delims) const -> BasicWeakString
		{
			std::vector<BasicWeakString> wdelims(delims.size());
			for (size_t i = 0; i < delims.size(); i++)
				wdelims[i] = delims[i];

			return trim(wdelims);
		};
		auto trim(const std::vector<BasicWeakString> &delims) const -> BasicWeakString
		{
			return ltrim(delims).rtrim(delims);
		};

		/**
		* @brief Removes all designated characters from the beginning of the specified string
		*
		* @param delims Designated character(s)
		* @return Updated string where designated characters was removed from the beginning
		*/
		auto ltrim(const std::vector<std::basic_string<_Elem>> &delims) const -> BasicWeakString
		{
			std::vector<BasicWeakString> wdelims(delims.size());
			for (size_t i = 0; i < delims.size(); i++)
				wdelims[i] = delims[i];

			return ltrim(wdelims);
		};
		auto ltrim(const std::vector<BasicWeakString> &delims) const-> BasicWeakString
		{
			BasicWeakString str(data_, size_);
			IndexPair<size_t> indexPair = { 0, 0 };

			while (str.empty() == false)
			{
				std::vector<size_t> indexVec;
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
		};

		/**
		* @brief Removes all designated characters from the end of the specified string
		*
		* @param delims Designated character(s)
		* @return Updated string where designated characters was removed from the end
		*/
		auto rtrim(const std::vector<std::basic_string<_Elem>> &delims) const -> BasicWeakString
		{
			std::vector<BasicWeakString> wdelims(delims.size());
			for (size_t i = 0; i < delims.size(); i++)
				wdelims[i] = delims[i];

			return rtrim(wdelims);
		};
		auto rtrim(const std::vector<BasicWeakString> &delims) const-> BasicWeakString
		{
			BasicWeakString str(data_, size_);
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

				pairIndex = Math::calcMax(indexVec);
				size_t size = delims[pairIndex.getIndex()].size();

				if (pairIndex.getValue() == str.size() - size)
					str.size_ -= size;
				else
					break;
			}
			return str;
		};

		auto trim() const -> BasicWeakString
		{
			return trim(SPACE_ARRAY);
		};
		auto ltrim() const -> BasicWeakString
		{
			return ltrim(SPACE_ARRAY);
		};
		auto rtrim() const -> BasicWeakString
		{
			return rtrim(SPACE_ARRAY);
		};

		auto trim(const BasicWeakString &delim) const -> BasicWeakString
		{
			trim({ delim });
		};
		auto ltrim(const BasicWeakString &delim) const -> BasicWeakString
		{
			ltrim({ delim });
		};
		auto rtrim(const BasicWeakString &delim) const -> BasicWeakString
		{
			rtrim({ delim });
		};

		/* --------------------------------------------------------------------
		REPLACERS
		-------------------------------------------------------------------- */
		/**
		* @brief Replace portion of string once
		*
		* @param before A specific word you want to be replaced
		* @param after A specific word you want to replace
		* @return A string specific word is replaced once
		*/
		auto replace(const BasicWeakString &before, const BasicWeakString &after) const -> std::basic_string<_Elem>
		{
			size_t index = find(before);
			if (index == npos)
				return move(str());

			std::basic_string<_Elem> str;
			str.reserve(size() - before.size() + after.size());

			str.append(substr(0, index).str());
			str.append(after);
			str.append(substr(index + before.size()).str());

			return move(str);
		};

		/**
		* @brief Returns a string specified word is replaced
		*
		* @param before A specific word you want to be replaced
		* @param after A specific word you want to replace
		* @return A string specified word is replaced
		*/
		auto replaceAll(const BasicWeakString &before, const BasicWeakString &after) const -> std::basic_string<_Elem>
		{
			//to replaceAll(vector<pair<string, string>>)
			return move(replaceAll({ { before, after } }));
		};

		/**
		* @brief Returns a string specified words are replaced
		*
		* @param str Target string to replace
		* @param pairs A specific word's pairs you want to replace and to be replaced
		* @return A string specified words are replaced
		*/
		auto replaceAll(const std::vector<std::pair<std::basic_string<_Elem>, std::basic_string<_Elem>>> &pairs) const -> std::basic_string<_Elem>
		{
			std::vector<std::pair<BasicWeakString, BasicWeakString>> wPairs(pairs.size());
			for (size_t i = 0; i < pairs.size(); i++)
				wPairs[i] = { pairs[i].first, pairs[i].second };

			return move(replaceAll(wPairs));
		};
		auto replaceAll(const std::vector<std::pair<BasicWeakString, BasicWeakString>> &pairs) const -> std::basic_string<_Elem>
		{
			if (pairs.empty() == true)
				return str();

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
			std::basic_string<_Elem> str;
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
		};

		/**
		* @brief Returns a string that all uppercase characters are converted to lowercase\n
		*
		* @param wstr Target string to convert uppercase to lowercase
		* @return A string converted to lowercase
		*/
		auto toLowerCase() const -> std::basic_string<_Elem>
		{
			std::basic_string<_Elem> &str = str();
			for (size_t i = 0; i < str.size(); i++)
				if ('A' <= str[i] && str[i] <= 'Z')
					str[i] = tolower(str[i]);

			return move(str);
		};

		/**
		* @brief Returns a string all lowercase characters are converted to uppercase\n
		*
		* @param str Target string to convert lowercase to uppercase
		* @return A string converted to uppercase
		*/
		auto toUpperCase() const -> std::basic_string<_Elem>
		{
			std::basic_string<_Elem> &str = str();
			for (size_t i = 0; i < str.size(); i++)
				if ('a' <= str[i] && str[i] <= 'z')
					str[i] = toupper(str[i]);

			return move(str);
		};

		/* --------------------------------------------------------------------
		COMPARISONS
		-------------------------------------------------------------------- */
		auto operator==(const BasicWeakString &str) const -> bool
		{
			if (this->size() != str.size())
				return false;

			for (size_t i = 0; i < size(); i++)
				if (this->at(i) != str[i])
					return false;

			return true;
		};
		auto operator<(const BasicWeakString &str) const -> bool
		{
			size_t minSize = math::min(size(), str.size());

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
		OPERATOR_METHODS(BasicWeakString)

			/* --------------------------------------------------------------------
			CONVERSIONS
			-------------------------------------------------------------------- */
			/**
			* @brief Get the string content
			* @details Returns a string object with a copy of the current contents in the WeakString.
			*
			* @return A new string copied from the WeakString
			*/
			auto str() const -> std::basic_string<_Elem>
		{
			return move(std::basic_string<_Elem>(data_, data_ + size_));
		};
		operator std::basic_string<_Elem>()
		{
			return move(str());
		};
	};
};
