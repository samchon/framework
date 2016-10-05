#include <samchon/templates/external/ExternalSystemRole.hpp>

#include <samchon/templates/external/ExternalSystem.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::external;

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
	ACCESSORS
--------------------------------------------------------- */
auto ExternalSystemRole::getSystemArray() const -> ExternalSystemArray*
{
	return system->getSystemArray();
};

/* ---------------------------------------------------------
	MESSAGE CHAIN
--------------------------------------------------------- */
void ExternalSystemRole::sendData(std::shared_ptr<Invoke> invoke)
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