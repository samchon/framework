#include <samchon/protocol/InvokeParameter.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/library/XML.hpp>
#include <samchon/library/Base64.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ----------------------------------------------------------
	CONSTRUCTORS
---------------------------------------------------------- */
InvokeParameter::InvokeParameter(const string &name, const char *pChar)
	: InvokeParameter(name, string(pChar))
{
}

//CUSTOM CONSTRUCTOR
InvokeParameter::InvokeParameter(const string &name, const string &type, const string &val)
	: super()
{
	this->name = name;
	this->type = type;
	this->str = val;
}

//MOVE CONSTRUCTORS
InvokeParameter::InvokeParameter(const string &name, string &&str)
	: super()
{
	this->name = name;
	this->type = "string";

	this->str = move(str);
}
InvokeParameter::InvokeParameter(const string &name, ByteArray &&byteArray)
	: super()
{
	this->name = name;
	this->type = "ByteArray";

	this->byteArray = move(byteArray);
}

/* ----------------------------------------------------------
	PROTECTED CONSTRUCTORS
---------------------------------------------------------- */
InvokeParameter::InvokeParameter()
	: super()
{
}

void InvokeParameter::construct(shared_ptr<XML> xml)
{
	if(xml->hasProperty("name") == true)
		this->name = xml->getProperty("name");
	else
		this->name = "";

	this->type = xml->getProperty("type");

	if(type == "XML")
		this->xml = xml->begin()->second->at(0);
	else if (type == "ByteArray")
	{
		size_t size = xml->getValue<size_t>();
		
		byteArray.reserve(size);
	}
	else
		this->str = xml->getValue();
}

auto InvokeParameter::reservedByteArraySize() const -> size_t
{
	return (size_t)stoull(StringUtil::between(this->str, "size: #"));
}
void InvokeParameter::setByteArray(ByteArray &&byteArray)
{
	this->byteArray = move(byteArray);
}

/* ----------------------------------------------------------
	GETTERS
---------------------------------------------------------- */
auto InvokeParameter::key() const -> string
{
	return name;
}

auto InvokeParameter::getName() const -> std::string
{
	return name;
}
auto InvokeParameter::getType() const -> std::string
{
	return type;
}

auto InvokeParameter::getValueAsXML() const -> shared_ptr<XML>
{
	return xml;
}

/* ----------------------------------------------------------
	EXPORTS
---------------------------------------------------------- */
auto InvokeParameter::TAG() const -> string
{
	return "parameter";
}

auto InvokeParameter::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();

	if(name.empty() == false)
		xml->setProperty("name", name);
	xml->setProperty("type", type);

	if (type == "XML")
	{
		xml->push_back(this->xml);
	}
	else if (type == "ByteArray")
	{
		xml->setValue(byteArray.size());
	}
	else
	{
		xml->setValue(str);
	}

	return xml;
}
auto InvokeParameter::toSQL() const -> std::string
{
	//NAME, TYPE, VALUE
	std::string value;

	if (xml != nullptr)
		value = move(xml->toString());
	else
		value = this->str;

	std::string &sql = StringUtil::substituteSQL("({1}, {2}, {3})", name, type, value);
	return sql;
}