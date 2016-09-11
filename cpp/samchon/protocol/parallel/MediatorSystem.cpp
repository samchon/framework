#include <samchon/protocol/parallel/MediatorSystem.hpp>

#include <samchon/protocol/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::parallel;

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
void MediatorSystem::complete_history(size_t uid)
{
	if (progress_list_.has(uid) == false)
		return; // NO SUCH HISTORY; THE PROCESS HAD DONE ONLY IN THIS MEDIATOR LEVEL.

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
		//else if (this.mediator_ instanceof distributed.DistributedSystemArrayMediator
		//	&& invoke->has("_Role_name") == true)
		//{
		//	// DISTRIBUTED PROCESS
		//	let ds_mediator : distributed.DistributedSystemArrayMediator
		//		= this.mediator_ as distributed.DistributedSystemArrayMediator;

		//	// FIND THE MATCHED ROLE
		//	let role_name : string = invoke.get("_Role_name").getValue();
		//	if (ds_mediator.hasRole(role_name) == false)
		//		return;

		//	// SEND DATA VIA THE ROLE
		//	let role : distributed.DistributedSystemRole = ds_mediator.getRole(role_name);
		//	role.sendData(invoke);
		//}
	}
	else
		replyData(invoke);
}

void MediatorSystem::replyData(shared_ptr<Invoke> invoke)
{
	system_array_->sendData(invoke);
}