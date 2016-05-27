#include <samchon/protocol/master/ParallelSystem.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>
#include <samchon/protocol/master/PRInvokeHistoryArray.hpp>
#include <samchon/protocol/master/PRInvokeHistory.hpp>

#include <samchon/library/XML.hpp>
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
	progressArray = new PRInvokeHistoryArray();

	this->performance = 1.0;
}
ParallelSystem::~ParallelSystem()
{
	delete historyArray;
	delete progressArray;
}

void ParallelSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if (xml->has_property("performance"))
		this->performance = xml->get_property<double>("performance");

	if (xml->has(historyArray->TAG()) == true)
		historyArray->construct(xml->get(historyArray->TAG())->at(0));
}
auto ParallelSystem::create_child(shared_ptr<XML> xml) -> ExternalSystemRole*
{
	return nullptr;
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ParallelSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->get_listener() == "reportInvokeHistory")
	{
		InvokeHistory invokeHistory;
		invokeHistory.construct(invoke->at(0)->get_value_as_xml());

		string uid = to_string(invokeHistory.getUID());
		if (progressArray->has(uid) == false)
			return;

		//ERASE FROM PROGRESS AND REGISTER TO HISTORY
		shared_ptr<PRInvokeHistory> history = progressArray->get(uid);
		progressArray->erase(uid);
		historyArray->push_back(history);

		//NOTIFY END
		history->construct(invoke->at(0)->get_value_as_xml());
		history->notifyEnd();
	}
	else
		replyData(invoke);
}
void ParallelSystem::sendPieceData
	(
		PRMasterHistory *masterHistory, 
		shared_ptr<Invoke> invoke, size_t index, size_t size
	)
{
	shared_ptr<Invoke> myInvoke(new Invoke(*invoke));
	myInvoke->emplace_back(new InvokeParameter("invoke_history_index", index));
	myInvoke->emplace_back(new InvokeParameter("invoke_history_size", size));

	try
	{
		sendData(myInvoke);
	}
	catch (exception &e)
	{
		throw e;
	}

	//error on set/map iterator ???
	//progressArray->emplace_back(new PRInvokeHistory(masterHistory, this, myInvoke));
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ParallelSystem::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("performance", performance);

	return xml;
}