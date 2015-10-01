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
	: super(),
	IClient()
{
}
void ExternalSystem::construct(shared_ptr<XML> xml)
{
	this->name = xml->getProperty("name");

	this->ip = xml->getProperty("ip");
	this->port = xml->getProperty<int>("port");

	super::construct(xml);
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
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
		if(at(i)->hasReplyListener(listener) == true)
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
	xml->setProperty("ip", ip);
	xml->setProperty("port", port);

	return xml;
}