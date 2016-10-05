#include <samchon/templates/parallel/MediatorSystem.hpp>

#include <samchon/templates/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/templates/distributed/DistributedSystemArrayMediator.hpp>
#include <samchon/templates/distributed/DistributedProcess.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::parallel;
using namespace samchon::templates::distributed;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
MediatorSystem::MediatorSystem(ParallelSystemArrayMediator *systemArray)
	: super()
{
	this->system_array_ = systemArray;
}
MediatorSystem::~MediatorSystem()
{
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void MediatorSystem::_Complete_history(size_t uid)
{
	//--------
	// NEED TO REDEFINE START AND END TIME
	//--------
	// NO SUCH HISTORY; THE PROCESS HAD DONE ONLY IN THIS MEDIATOR LEVEL.
	if (progress_list_.has(uid) == false)
		return;

	// COMPLETE THE HISTORY
	shared_ptr<InvokeHistory> history = progress_list_.get(uid);
	history->complete();

	// ERASE THE HISTORY ON PROGRESS LIST
	progress_list_.erase(uid);

	// REPORT THE HISTORY TO MASTER
	sendData(history->toInvoke());
}

void MediatorSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("_History_uid") == true)
	{
		// REGISTER THIS PROCESS ON HISTORY LIST
		shared_ptr<InvokeHistory> history(new InvokeHistory(invoke));
		progress_list_.insert({ history->getUID(), history });

		if (invoke->has("_Piece_first") == true)
		{
			// PARALLEL PROCESS
			size_t first = invoke->get("_Piece_first")->getValue<size_t>();
			size_t last = invoke->get("_Piece_last")->getValue<size_t>();

			invoke->erase(invoke->end() - 2, invoke->end());
			system_array_->sendPieceData(invoke, first, last);
		}
		else if (dynamic_cast<DistributedSystemArrayMediator*>(system_array_) != nullptr
			&& invoke->has("_Process_name") == true)
		{
			// DISTRIBUTED PROCESS
			auto ds_system_array = dynamic_cast<DistributedSystemArrayMediator*>(system_array_);

			// FIND THE MATCHED ROLE
			const string &process_name = invoke->get("_Process_name")->getValue<string>();
			if (ds_system_array->hasProcess(process_name) == false)
				return;

			// SEND DATA VIA THE ROLE
			auto process = ds_system_array->getProcess(process_name);
			process->sendData(invoke);
		}
	}
	else
		replyData(invoke);
}

void MediatorSystem::replyData(shared_ptr<Invoke> invoke)
{
	system_array_->sendData(invoke);
}