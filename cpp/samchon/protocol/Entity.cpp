#include <samchon/protocol/Entity.hpp>

#include <samchon/library/SQLStatement.hpp>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ---------------------------------------------------------------
	IDENTIFIERS
--------------------------------------------------------------- */
auto Entity::LISTENER() const -> String { return _T(""); }
auto Entity::key() const -> String { return _T(""); }

/* ---------------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------------- */
Entity::Entity() {}

/* ---------------------------------------------------------------
	PROTOCOLS
--------------------------------------------------------------- */
auto Entity::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setKey(TAG());

	return xml;
}
auto Entity::toInvoke() const -> shared_ptr<Invoke>
{
	shared_ptr<Invoke> invoke(new Invoke(LISTENER()));
	invoke->push_back(new InvokeParameter(_T("xml"), toXML()));
	
	return invoke;
}