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
	this->name = xml->get_property("name");

	this->ip = xml->get_property("ip");
	this->port = xml->get_property<int>("port");

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
	string &listener = invoke->get_listener();

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

auto ExternalSystem::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("name", name);
	xml->set_property("ip", ip);
	xml->set_property("port", port);

	return xml;
}