#include <samchon/protocol/Invoke.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* -----------------------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------------------- */
Invoke::Invoke()
	: super()
{
}
Invoke::Invoke(const std::string &listener)
	: super()
{
	this->listener = listener;
}

void Invoke::construct(shared_ptr<XML> xml)
{
	this->listener = xml->getProperty("listener");

	super::construct(xml);
}
auto Invoke::createChild(shared_ptr<XML>) -> InvokeParameter*
{
	return new InvokeParameter();
}

/*#define INVOKE_CONSTRUCT_BODY($TYPE) \
void Invoke::construct($TYPE val) \
{ \
	emplace_back(new InvokeParameter("", val)); \
}

INVOKE_CONSTRUCT_BODY(bool)
INVOKE_CONSTRUCT_BODY(char)
INVOKE_CONSTRUCT_BODY(short)
INVOKE_CONSTRUCT_BODY(long)
INVOKE_CONSTRUCT_BODY(long long)
INVOKE_CONSTRUCT_BODY(int)
INVOKE_CONSTRUCT_BODY(float)
INVOKE_CONSTRUCT_BODY(double)

INVOKE_CONSTRUCT_BODY(unsigned char)
INVOKE_CONSTRUCT_BODY(unsigned short)
INVOKE_CONSTRUCT_BODY(unsigned long)
INVOKE_CONSTRUCT_BODY(unsigned long long)
INVOKE_CONSTRUCT_BODY(unsigned int)
INVOKE_CONSTRUCT_BODY(long double)
INVOKE_CONSTRUCT_BODY(const char*)

INVOKE_CONSTRUCT_BODY(const string &)
INVOKE_CONSTRUCT_BODY(const ByteArray &)
INVOKE_CONSTRUCT_BODY(const shared_ptr<XML> &)*/

/* -----------------------------------------------------------------------
	GETTERS
----------------------------------------------------------------------- */
auto Invoke::getListener() const -> std::string
{
	return listener;
}

void Invoke::setListener(const string &listener)
{
	this->listener = listener;
}

/* -----------------------------------------------------------------------
	EXPORTERS
----------------------------------------------------------------------- */
auto Invoke::TAG() const -> string
{
	return "invoke";
}
auto Invoke::CHILD_TAG() const -> string
{
	return "parameter";
}

auto Invoke::toXML() const -> shared_ptr<XML>
{
	std::shared_ptr<XML> &xml = super::toXML();

	xml->setProperty("listener", listener);

	return xml;
}
auto Invoke::toSQL() const -> std::string
{
	string sql;
		//= StringUtil::substituteSQL("INSERT INTO @invokeTable VALUES ({1})\n", this->listener);

	if (empty() == false)
	{
		sql += "INSERT INTO @parameterTable VALUES\n";
		for (size_t i = 0; i < size(); i++)
			sql += "\t" + at(i)->toSQL() + ((i == size() - 1) ? ";\n\n" : ",\n");
	}

	return move(sql);
}