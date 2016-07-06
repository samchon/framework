#include <samchon/protocol/master/ParallelSystem.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>
#include <samchon/protocol/master/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ParallelSystem::ParallelSystem(ParallelSystemArray *systemArray)
	: super()
{
	this->systemArray = systemArray;
}
ParallelSystem::~ParallelSystem()
{
}

void ParallelSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	performance = xml->getProperty<double>("performance");
}

/* ---------------------------------------------------------
	MESSAGE CHAIN
--------------------------------------------------------- */
void ParallelSystem::send_piece_data(shared_ptr<Invoke> invoke, size_t index, size_t size)
{
	// DUPLICATE INVOKE AND ATTACH PIECE INFO
	shared_ptr<Invoke> my_invoke(new Invoke(*invoke));
	{
		my_invoke->emplace_back(new InvokeParameter("index", index));
		my_invoke->emplace_back(new InvokeParameter("size", size));
	}

	// REGISTER THE UID AS PROGRESS
	PRInvokeHistory history(my_invoke);
	progress_list.insert({ history.uid, history });

	// SEND DATA
	this->sendData(my_invoke);
}

void ParallelSystem::replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->getListener() == "report_invoke_history")
		report_invoke_history(invoke->front()->getValueAsXML());
	else
		super::replyData(invoke);
}

void ParallelSystem::report_invoke_history(shared_ptr<XML> xml)
{
	///////
	// CONSTRUCT HISTORY
	///////
	PRInvokeHistory history;
	history.construct(xml);

	auto progress_it = progress_list.find(history.uid);
	history.index = progress_it->second.index;
	history.size = progress_it->second.size;

	// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
	progress_list.erase(progress_it);
	history_list.insert({ history.uid, history });

	// NOTIFY TO THE MANAGER, SYSTEM_ARRAY
	systemArray->notify_end(history);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto ParallelSystem::toXML() const -> shared_ptr<XML>
{
	auto &xml = super::toXML();
	xml->setProperty("performance", performance);

	return xml;
}