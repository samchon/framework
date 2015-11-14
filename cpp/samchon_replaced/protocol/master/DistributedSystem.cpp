#include <samchon/protocol/master/DistributedSystem.hpp>
#	include <samchon/protocol/master/DistributedSystemArray.hpp>
#	include <samchon/protocol/master/DistributedSystemRole.hpp>

#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

DistributedSystem::DistributedSystem(DistributedSystemArray *systemArray)
	: super(systemArray)
{
	this->systemArray = systemArray;
}
void DistributedSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	performance = xml->getProperty<double>(_T("performance"));
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(DistributedSystem, DistributedSystemRole)

auto DistributedSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("performance"), performance);

	return xml;
}