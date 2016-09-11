#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/distributed/DSInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::distributed;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
DistributedSystemArray::DistributedSystemArray()
	: super()
{
}

DistributedSystemArray::~DistributedSystemArray()
{
}

void DistributedSystemArray::construct(shared_ptr<XML> xml)
{
	//--------
	// CONSTRUCT ROLES
	//--------
	// CLEAR ORDINARY ROLES
	role_map_.clear();

	// CREATE ROLES
	if (xml->has("roles") == true && xml->get("roles")->front()->has("role") == true)
	{
		shared_ptr<XMLList> &role_xml_list = xml->get("roles")->front()->get("role");
		for (size_t i = 0; i < role_xml_list->size(); i++)
		{
			shared_ptr<XML> &role_xml = role_xml_list->at(i);

			// CONSTRUCT ROLE FROM XML
			std::shared_ptr<DistributedSystemRole> role(createRole(role_xml));
			role->construct(role_xml);

			// AND INSERT TO ROLE_MAP
			insertRole(role);
		}
	}

	//--------
	// CONSTRUCT SYSTEMS
	//--------
	super::construct(xml);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto DistributedSystemArray::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (role_map_.empty() == true)
		return xml;

	shared_ptr<XML> roles_xml(new XML());
	{
		roles_xml->setTag("roles");
		for (auto it = role_map_.begin(); it != role_map_.end(); it++)
			roles_xml->push_back(it->second->toXML());
	}
	xml->push_back(roles_xml);
	return xml;
}