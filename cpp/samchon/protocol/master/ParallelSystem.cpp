#include <samchon/protocol/master/ParallelSystem.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>
#include <samchon/protocol/master/PRInvokeHistoryArray.hpp>

#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ParallelSystem::ParallelSystem()
	: super()
{
	systemArray = nullptr;
	historyArray = new PRInvokeHistoryArray();

	this->performance = 1.0;
}
ParallelSystem::~ParallelSystem()
{
	delete historyArray;
}

void ParallelSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if (xml->hasProperty("performance"))
		this->performance = xml->getProperty<double>("performance");

	if (xml->has(historyArray->TAG()) == true)
		historyArray->construct(xml->get(historyArray->TAG())->at(0));
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ParallelSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->getListener() == "reportInvokeHistory")
	{
		PRInvokeHistory *history = new PRInvokeHistory();
		history->construct(invoke->at(0)->getvalueAsXML());

		historyArray->emplace_back(history);
		
		size_t uid = history->getUID();
		if (systemArray != nullptr)
			systemArray->notifyEnd(uid);
	}
	else
		replyData(invoke);
}
void ParallelSystem::sendSegmentData(shared_ptr<Invoke> invoke, size_t index, size_t size)
{
	invoke->emplace_back(new InvokeParameter("invoke_history_index", index));
	invoke->emplace_back(new InvokeParameter("invoke_history_size", size));

	sendData(invoke);
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ParallelSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("performance", performance);

	return xml;
}