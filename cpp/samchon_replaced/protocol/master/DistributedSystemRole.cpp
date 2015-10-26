#include <samchon/protocol/master/DistributedSystemRole.hpp>
#	include <samchon/protocol/master/DistributedSystem.hpp>

#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

DistributedSystemRole::DistributedSystemRole(DistributedSystem *system)
	: super(system)
{
	this->externalSystem = system;
}
void DistributedSystemRole::construct(shared_ptr<XML> xml)
{
	performance = xml->getProperty<double>(_T("performance"));
}

void DistributedSystemRole::setSystem(DistributedSystem *system)
{
	this->externalSystem = system;
}
auto DistributedSystemRole::getPerformance() const -> double
{
	return performance;
}

auto DistributedSystemRole::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("performance"), performance);

	return xml;
}