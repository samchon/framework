#include <samchon/protocol/distributed/DistributedSystem.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/distributed/DSInvokeHistory.hpp>

#include <samchon/protocol/distributed/DistributedSystemArrayMediator.hpp>
#include <samchon/protocol/parallel/MediatorSystem.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::distributed;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
DistributedSystem::~DistributedSystem()
{
	for (auto it = progress_list_.begin(); it != progress_list_.end(); it++)
	{
		// SHIFT INVOKE MESSAGES HAD PROGRESSED TO OTHER SLAVE
		shared_ptr<DSInvokeHistory> history = dynamic_pointer_cast<DSInvokeHistory>(it->second.second);
		if (history == nullptr)
			continue;

		// INVOKE MESSAGE TO RESEND TO ANOTHER SLAVE VIA ROLE
		shared_ptr<Invoke> invoke = it->second.first;
		DistributedSystemRole *role = history->getRole();

		// SEND-DATA VIA THE ROLE
		role->sendData(invoke);
	}
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
auto DistributedSystem::getSystemArray() const -> DistributedSystemArray*
{
	return dynamic_cast<DistributedSystemArray*>(super::getSystemArray());
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void DistributedSystem::_Report_history(shared_ptr<XML> xml)
{
	if (xml->hasProperty("_Piece_first") == true)
	{
		//--------
		// ParallelSystem's history -> PRInvokeHistory
		//--------
		super::_Report_history(xml);
	}
	else
	{
		//--------
		// DistributedSystemRole's history -> DSInvokeHistory
		//--------
		// CONSTRUCT HISTORY
		shared_ptr<DSInvokeHistory> history(new DSInvokeHistory(this));
		history->construct(xml);

		// IF THE HISTORY IS NOT EXIST IN PROGRESS, THEN TERMINATE REPORTING
		auto progress_it = progress_list_.find(history->getUID());
		if (progress_it == progress_list_.end())
			return;

		// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
		progress_list_.erase(progress_it);
		history_list_.emplace(history->getUID(), history);

		// ALSO NOTIFY TO THE ROLE
		if (history->getRole() != nullptr)
			history->getRole()->report_history(history);

		// IF SYSTEM_ARRAY IS A TYPE OF DistributedSystemArrayMediator, 
		// THEN ALSO NOTIFY TO ITS MASTER
		DistributedSystemArrayMediator* system_array_mediator = dynamic_cast<DistributedSystemArrayMediator*>(getSystemArray());
		if (system_array_mediator != nullptr)
		{
			parallel::MediatorSystem *mediator = system_array_mediator->getMediator();
			mediator->complete_history(history->getUID()); // NOTIFY END TO MASTER
		}
	}
}