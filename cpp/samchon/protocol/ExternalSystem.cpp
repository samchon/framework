#include <samchon/protocol/ExternalSystem.hpp>

#include <samchon/protocol/ExternalSystemRole.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ExternalSystem::ExternalSystem()
	: super()
{
}

void ExternalSystem::construct(shared_ptr<XML> xml)
{
	this->name = xml->getProperty("name");

	if(xml->hasProperty("ip"))		this->ip = xml->getProperty("ip");
	if(xml->hasProperty("port"))	this->port = xml->getProperty<int>("port");

	super::construct(xml);
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ExternalSystem, ExternalSystemRole)

auto ExternalSystem::key() const -> string
{
	return name;
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ExternalSystem::replyData(shared_ptr<Invoke> invoke)
{
	string &listener = invoke->getListener();

	for(size_t i = 0; i < size(); i++)
		if(at(i)->hasListener(listener) == true)
			at(i)->replyData(invoke);
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ExternalSystem::TAG() const -> string
{
	return "system";
}
auto ExternalSystem::CHILD_TAG() const -> string
{
	return "role";
}

auto ExternalSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);

	if (ip.empty() == false)
	{
		xml->setProperty("ip", ip);
		xml->setProperty("port", port);
	}

	return xml;
}