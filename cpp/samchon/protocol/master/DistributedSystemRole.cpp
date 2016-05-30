#include <samchon/protocol/master/DistributedSystemRole.hpp>

#include <samchon/protocol/master/DistributedSystemArray.hpp>
#include <samchon/protocol/master/DistributedSystem.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>
#include <samchon/protocol/master/DSInvokeHistoryArray.hpp>
#include <samchon/protocol/master/DSInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
DistributedSystemRole::DistributedSystemRole()
	: super(nullptr)
{
	invokeHistoryArray = new DSInvokeHistoryArray();
}
DistributedSystemRole::~DistributedSystemRole()
{
	delete invokeHistoryArray;
}

void DistributedSystemRole::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	performance = xml->getProperty<double>("performance");
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
auto DistributedSystemRole::getAllocationHistoryList() const -> DSRoleHistoryList*
{
	return allocationHistoryList;
}
auto DistributedSystemRole::getInvokeHistoryArray() const -> DSInvokeHistoryArray*
{
	return invokeHistoryArray;
}

auto DistributedSystemRole::getPerformance() const -> double
{
	return performance;
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void DistributedSystemRole::sendData(shared_ptr<Invoke> invoke)
{
	// NOT DEFINED YET
	// WILL SHIFT THE SENDING RESPONSIBILITY TO IDLE SYSTEM
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto DistributedSystemRole::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("performance", performance);

	if (invokeHistoryArray->empty() == false)
		xml->push_back(invokeHistoryArray->toXML());

	return xml;
}