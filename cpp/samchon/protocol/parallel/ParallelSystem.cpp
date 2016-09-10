#include <samchon/protocol/parallel/ParallelSystem.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>
#include <samchon/protocol/parallel/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
// using super::super;

ParallelSystem::~ParallelSystem()
{
	// SHIFT PARALLEL INVOKE MESSAGES HAD PROGRESSED TO OTHER SLAVES
	for (auto it = progress_list_.begin(); it != progress_list_.end(); it++)
	{
		// A HISTORY HAD PROGRESSED
		shared_ptr<PRInvokeHistory> history = dynamic_pointer_cast<PRInvokeHistory>(it->second.second);
		if (history == nullptr)
			continue;

		// INVOKE MESSAGE TO RESEND TO OTHER SLAVES
		shared_ptr<Invoke> invoke = it->second.first;
		size_t first = history->getFirst();
		size_t last = history->getLast();

		// SEND-PIECE-DATA
		getSystemArray()->sendPieceData(invoke, first, last);
	}
}

void ParallelSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	performance_ = xml->getProperty<double>("performance");
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
auto ParallelSystem::getSystemArray() const -> ParallelSystemArray*
{
	return dynamic_cast<ParallelSystemArray*>(super::getSystemArray());
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void ParallelSystem::send_piece_data(shared_ptr<Invoke> invoke, size_t first, size_t last)
{
	shared_ptr<Invoke> my_invoke(new Invoke(invoke->getListener()));
	{
		// DUPLICATE INVOKE AND ATTACH PIECE INFO
		my_invoke->assign(invoke->begin(), invoke->end());
		my_invoke->emplace_back(new InvokeParameter("piece_first", first));
		my_invoke->emplace_back(new InvokeParameter("piece_last", last));
	}

	// REGISTER THE UID AS PROGRESS
	shared_ptr<protocol::InvokeHistory> history(new PRInvokeHistory(my_invoke));
	progress_list_.insert({ history->getUID(), {my_invoke, history} });

	// SEND DATA
	sendData(my_invoke);
}

void ParallelSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->getListener() == "_Report_history")
		_Report_history(invoke->front()->getValueAsXML());
	else
		replyData(invoke);
}

void ParallelSystem::_Report_history(shared_ptr<XML> xml)
{
	//--------
	// CONSTRUCT HISTORY
	//--------
	shared_ptr<PRInvokeHistory> history(new PRInvokeHistory());
	history->construct(xml);

	// IF THE HISTORY IS NOT EXIST IN PROGRESS, THEN TERMINATE REPORTING
	auto progress_it = progress_list_.find(history->getUID());
	if (progress_it == progress_list_.end())
		return;
	
	// ARCHIVE FIRST AND LAST INDEX
	history->setFirst(dynamic_pointer_cast<PRInvokeHistory>(progress_it->second.second)->getFirst());
	history->setLast(dynamic_pointer_cast<PRInvokeHistory>(progress_it->second.second)->getLast());

	// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
	progress_list_.erase(progress_it);
	history_list_.insert({history->getUID(), history});

	// NOTIFY TO THE MANAGER, SYSTEM_ARRAY
	getSystemArray()->_Notify_end(history);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto ParallelSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("performance", performance_);

	return xml;
}