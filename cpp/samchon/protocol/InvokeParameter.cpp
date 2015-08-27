#include <samchon/protocol/InvokeParameter.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ----------------------------------------------------------
	CONSTRUCTORS
---------------------------------------------------------- */
InvokeParameter::InvokeParameter(shared_ptr<XML> xml)
{
	this->name = xml->getProperty(_T("name"));
	this->type = xml->getProperty(_T("type"));

	if (this->type == _T("xml"))
		this->xml = xml->begin()->second->at(0);
	else
		this->value = xml->getValue();
}
InvokeParameter::InvokeParameter(const String &name, const String &type, const String &value)
{
	this->name = name;
	this->type = type;
	this->value = value;
}

#define INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(_Ty) \
template<> InvokeParameter::InvokeParameter(const String &name, const _Ty &value) \
{ \
	this->name = name; \
	this->type = _T(#_Ty); \
	this->value = toString(value); \
}
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(bool)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(short)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(int)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(long)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(long long)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(unsigned short)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(unsigned int)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(unsigned long)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(unsigned long long)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(float)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(double)
INVOKE_PARAMETER_TEMPLATE_CONSTRUCTOR(long double)

template<> InvokeParameter::InvokeParameter(const String &name, const String &value)
{
	this->name = name;
	this->type = _T("String");
	this->value = value;
}
template<> InvokeParameter::InvokeParameter(const String &name, const shared_ptr<XML> &xml)
{
	this->name = name;
	this->type = _T("XML");
	this->xml = xml;
}

/* ----------------------------------------------------------
	GETTERS
---------------------------------------------------------- */
auto InvokeParameter::key() const -> String
{
	return name;
}
auto InvokeParameter::getName() const -> String
{
	return name;
}
auto InvokeParameter::getType() const -> String
{
	return type;
}

//TEMPLATE VALUE GETTERS
template<> auto InvokeParameter::getValue() const -> bool
{
	return (bool)stoi(value);
}
template<> auto InvokeParameter::getValue() const -> short
{
	return (short)stoi(value);
}
template<> auto InvokeParameter::getValue() const -> int
{
	return stoi(value);
}
template<> auto InvokeParameter::getValue() const -> long
{
	return stol(value);
}
template<> auto InvokeParameter::getValue() const -> long long
{
	return stoll(value);
}
template<> auto InvokeParameter::getValue() const -> unsigned short
{
	return (unsigned short)stoul(value);
}
template<> auto InvokeParameter::getValue() const -> unsigned int
{
	return (unsigned int)stoull(value);
}
template<> auto InvokeParameter::getValue() const -> unsigned long
{
	return stoul(value);
}
template<> auto InvokeParameter::getValue() const -> unsigned long long
{
	return stoull(value);
}
template<> auto InvokeParameter::getValue() const -> String
{
	return value;
}

auto InvokeParameter::getValueAsXML() const -> shared_ptr<XML>
{
	return xml;
}

/* ----------------------------------------------------------
	EXPORTS
---------------------------------------------------------- */
auto InvokeParameter::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setTag(_T("parameter"));
	xml->setProperty(_T("name"), name);
	xml->setProperty(_T("type"), type);

	if (type == _T("XML"))
		xml->push_back(this->xml);
	else
		xml->setValue(value);

	return xml;
}
auto InvokeParameter::toSQL() const -> String
{
	//NAME, TYPE, VALUE
	String value;
	if (xml != nullptr)
		value = move(xml->toString());
	else
		value = this->value;

	String &sql = TStringUtil::substituteSQL(_T("({1}, {2}, {3})"), name, type, value);
	return move(sql);
}