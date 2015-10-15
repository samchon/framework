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
	XML::BasicXML()
		: XMLListMap()
	{
		parent = nullptr;
		level = 0;
	}
	XML::BasicXML(const string &str)
		: BasicXML()
	{
		if (str.find('<') == string::npos)
			return;

		string replacedStr = str;

		//주석 전부 제거
		long commentBegin;
		while ((commentBegin = replacedStr.find("<!--")) != string::npos)
			replacedStr.erase(commentBegin, (replacedStr.find("-->") + 3) - commentBegin);

		//윈도우 개행문자를 리눅스 식으로 바꿈
		replacedStr =
			move
			(
				StringUtil::replaceAll
				(
					replacedStr,
					"\r\n",
					"\n"
				)
			);

		long i_xmlStart;
		i_xmlStart = replacedStr.find("<?xml");

		//BasicXML 헤더도 제거
		if (i_xmlStart != string::npos)
			replacedStr = move(StringUtil::between(replacedStr, "?>"));

		construct(replacedStr);
	}
	XML::BasicXML(XML *parent, string &str)
		: BasicXML()
	{
		this->parent = parent;
		this->level = parent->level + 1;

		construct(str);
	}
	template<> XML::~BasicXML() {}
	
	template<> void XML::construct(string &str)
	{
		constructKey(str);
		constructProperty(str);
		if (constructValue(str) == true)
			constructChildren(str);
	}
	template<> void XML::constructKey(string &str)
	{
		long startX = str.find("<") + 1;
		long endX =
			Math::calcMin<long>
			(
				{
					indexFilter(str.find(" ", startX)),
					indexFilter(str.find("\n", startX)),
					indexFilter(str.find("\t", startX)),
					indexFilter(str.find(">", startX)),
					indexFilter(str.find("/", startX))
				}
			).getValue();

		//Determinate the KEY
		key = move(StringUtil::substring(str, startX, endX));
	}
	template<> void XML::constructProperty(string &str)
	{
		long i_begin = str.find('<' + key) + key.size() + 1;
		long i_endSlash = indexFilter(str.rfind('/'));
		long i_endBlock = indexFilter(str.find('>'));

		if (i_begin >= Math::calcMin<long>({ i_endSlash, i_endBlock }).getValue()) //WHY UINT ?
			return;

		string &line = StringUtil::substring(str, i_begin, Math::calcMin<long>({ i_endSlash, i_endBlock }).getValue());
		//<comp label='ABCD' /> : " label='ABCD' "

		if (line.find('=') == string::npos)
			return;

		string label, value;
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
				label = move(StringUtil::substring(line, helpers[i - 1]->getEndPoint() + 1, equalPoint));
			}
			label = move(StringUtil::trim(label));//label.emptyRemover(); 
			value = move(line.substr(helpers[i]->getStartPoint() + 1, helpers[i]->getEndPoint() - (helpers[i]->getStartPoint() + 1)));
			value = move(StringUtil::removeEmptyHTMLSpace(value));

			//insert into propertyMap
			propertyMap.set(label, value);
		}
		for (i = 0; i < helpers.size(); i++)
			delete helpers[i];
	}
	template<> auto XML::constructValue(string &str) -> bool
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

		str = move(StringUtil::trim(str.substr(startX, endX - startX)));
		if (str.find('<') == string::npos)
			value = move(str);
		else
			value.clear();

		return true;
	}
	template<> void XML::constructChildren(string &str)
	{
		if (str.find('<') == string::npos)
			return;

		long startX = str.find('<'), endX = str.rfind('>') + 1;
		str = move(str.substr(startX, endX - startX));

		map<string, queue<XML *>> xmlQueueMap;
		queue<XML*> *xmlQueue;
		XML *xml;

		long blockStartCount = 0;
		long blockEndCount = 0;
		long start = 0;
		long end;
		size_t i;

		//괄호를 찾아내어 BasicXML 생성 후 임시 컨테이너에 저장
		for (i = 0; i < str.size(); i++) {
			if (str[i] == '<' && str.substr(i, 2) != "</")
				blockStartCount++;
			else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
				blockEndCount++;

			if (blockStartCount >= 1 && blockStartCount == blockEndCount) {
				end = str.find('>', i);

				xml = new XML(this, str.substr(start, end + 1 - start));
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
			string key = move(it->first); //키를 받아오고
			shared_ptr<XMLList> xmlList(new XMLList()); //BasicXMLList를 만들며

			xmlQueue = &(it->second); //xmlQueue도 불러옴
			xmlList->reserve(xmlQueue->size()); //xmlQueue의 size에 따라 예약을 잡고

			//xmlList에 큐의 내용을 옮긴다
			while (xmlQueue->empty() == false)
			{
				xml = xmlQueue->front();
				xmlList->push_back(shared_ptr<XML>(xml));

				xmlQueue->pop();
			}
			//Map(BasicXML : map<string, BasicXMLList>)에 최종적으로 입력함
			insert({ key, xmlList });
		}

		if (size() > 0)
			value.clear();
	}

	/* -------------------------------------------------------------------
		GETTERS & SETTERS
	------------------------------------------------------------------- */
	template<> auto XML::getParent() const -> XML*
	{
		return this->parent;
	}
	template<> auto XML::getKey() const -> string
	{
		return this->key;
	}
	template<> auto XML::getLevel() const -> long
	{
		return level;
	}
	template<> auto XML::getValue() const -> string
	{
		return value;
	}
	
	template<> void XML::setKey(const string &key)
	{
		this->key = key;
	}
	template<> void XML::setValue(const string &value)
	{
		this->value = value;
	}
	template<> auto XML::setProperty(const string &key, const string &val) -> bool
	{
		return propertyMap.set(key, val);
	}

	/* -------------------------------------------------------------------
		METHODS OF MAP
	------------------------------------------------------------------- */
	template<> void XML::set(const string &key, const shared_ptr<XMLList> &xmlList)
	{
		XMLListMap::set(key, xmlList);

		for (size_t i = 0; i < xmlList->size(); i++)
		{
			xmlList->at(i)->parent = this;
			xmlList->at(i)->level = level + 1;
		}
	}
	template<> void XML::push_back(string& str)
	{
		if (str.empty() == true)
			return;

		shared_ptr<XML> xml(new XML(this, str));
		auto it = find(xml->getKey());

		//if not exists
		if (it == end()) {
			set(xml->getKey(), make_shared<XMLList>());
			it = find(xml->getKey());
		}

		//insert
		it->second->push_back(xml);
	}
	template<> void XML::push_back(const shared_ptr<XML> &xml)
	{
		string &key = xml->getKey();
		if (this->has(key) == false)
			set(key, make_shared<XMLList>());

		this->get(key)->push_back(xml);
	}

	template<> auto XML::hasProperty(const string &key) const -> bool
	{
		return propertyMap.has(key);
	}
	template<> auto XML::getProperty(const string &key) const -> string
	{
		return propertyMap.get(key);
	}
	template<> void XML::eraseProperty(const string &key)
	{
		propertyMap.erase(key);
	}
	template<> void XML::clearProperty()
	{
		propertyMap.clear();
	}

	template<> auto XML::getPropertyMap() const -> const Map<string, string>&
	{
		return propertyMap;
	}
	template<> auto XML::propertySize() const -> size_t
	{
		return propertyMap.size();
	}

	/* -------------------------------------------------------------------
		UTILITY
	------------------------------------------------------------------- */
	template<> auto XML::indexFilter(long value) -> long
	{
		if (value == -1 || value == string::npos)
			return LONG_MAX;
		else
			return value;
	}
	template<> auto XML::to_string(long level) const -> string
	{
		string tab(level, '\t');
		string text = tab + '<' + key;
		size_t i;

		//WRITE PROPERTIES
		for (auto it = propertyMap.begin(); it != propertyMap.end(); it++)
			text += ' ' + (it->first) + "\"" + (it->second) + '"';

		//Enclose there's not child xmllist
		if (size() == 0)
			if (value.empty() == true)
				text += " />";
			else
				text += '>' + value + "</" + key + '>';
		else
		{
			text += ">\n";

			//insert value
			if (value.empty() == false)
				text += tab + '\t' + value + '\n';

			/*
			-------------------------------------
			INSERT ITEMS
			-------------------------------------
			*/
			//	it->second: pointer of BasicXMLList
			for (auto it = begin(); it != end(); it++)
				for (i = 0; i < it->second->size(); i++)
					text += it->second->at(i)->to_string(level + 1);

			text += tab + "</" + key + '>';
		}
		if (level >= 1)
			text += '\n';
		return move(text);
	}
};