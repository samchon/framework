#include <samchon/protocol/InvokeParameter.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/StringUtil.hpp>

#include <samchon/library/Base64.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ----------------------------------------------------------
	CONSTRUCTORS
---------------------------------------------------------- */
InvokeParameter::InvokeParameter(const string &name, const double &val)
{
	this->name = name;
	this->type = "string";

	this->value = new double(val);
}
InvokeParameter::InvokeParameter(const string &name, const string &str)
{
	this->name = name;
	this->type = "string";
	
	this->value = new string(str);
}
InvokeParameter::InvokeParameter(const string &name, const shared_ptr<XML> &xml)
{
	this->name = name;
	this->type = "XML";

	this->value = new shared_ptr<XML>(xml);
}

InvokeParameter::~InvokeParameter()
{
	if(type == "number")
		delete (double*)value;
	else if(type == "string")
		delete (string*)value;
	else if(type == "XML")
		delete (shared_ptr<XML>*)value;
}

/* ----------------------------------------------------------
	GETTERS
---------------------------------------------------------- */
auto InvokeParameter::getName() const -> std::string
{
	return name;
}
auto InvokeParameter::getType() const -> std::string
{
	return type;
}

auto InvokeParameter::getValueAsNumber() const -> double
{
	if(type == "number")
		return *(double*)value;
	else if(type == "string")
		return stod(*(string*)value);
	else
		throw invalid_argument("invalid type specification");
}
auto InvokeParameter::getValueAsString() const -> string
{
	if(type == "number")
		return to_string(*(double*)value);
	else if(type == "string")
		return *(string*)value;
	else if(type == "XML")
		return ((shared_ptr<XML>*)value)->get()->toString();
	else
		throw invalid_argument("invalid type specification");
}
auto InvokeParameter::getValueAsXML() const -> shared_ptr<XML>
{
	if(type == "XML")
		return *(shared_ptr<XML>*)value;
	else
		throw invalid_argument("invalid type specification");
}
auto InvokeParameter::getValueAsByteArray() const -> ByteArray
{
	if(type == "ByteArray")
		return *(ByteArray*)value;
	else
		throw invalid_argument("invalid type specification");
}

auto InvokeParameter::moveValueAsString() -> string
{
	if(type != "string")
		throw invalid_argument("invalid type specification");

	return move(*(string*)value);
}
auto InvokeParameter::moveValueAsByteArray() -> ByteArray
{
	if(type != "ByteArray")
		throw invalid_argument("invalid type specification");

	return move(*(ByteArray*)value);
}

/* ----------------------------------------------------------
	HIDDEN METHODS
---------------------------------------------------------- */
InvokeParameter::InvokeParameter(shared_ptr<XML> xml)
{
	if(xml->hasProperty("name") == true)
		this->name = xml->getProperty("name");
	this->type = xml->getProperty("type");

	if(type == "double")
		this->value = new double(xml->getValue<double>());
	else if(type == "string")
		this->value = new string(xml->getValue<string>());
	else if (type == "XML")
		this->value = new shared_ptr<XML>(xml->begin()->second->at(0));
	else if (type == "ByteArray")
	{
		if (xml->getValue().find("size: #") == string::npos)
		{
			ByteArray &byteArray = Base64::decode(xml->getValue());
			
			this->value = new ByteArray(move(byteArray));
		}
		else
		{
			unsigned long long size = stoull(StringUtil::between(xml->getValue(), "size: #"));

			this->type = "Pre-ByteArray";
			this->value = (void*)size;
		}
	}
}
auto InvokeParameter::reservedByteArraySize() const -> size_t
{
	return (size_t)value;
}

/* ----------------------------------------------------------
	EXPORTS
---------------------------------------------------------- */
auto InvokeParameter::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setTag("parameter");

	if(name.empty() == false)
		xml->setProperty("name", name);
	xml->setProperty("type", type);

	if (type == "XML")
		xml->push_back(this->getValueAsXML());
	else if (type == "ByteArray")
	{
		ByteArray *byteArray = (ByteArray*)this->value;

		xml->setValue("size: #" + to_string(byteArray->size()));
	}
	else
		xml->setValue(getValueAsString());

	return xml;
}
auto InvokeParameter::toSQL() const -> std::string
{
	return "";
	//NAME, TYPE, VALUE
	/*std::string value;
	if (xml != nullptr)
		value = move(xml->toString());
	else
		value = this->value;

	std::string &sql = StringUtil::substituteSQL("({1}, {2}, {3})", name, type, value);
	return move(sql);*/
}