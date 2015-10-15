#include <samchon/protocol/InvokeParameter.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* -------------------------------------------------
	TAGS
------------------------------------------------- */
auto InvokeParameter::key() const -> String
{
	return name;
}

/* -------------------------------------------------
	CONSTRUCTORS
------------------------------------------------- */
InvokeParameter::InvokeParameter(shared_ptr<XML> xml)
{
	this->name = xml->getProperty(_T("name"));
	this->type = xml->getProperty(_T("type"));

	if (xml->empty() == false)
		setValue( xml->begin()->second->at(0) );
	else
		setValue(type, xml->getValue());
}
InvokeParameter::InvokeParameter(const String &name, const String &type, const String &value)
{
	this->name = name;
	this->type = type;

	setValue(type, value);
}
InvokeParameter::~InvokeParameter()
{
#	define INVOKE_PARAMETER_DESTRUCTION(_Ty, $type_name) \
	if(type == $type_name) \
		delete (_Ty*)value;

	INVOKE_PARAMETER_DESTRUCTION(short, _T("short"))
	else INVOKE_PARAMETER_DESTRUCTION(int, _T("int"))
	else INVOKE_PARAMETER_DESTRUCTION(long, _T("long"))
	else INVOKE_PARAMETER_DESTRUCTION(long long, _T("long long"))
	else INVOKE_PARAMETER_DESTRUCTION(unsigned short, _T("unsigned short"))
	else INVOKE_PARAMETER_DESTRUCTION(unsigned int, _T("unsigned int"))
	else INVOKE_PARAMETER_DESTRUCTION(unsigned long, _T("unsigned long"))
	else INVOKE_PARAMETER_DESTRUCTION(unsigned long long, _T("unsigned long long"))
	else INVOKE_PARAMETER_DESTRUCTION(float, _T("float"))
	else INVOKE_PARAMETER_DESTRUCTION(double, _T("double"))
	else INVOKE_PARAMETER_DESTRUCTION(long double, _T("long double"))

	else INVOKE_PARAMETER_DESTRUCTION(String, _T("String"))
	else INVOKE_PARAMETER_DESTRUCTION(shared_ptr<XML>, _T("XML"))
}

/* -------------------------------------------------
	ACCESSORS
------------------------------------------------- */
//GETTERS
auto InvokeParameter::getName() const -> String
{
	return name;
}
auto InvokeParameter::getType() const -> String
{
	return type;
}

//TEMPLATE ACCESSORS
#define INVOKE_PARAMETER_VALUE_ACCESSOR(_Ty, $type_name) \
template<> auto InvokeParameter::getValue() const -> _Ty \
{ \
	return *(_Ty*)value; \
} \
template<> void InvokeParameter::setValue(const _Ty &val) \
{ \
	this->type = $type_name; \
	this->value = new _Ty(val); \
}

INVOKE_PARAMETER_VALUE_ACCESSOR(short,				_T("short"))
INVOKE_PARAMETER_VALUE_ACCESSOR(int,				_T("int"))
INVOKE_PARAMETER_VALUE_ACCESSOR(long,				_T("long"))
INVOKE_PARAMETER_VALUE_ACCESSOR(long long,			_T("long long"))
INVOKE_PARAMETER_VALUE_ACCESSOR(unsigned short,		_T("unsigned short"))
INVOKE_PARAMETER_VALUE_ACCESSOR(unsigned int,		_T("unsigned int"))
INVOKE_PARAMETER_VALUE_ACCESSOR(unsigned long,		_T("unsigned long"))
INVOKE_PARAMETER_VALUE_ACCESSOR(unsigned long long,	_T("unsigned long long"))
INVOKE_PARAMETER_VALUE_ACCESSOR(float,				_T("float"))
INVOKE_PARAMETER_VALUE_ACCESSOR(double,				_T("double"))
INVOKE_PARAMETER_VALUE_ACCESSOR(long double,		_T("long double"))

INVOKE_PARAMETER_VALUE_ACCESSOR(String,				_T("String"))
INVOKE_PARAMETER_VALUE_ACCESSOR(shared_ptr<XML>,	_T("XML"))

//SET_VALUE
void InvokeParameter::setValue(const String &type, const String &value)
{
	this->type = type;

	if (type == _T("short"))
		this->value = new short((short)stoi(value));
	else if (type == _T("int"))
		this->value = new int(stoi(value));
	else if (type == _T("long"))
		this->value = new long(stol(value));
	else if (type == _T("long long"))
		this->value = new long long(stoll(value));
	else if (type == _T("unsigned short"))
		this->value = new unsigned short((unsigned short)stoul(value));
	else if (type == _T("unsigned int"))
		this->value = new unsigned int((unsigned int)stoull(value));
	else if (type == _T("unsigned long"))
		this->value = new unsigned long(stoul(value));
	else if (type == _T("unsigned long long"))
		this->value = new unsigned long long(stoull(value));
	else if (type == _T("float"))
		this->value = new float(stof(value));
	else if (type == _T("double"))
		this->value = new long(stod(value));
	else if (type == _T("long double"))
		this->value = new long(stold(value));
	
	else if (type == _T("String"))
		this->value = new String(value);
}

//GET_STRING
auto InvokeParameter::getString() const -> String
{
	String val;

	if (type == _T("short"))
		val = toString(getValue<short>());
	else if (type == _T("int"))
		val = toString(getValue<int>());
	else if (type == _T("long"))
		val = toString(getValue<long>());
	else if (type == _T("long long"))
		val = toString(getValue<long long>());
	else if (type == _T("unsigned short"))
		val = toString(getValue<unsigned short>());
	else if (type == _T("unsigned int"))
		val = toString(getValue<unsigned int>());
	else if (type == _T("unsigned long"))
		val = toString(getValue<unsigned long>());
	else if (type == _T("unsigned long long"))
		val = toString(getValue<unsigned long long>());
	else if (type == _T("float"))
		val = toString(getValue<float>());
	else if (type == _T("double"))
		val = toString(getValue<double>());
	else if (type == _T("long double"))
		val = toString(getValue<long double>());

	else if (type == _T("String"))
		val = move( getValue<String>() );
	else if (type == _T("XML"))
		val = move( getValue<shared_ptr<XML>>()->toString() );

	return move(val);
}

/* -------------------------------------------------
	EXPORTS
------------------------------------------------- */
auto InvokeParameter::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setKey(_T("parameter"));
	xml->setProperty(_T("name"), name);
	xml->setProperty(_T("type"), type);

	if (type == _T("XML"))
		xml->push_back( getValue<shared_ptr<XML>>() );
	else
		xml->setValue( getString() );

	return xml;
}
auto InvokeParameter::toSQL() const -> String
{
	//NAME, TYPE, VALUE
	String &value = getString();

	String &sql = StringUtil::substituteSQL(_T("({1}, {2}, {3})"), name, type, value);
	return move(sql);
}