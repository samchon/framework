#include <samchon/protocol/master/DistributedSystem.hpp>

#include <samchon/protocol/master/DistributedSystemArray.hpp>
#include <samchon/protocol/master/DistributedSystemRole.hpp>

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
DistributedSystem::DistributedSystem()
	: super()
{
	invokeHistoryArray = new DSInvokeHistoryArray();
}
DistributedSystem::~DistributedSystem()
{
	delete invokeHistoryArray;
}

void DistributedSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	performance = xml->getProperty<double>("performance");
}

auto DistributedSystem::create_child(shared_ptr<XML>) -> ExternalSystemRole*
{
	// DON'T MAKE CHILDREN IN SYSTEM. 
	// IT'S THE REPONSIBILITY OF DISTRIBUTED_SYSTEM_ARRAY
	return nullptr;
}

// GETTER
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(DistributedSystem, DistributedSystemRole)

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void DistributedSystem::sendData(shared_ptr<Invoke> invoke)
{
	const string &listener = invoke->get_listener();

	for (size_t i = 0; i < size(); i++)
	{
		if (at(i)->hasSendListener(listener) == true)
		{
			shared_ptr<DSInvokeHistory> history(new DSInvokeHistory(this, at(i).get(), invoke));
			invokeHistoryArray->push_back(history);
			at(i)->invokeHistoryArray->push_back(history);

			break;
		}
	}

	super::sendData(invoke);
}
void DistributedSystem::replyData(shared_ptr<Invoke> invoke)
{

}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto DistributedSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("performance", performance);

	if (invokeHistoryArray->empty() == false)
		xml->push_back(invokeHistoryArray->toXML());

	return xml;
}