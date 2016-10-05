#include <samchon/templates/parallel/ParallelSystem.hpp>

#include <samchon/templates/parallel/ParallelSystemArray.hpp>
#include <samchon/templates/parallel/PRInvokeHistory.hpp>

#include <thread>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
// using super::super;

ParallelSystem::~ParallelSystem()
{
	excluded_ = true;

	// SHIFT PARALLEL INVOKE MESSAGES HAD PROGRESSED TO OTHER SLAVES
	for (auto it = progress_list_.begin(); it != progress_list_.end(); it++)
	{
		// INVOKE MESSAGE AND ITS HISTORY ON PROGRESS
		shared_ptr<Invoke> invoke = it->second.first;
		shared_ptr<InvokeHistory> history = it->second.second;

		// SEND THEM BACK
		_Send_back_history(invoke, history);
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

void ParallelSystem::setPerformance(double val)
{
	performance_ = val;
	enforced_ = false;
}

void ParallelSystem::enforcePerformance(double val)
{
	performance_ = val;
	enforced_ = true;
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
		my_invoke->emplace_back(new InvokeParameter("_Piece_first", first));
		my_invoke->emplace_back(new InvokeParameter("_Piece_last", last));
	}

	// REGISTER THE UID AS PROGRESS
	shared_ptr<protocol::InvokeHistory> history(new PRInvokeHistory(my_invoke));
	progress_list_.emplace(history->getUID(), make_pair(my_invoke, history));

	// SEND DATA
	sendData(my_invoke);
}

void ParallelSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->getListener() == "_Report_history")
		_Report_history(invoke->front()->getValueAsXML());
	else if (invoke->getListener() == "_Send_back_history")
	{
		size_t uid = invoke->front()->getValue<size_t>();
		auto it = progress_list_.find(uid);

		if (it != progress_list_.end())
			_Send_back_history(it->second.first, it->second.second);
	}
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
	history->first_ = dynamic_pointer_cast<PRInvokeHistory>(progress_it->second.second)->getFirst();
	history->last_ = dynamic_pointer_cast<PRInvokeHistory>(progress_it->second.second)->getLast();

	// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
	progress_list_.erase(progress_it);
	history_list_.insert({history->getUID(), history});

	// NOTIFY TO THE MANAGER, SYSTEM_ARRAY
	getSystemArray()->_Complete_history(history);
}

void ParallelSystem::_Send_back_history(shared_ptr<Invoke> invoke, shared_ptr<InvokeHistory> $history)
{
	shared_ptr<PRInvokeHistory> history = dynamic_pointer_cast<PRInvokeHistory>($history);
	if (history == nullptr)
		return;

	// REMOVE UID AND FIRST, LAST INDEXES
	for (size_t i = invoke->size(); i < invoke->size(); i--)
	{
		const string &name = invoke->at(i)->getName();

		if (name == "_History_uid" || name == "_Piece_first" || name == "_Piece_last")
			invoke->erase(invoke->begin() + i);
	}

	// RE-SEND (DISTRIBUTE) THE PIECE TO OTHER SLAVES
	thread(&ParallelSystemArray::sendPieceData, getSystemArray(),
		invoke, history->getFirst(), history->getLast()).detach();

	// ERASE FROM THE PROGRESS LIST
	progress_list_.erase(history->getUID());
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