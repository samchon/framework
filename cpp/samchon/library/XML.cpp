#include <samchon/library/XML.hpp>
#include <samchon/library/XMLQuote.hpp>

#include <list>
#include <queue>

#include <samchon/library/WeakString.hpp>
#include <samchon/library/Math.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* -------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------- */
XML::XML()
	: XMLListMap()
{
	parent = nullptr;
	level = 0;
}
XML::XML(const String &str)
	: XML(WeakString(str))
{
}
XML::XML(WeakString wStr)
	: XML()
{
	if (wStr.find(_T('<')) == String::npos)
		return;

	//WHEN COMMENT IS
	String replacedStr;
	if (wStr.find(_T("<!--")) != String::npos)
	{
		queue<pair<size_t, size_t>> indexPairQueue;
		size_t beginX = 0, endX;

		//CONSTRUCT INDEXES
		replacedStr.reserve(wStr.size());
		while ((beginX = wStr.find(_T("<!--"), beginX)) != String::npos)
		{
			indexPairQueue.push({ beginX, wStr.find(_T("-->"), beginX + 1) + 3 });
			beginX++;
		}

		//INSERT STRINGS
		beginX = 0;
		while (indexPairQueue.empty() == false)
		{
			endX = indexPairQueue.front().first;
			replacedStr.append(wStr.substring(beginX, endX).str());

			beginX = indexPairQueue.front().second;
			indexPairQueue.pop();
		}
		replacedStr.append(wStr.substr(beginX).str());
		
		//RE-REFERENCE
		wStr = replacedStr;
	}

	//ERASE HEADERS OF XML
	if (wStr.find(_T("<?xml")) != String::npos)
		wStr = wStr.between(_T("?>"));

	construct(wStr);
}
XML::XML(XML *parent, WeakString &str)
	: XML()
{
	this->parent = parent;
	this->level = parent->level + 1;

	construct(str);
}

void XML::construct(WeakString &wStr)
{
	constructKey(wStr);
	constructProperty(wStr);
	if (constructValue(wStr) == true)
		constructChildren(wStr);
}
void XML::constructKey(WeakString &wStr)
{
	size_t startX = wStr.find(_T('<')) + 1;
	size_t endX =
		calcMinIndex
		(
			{
				wStr.find(_T(' '), startX),
				wStr.find(_T("\r\n"), startX),
				wStr.find(_T('\n'), startX),
				wStr.find(_T('\t'), startX),
				wStr.find(_T('>'), startX),
				wStr.find(_T('/'), startX)
			}
		);

	//Determinate the KEY
	key = move( wStr.substring(startX, endX).str() );
}
void XML::constructProperty(WeakString &wStr)
{
	size_t i_begin = wStr.find(_T('<') + key) + key.size() + 1;
	size_t i_endSlash = wStr.rfind(_T('/'));
	size_t i_endBlock = wStr.find(_T('>'), i_begin);

	size_t i_end = calcMinIndex({ i_endSlash, i_endBlock });
	if (i_end == String::npos || i_begin >= i_end)
		return;

	//<comp label='ABCD' /> : " label='ABCD' "
	WeakString &line = wStr.substring(i_begin, i_end); 

	if (line.find(_T('=')) == String::npos)
		return;

	String label, value;
	vector<XMLQuote*> helpers;
	bool inQuote = false;
	long type;
	size_t startPoint, equalPoint;
	size_t i;

	for (i = 0; i < line.size(); i++) {
		//Start of quote
		if (inQuote == false && (line[i] == _T('\'') || line[i] == _T('"')))
		{
			inQuote = true;
			startPoint = i;

			if (line[i] == _T('\''))
				type = XMLQuote::QUOTE_SINGLE;
			else if (line[i] == _T('"'))
				type = XMLQuote::QUOTE_DOUBLE;
		}
		else if
			(
				inQuote == true &&
				(
					(type == XMLQuote::QUOTE_SINGLE && line[i] == _T('\'')) ||
					(type == XMLQuote::QUOTE_DOUBLE && line[i] == _T('"'))
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
			equalPoint = (long long)line.find('=');
			label = move( line.substring(0, equalPoint).trim().str() );
		}
		else
		{
			equalPoint = line.find('=', helpers[i - 1]->getEndPoint() + 1);
			label = line.substring(helpers[i - 1]->getEndPoint() + 1, equalPoint).trim().str();
		}
		
		value = 
			move
			(
				decodeProperty
				(
					line.substring
					(
						helpers[i]->getStartPoint() + 1,
						helpers[i]->getEndPoint()
					)
				)
			);
		
		//INSERT INTO PROPERTY_MAP
		propertyMap.set(label, move(value));
	}
	for (i = 0; i < helpers.size(); i++)
		delete helpers[i];
}
auto XML::constructValue(WeakString &wStr) -> bool
{
	size_t i_endSlash = wStr.rfind(_T('/'));
	size_t i_endBlock = wStr.find(_T('>'));

	if (i_endSlash < i_endBlock || i_endBlock + 1 == wStr.rfind(_T('<')))
	{
		//STATEMENT1: <TAG />
		//STATEMENT2: <TAG></TAG> -> SAME WITH STATEMENT1: <TAG />
		value.clear();
		return false;
	}

	size_t startX = i_endBlock + 1;
	size_t endX = wStr.rfind(_T('<'));
	wStr = wStr.substring(startX, endX); //REDEFINE WEAK_STRING -> IN TO THE TAG

	if (wStr.find(_T('<')) == string::npos)
		value = move( wStr.trim().str() );
	else
		value.clear();

	return true;
}
void XML::constructChildren(WeakString &wStr)
{
	if (wStr.find(_T('<')) == String::npos)
		return;

	size_t startX = wStr.find(_T('<'));
	size_t endX = wStr.rfind(_T('>')) + 1;
	wStr = wStr.substring(startX, endX);

	map<String, queue<XML *>> xmlQueueMap;
	queue<XML*> *xmlQueue;
	XML *xml;

	int blockStartCount = 0;
	int blockEndCount = 0;
	size_t start = 0;
	size_t end;
	size_t i;

	//FIND BLOCKS, CREATES XML AND PUT IN TEMPORARY CONTAINER
	for (i = 0; i < wStr.size(); i++) 
	{
		if (wStr[i] == _T('<') && wStr.substr(i, 2) != _T("</"))
			blockStartCount++;
		else if (wStr.substr(i, 2) == _T("/>") || wStr.substr(i, 2) == _T("</"))
			blockEndCount++;

		if (blockStartCount >= 1 && blockStartCount == blockEndCount) 
		{
			//NO PROBLEM TO AVOID COMMENT
			end = wStr.find(_T('>'), i);

			xml = new XML(this, wStr.substring(start, end + 1));
			xmlQueueMap[xml->getKey()].push(xml);

			i = end; //WHY NOT END+1? 
			start = end + 1;
			blockStartCount = 0;
			blockEndCount = 0;
		}
	}

	//RESERVE
	for (auto it = xmlQueueMap.begin(); it != xmlQueueMap.end(); it++)
	{
		String key = move(it->first); //GET KEY
		shared_ptr<XMLList> xmlList(new XMLList());

		xmlQueue = &(it->second);
		xmlList->reserve(xmlQueue->size()); //RESERVE

		//MOVE QUEUE TO XML_LIST
		while (xmlQueue->empty() == false)
		{
			xml = xmlQueue->front();
			xmlList->push_back(shared_ptr<XML>(xml));

			xmlQueue->pop();
		}
		//INSERT IN MAP BY KEY
		insert({ key, xmlList });
	}

	if (size() > 0)
		value.clear();
}

/* -------------------------------------------------------------------
GETTERS & SETTERS
------------------------------------------------------------------- */
//GETTERS
auto XML::getParent() const -> XML*
{
	return this->parent;
}
auto XML::getKey() const -> String
{
	return this->key;
}
auto XML::getLevel() const -> long
{
	return level;
}

template<> auto XML::getValue() const -> int
{
	return stoi(value);
}
template<> auto XML::getValue() const -> long
{
	return stol(value);
}
template<> auto XML::getValue() const -> long long
{
	return stoll(value);
}
template<> auto XML::getValue() const -> float
{
	return stof(value);
}
template<> auto XML::getValue() const -> double
{
	return stod(value);
}
template<> auto XML::getValue() const -> unsigned int
{
#ifdef _WIN64
	return (unsigned int)stoul(value);
#else
	return (unsigned int)stoull(value);
#endif
}
template<> auto XML::getValue() const -> unsigned long
{
	return stoul(value);
}
template<> auto XML::getValue() const -> unsigned long long
{
	return stoull(value);
}
template<> auto XML::getValue() const -> long double
{
	return stold(value);
}

template<> auto XML::getValue() const -> String
{
	return value;
}

//SETTERS
void XML::setKey(const String &key)
{
	this->key = key;
}

template<> void XML::setValue(const int &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const long &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const long long &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const float &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const double &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const unsigned int &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const unsigned long &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const unsigned long long &value)
{
	this->value = toString(value);
}
template<> void XML::setValue(const long double &value)
{
	this->value = toString(value);
}

template<> void XML::setValue(const String &value)
{
	this->value = value;
}
template<> void XML::setValue(const shared_ptr<XML> &xml)
{
	clear();
	push_back(xml);
}

/* -------------------------------------------------------------------
	METHODS OF MAP
------------------------------------------------------------------- */
void XML::set(const String &key, const shared_ptr<XMLList> &xmlList)
{
	XMLListMap::set(key, xmlList);

	for (size_t i = 0; i < xmlList->size(); i++)
	{
		xmlList->at(i)->parent = this;
		xmlList->at(i)->level = level + 1;
	}
}
void XML::push_back(const String &str)
{
	push_back(WeakString(str));
}
void XML::push_back(const WeakString &str)
{
	if (str.empty() == true)
		return;

	shared_ptr<XML> xml(new XML(this, (WeakString&)str));
	auto it = find(xml->getKey());

	//if not exists
	if (it == end()) {
		set(xml->getKey(), make_shared<XMLList>());
		it = find(xml->getKey());
	}

	//insert
	it->second->push_back(xml);
}
void XML::push_back(const shared_ptr<XML> xml)
{
	String &key = xml->getKey();
	if (this->has(key) == false)
		set(key, make_shared<XMLList>());

	this->get(key)->push_back(xml);
}

/* -------------------------------------------------------------------
	METHODS OF PROPERTIES
------------------------------------------------------------------- */
void XML::addAllProperty(const shared_ptr<XML> xml)
{
//	propertyMap.insert( propertyMap.end(), 
//		xml->propertyMap.begin(), xml->propertyMap.end() );
	for (auto it = xml->propertyMap.begin(); it != xml->propertyMap.end(); it++)
		propertyMap[it->first] = it->second;
}
void XML::eraseProperty(const String &key)
{
	propertyMap.erase(key);
}
void XML::clearProperty()
{
	propertyMap.clear();
}

auto XML::propertySize() const -> size_t
{
	return propertyMap.size();
}
auto XML::getPropertyMap() const -> const Map<String, String>&
{
	return propertyMap;
}

//GETTERS
auto XML::hasProperty(const String &key) const -> bool
{
	return propertyMap.has(key);
}

template<> auto XML::getProperty(const String &key) const -> int
{
	return stoi( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> long
{
	return stol( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> long long
{
	return stoll( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> float
{
	return stof( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> double
{
	return stod( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> unsigned int
{
#ifdef _WIN64
	return stull( propertyMap.get(key) );
#else
	return stoul( propertyMap.get(key) );
#endif
}
template<> auto XML::getProperty(const String &key) const -> unsigned long
{
	return stoul( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> unsigned long long
{
	return stoll( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> long double
{
	return stold( propertyMap.get(key) );
}
template<> auto XML::getProperty(const String &key) const -> String
{
	return propertyMap.get(key);
}

//SETTERS
template<> void XML::setProperty(const String &key, const int &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const long &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const long long &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const float &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const double &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const unsigned int &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const unsigned long &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const unsigned long long &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const long double &val)
{
	propertyMap.set(key, toString(val));
}
template<> void XML::setProperty(const String &key, const String &val)
{
	propertyMap.set(key, val);
}

/* -------------------------------------------------------------------
	UTILITY
------------------------------------------------------------------- */
auto XML::calcMinIndex(const std::vector<size_t> &vec) const -> size_t
{
	size_t val = String::npos;
	for (size_t i = 0; i < vec.size(); i++)
		if (vec[i] != String::npos && vec[i] < val)
			val = vec[i];

	return val;
}

auto XML::encodeProperty(const WeakString &str) const -> String
{
	static vector<pair<String, String>> pairArray =
	{
		{ _T("&"), _T("&amp;") },
		{ _T("<"), _T("&lt;") },
		{ _T(">"), _T("&gt;") },
		{ _T("\""), _T("&quot;") },
		{ _T("'"), _T("&apos;") },
		{ _T("\t"), _T("&#x9;") }, //9
		{ _T("\n"), _T("&#xA;") }, //10
		{ _T("\r"), _T("&#xD;") } //13
	};
	
	return str.replaceAll(pairArray);
}
auto XML::decodeProperty(const WeakString &str) const -> String
{
	static vector<pair<String, String>> pairArray =
	{
		{ _T("&amp;"), _T("&") },
		{ _T("&lt;"), _T("<") },
		{ _T("&gt;"), _T(">") },
		{ _T("&quot;"), _T("\"") },
		{ _T("&apos;"), _T("'") },
		{ _T("&#x9;"), _T("\t") }, //9
		{ _T("&#xA;"), _T("\n") }, //10
		{ _T("&#xD;"), _T("\r") } //13
	};

	return str.replaceAll(pairArray);
}
auto XML::encodeValue(const WeakString &str) const -> String
{
	static vector<pair<String, String>> pairArray =
	{
		{ _T("&"), _T("&amp;") },
		{ _T("<"), _T("&lt;") },
		{ _T(">"), _T("&gt;") }
	};

	return str.trim().replaceAll(pairArray);
}
auto XML::decodeValue(const WeakString &str) const -> String
{
	static vector<pair<String, String>> pairArray =
	{
		{ _T("&amp;"), _T("&") },
		{ _T("&lt;"), _T("<") },
		{ _T("&gt;"), _T(">") }
	};

	return str.replaceAll(pairArray);
}

auto XML::toString(size_t level) const -> String
{
	String str;
	size_t size = 0;

	list<String> buffer;
	fetchString(buffer, level);

	for (String &line : buffer)
		size += line.size();
	str.reserve(size);

	for (String &line : buffer)
		str.append(line);

	return move(str);
}
void XML::fetchString(list<String> &buffer, size_t level) const
{
	//KEY
	buffer.push_back( String(level, _T('\t')) + _T("<") + key );

	//PROPERTIES
	for (auto it = propertyMap.begin(); it != propertyMap.end(); it++)
	{
		buffer.push_back(_T(" ") + it->first + _T("=\""));
		buffer.push_back( move(encodeProperty(it->second)) );
		buffer.push_back(_T("\""));
	}
	
	//CHILDREN
	if (empty() == true) //NO CHILDREN
		if (value.empty() == false) //BUT HAS VALUE
		{
			buffer.push_back(_T(">"));
			buffer.push_back( move(encodeValue(value)) );
			buffer.push_back(_T("</") + key + _T(">"));
		}
		else
			buffer.push_back(L" />");
	else //HAS CHILDREN
	{
		buffer.push_back(_T(">\n"));

		for (auto it = begin(); it != end(); it++)
			for (size_t i = 0; i < it->second->size(); i++)
				it->second->at(i)->fetchString(buffer, level + 1);

		buffer.push_back( String(level, _T('\t')) + _T("</") + key + _T(">") );
	}
	if (level >= 1)
		buffer.push_back(_T("\n"));
}