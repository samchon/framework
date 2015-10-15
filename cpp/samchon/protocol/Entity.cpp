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
auto Entity::key() const -> std::string { return ""; }

/* ---------------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------------- */
Entity::Entity() 
{
}
void Entity::construct(shared_ptr<XML>) 
{
}

/* ---------------------------------------------------------------
	PROTOCOLS
--------------------------------------------------------------- */
auto Entity::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setTag(TAG());

	return xml;
}