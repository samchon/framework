#include <samchon/XML.hpp>
#include <samchon/XMLQuote.hpp>

#include <queue>
#include <samchon/StringUtil.hpp>
#include <samchon/Math.hpp>

namespace samchon
{
	/* -------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------- */
	WXML::BasicXML()
		: WXMLListMap()
	{
		parent = nullptr;
		level = 0;
	}
	WXML::BasicXML(const wstring &str)
		: BasicXML()
	{
		if (str.find(L"<") == wstring::npos)
			return;

		wstring replacedStr = str;

		//주석 전부 제거
		long commentBegin;
		while ((commentBegin = replacedStr.find(L"<!--")) != wstring::npos)
			replacedStr.erase(commentBegin, (replacedStr.find(L"-->") + 3) - commentBegin);

		//윈도우 개행문자를 리눅스 식으로 바꿈
		replacedStr =
			move
			(
				WStringUtil::replaceAll
				(
					replacedStr,
					L"\r\n",
					L"\n"
				)
			);

		long i_xmlStart;
		i_xmlStart = replacedStr.find(L"<?xml");

		//BasicXML 헤더도 제거
		if (i_xmlStart != wstring::npos)
			replacedStr = move(WStringUtil::between(replacedStr, L"?>"));

		construct(replacedStr);
	}
	WXML::BasicXML(WXML *parent, wstring &str)
		: BasicXML()
	{
		this->parent = parent;
		this->level = parent->level + 1;

		construct(str);
	}
	template<> WXML::~BasicXML() {}

	template<> void WXML::construct(wstring &str)
	{
		constructKey(str);
		constructProperty(str);
		if (constructValue(str) == true)
			constructChildren(str);
	}
	template<> void WXML::constructKey(wstring &str)
	{
		long startX = str.find('<') + 1;
		long endX =
			Math::calcMin<long>
			(
		{
			indexFilter(str.find(' ', startX)),
			indexFilter(str.find('\n', startX)),
			indexFilter(str.find('\t', startX)),
			indexFilter(str.find('>', startX)),
			indexFilter(str.find('/', startX))
		}
		).getValue();

		//Determinate the KEY
		key = move(WStringUtil::substring(str, startX, endX));
	}
	template<> void WXML::constructProperty(wstring &str)
	{
		long i_begin = str.find(L'<' + key) + key.size() + 1;
		long i_endSlash = indexFilter(str.rfind('/'));
		long i_endBlock = indexFilter(str.find('>'));

		if (i_begin >= Math::calcMin<long>({ i_endSlash, i_endBlock }).getValue()) //WHY UINT ?
			return;

		wstring &line = WStringUtil::substring(str, i_begin, Math::calcMin<long>({ i_endSlash, i_endBlock }).getValue());
		//<comp label='ABCD' /> : " label='ABCD' "

		if (line.find('=') == wstring::npos)
			return;

		wstring label, value;
		vector<XMLQuote*> helpers;
		bool inQuote = false;
		long type;
		long startPoint, equalPoint;
		size_t i;

		for (i = 0; i < line.size(); i++) {
			//Start of quote
			if (inQuote == false && (line[i] == '\'' || line[i] == '"'))
			{
				inQuote = true;
				startPoint = i;

				if (line[i] == '\'')
					type = XMLQuote::QUOTE_SINGLE;
				else if (line[i] == '"')
					type = XMLQuote::QUOTE_DOUBLE;
			}
			else if
				(
				inQuote == true &&
				(
				(type == XMLQuote::QUOTE_SINGLE && line[i] == '\'') ||
				(type == XMLQuote::QUOTE_DOUBLE && line[i] == '"')
				)
				)
			{
				helpers.push_back(new XMLQuote(type, startPoint, i));
				inQuote = false;
			}
		}
		for (i = 0; i < helpers.size(); i++)
		{
			if (i == 0)
			{
				equalPoint = line.find('=');
				label = move(line.substr(0, equalPoint));//line.substring(0, equalPoint);
			}
			else
			{
				equalPoint = line.find('=', helpers[i - 1]->getEndPoint() + 1);
				label = move(WStringUtil::substring(line, helpers[i - 1]->getEndPoint() + 1, equalPoint));
			}
			label = move(WStringUtil::trim(label));//label.emptyRemover();
			value = move(line.substr(helpers[i]->getStartPoint() + 1, helpers[i]->getEndPoint() - (helpers[i]->getStartPoint() + 1)));
			value = move(WStringUtil::removeEmptyHTMLSpace(value));

			//insert into propertyMap
			propertyMap.set(label, value);
		}
		for (i = 0; i < helpers.size(); i++)
			delete helpers[i];
	}
	template<> auto WXML::constructValue(wstring &str) -> bool
	{
		long i_endSlash = indexFilter(str.rfind('/'));
		long i_endBlock = indexFilter(str.find('>'));

		if (i_endSlash < i_endBlock || i_endBlock + 1 == str.rfind('<')) {
			//STATEMENT1: <TAG />
			//STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
			value.clear();
			return false;
		}

		long startX = i_endBlock + 1;
		long endX = str.rfind('<');

		str = move(WStringUtil::trim(str.substr(startX, endX - startX)));
		if (str.find('<') == wstring::npos)
			value = move(str);
		else
			value.clear();

		return true;
	}
	template<> void WXML::constructChildren(wstring &str)
	{
		if (str.find('<') == wstring::npos)
			return;

		long startX = str.find('<'), endX = str.rfind('>') + 1;
		str = move(str.substr(startX, endX - startX));

		map<wstring, queue<WXML *>> xmlQueueMap;
		queue<WXML*> *xmlQueue;
		WXML *xml;

		long blockStartCount = 0;
		long blockEndCount = 0;
		long start = 0;
		long end;
		size_t i;

		//괄호를 찾아내어 BasicXML 생성 후 임시 컨테이너에 저장
		for (i = 0; i < str.size(); i++) {
			if (str[i] == '<' && str.substr(i, 2) != L"</")
				blockStartCount++;
			else if (str.substr(i, 2) == L"/>" || str.substr(i, 2) == L"</")
				blockEndCount++;

			if (blockStartCount >= 1 && blockStartCount == blockEndCount) {
				end = str.find('>', i);

				xml = new WXML(this, str.substr(start, end + 1 - start));
				xmlQueueMap[xml->getKey()].push(xml);

				i = end; //WHY NOT END+1? 
				start = end + 1;
				blockStartCount = 0;
				blockEndCount = 0;
			}
		}

		//예약 및 설정
		for (auto it = xmlQueueMap.begin(); it != xmlQueueMap.end(); it++)
		{
			wstring key = move(it->first); //키를 받아오고
			shared_ptr<WXMLList> xmlList(new WXMLList()); //BasicXMLList를 만들며

			xmlQueue = &(it->second); //xmlQueue도 불러옴
			xmlList->reserve(xmlQueue->size()); //xmlQueue의 size에 따라 예약을 잡고

			//xmlList에 큐의 내용을 옮긴다
			while (xmlQueue->empty() == false)
			{
				xml = xmlQueue->front();
				xmlList->push_back(shared_ptr<WXML>(xml));

				xmlQueue->pop();
			}
			//Map(BasicXML : map<wstring, BasicXMLList>)에 최종적으로 입력함
			insert({ key, xmlList });
		}

		if (size() > 0)
			value.clear();
	}

	/* -------------------------------------------------------------------
		GETTERS & SETTERS
	------------------------------------------------------------------- */
	template<> auto WXML::getParent() const -> WXML*
	{
		return this->parent;
	}
	template<> auto WXML::getKey() const -> wstring
	{
		return this->key;
	}
	template<> auto WXML::getLevel() const -> long
	{
		return level;
	}
	template<> auto WXML::getValue() const -> wstring
	{
		return value;
	}

	template<> void WXML::setKey(const wstring &key)
	{
		this->key = key;
	}
	template<> void WXML::setValue(const wstring &value)
	{
		this->value = value;
	}
	template<> auto WXML::setProperty(const wstring &key, const wstring &val) -> bool
	{
		return propertyMap.set(key, val);
	}

	/* -------------------------------------------------------------------
		METHODS OF MAP
	------------------------------------------------------------------- */
	template<> void WXML::set(const wstring &key, const shared_ptr<WXMLList> &xmlList)
	{
		WXMLListMap::set(key, xmlList);

		for (size_t i = 0; i < xmlList->size(); i++)
		{
			xmlList->at(i)->parent = this;
			xmlList->at(i)->level = level + 1;
		}
	}
	template<> void WXML::push_back(wstring& str)
	{
		if (str.empty() == true)
			return;

		shared_ptr<WXML> xml(new WXML(this, str));
		auto it = find(xml->getKey());

		//if not exists
		if (it == end()) {
			set(xml->getKey(), make_shared<WXMLList>());
			it = find(xml->getKey());
		}

		//insert
		it->second->push_back(xml);
	}
	template<> void WXML::push_back(const shared_ptr<WXML> &xml)
	{
		wstring &key = xml->getKey();
		if (this->has(key) == false)
			set(key, make_shared<WXMLList>());

		this->get(key)->push_back(xml);
	}

	
	template<> auto WXML::hasProperty(const wstring &key) const -> bool
	{
		return propertyMap.has(key);
	}
	template<> auto WXML::getProperty(const wstring &key) const -> wstring
	{
		return propertyMap.get(key);
	}
	template<> void WXML::eraseProperty(const wstring &key)
	{
		propertyMap.erase(key);
	}
	template<> void WXML::clearProperty()
	{
		propertyMap.clear();
	}

	template<> auto WXML::getPropertyMap() const -> const Map<wstring, wstring>&
	{
		return propertyMap;
	}
	template<> auto WXML::propertySize() const -> size_t
	{
		return propertyMap.size();
	}
	
	/* -------------------------------------------------------------------
		UTILITY
	------------------------------------------------------------------- */
	template<> auto WXML::indexFilter(long value) -> long
	{
		if (value == -1 || value == wstring::npos)
			return LONG_MAX;
		else
			return value;
	}
	template<> auto WXML::to_string(long level) const -> wstring
	{
		wstring tab(level, '\t');
		wstring text = tab + L'<' + key;
		size_t i;

		//WRITE PROPERTIES
		for (auto it = propertyMap.begin(); it != propertyMap.end(); it++)
			text += L' ' + (it->first) + L"=\"" + (it->second) + L'"';

		//Enclose there's not child xmllist
		if (size() == 0)
			if (value.empty() == true)
				text += L" />";
			else
				text += L'>' + value + L"</" + key + L'>';
		else
		{
			text += L">\n";

			//insert value
			if (value.empty() == false)
				text += tab + L'\t' + value + L'\n';

			/*
			-------------------------------------
			INSERT ITEMS
			-------------------------------------
			*/
			//	it->second: pointer of BasicXMLList
			for (auto it = begin(); it != end(); it++)
				for (i = 0; i < it->second->size(); i++)
					text += it->second->at(i)->to_string(level + 1);

			text += tab + L"</" + key + L'>';
		}
		if (level >= 1)
			text += '\n';
		return move(text);
	}
};