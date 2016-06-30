#include <samchon/protocol/ExternalSystemRole.hpp>

#include <samchon/protocol/ExternalSystem.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalSystemRole::ExternalSystemRole(ExternalSystem *system)
{
	this->system = system;
}
ExternalSystemRole::~ExternalSystemRole()
{
}

void ExternalSystemRole::construct(shared_ptr<XML> xml)
{
	name = xml->getProperty("name");
}

/* ---------------------------------------------------------
	MESSAGE I/O
--------------------------------------------------------- */
void ExternalSystemRole::sendData(shared_ptr<Invoke> invoke)
{
	system->sendData(invoke);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto ExternalSystemRole::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);

	return xml;
}