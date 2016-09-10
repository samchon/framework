#include <samchon/protocol/slave/MasterSystem.hpp>

#include <thread>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

MasterSystem::MasterSystem()
{
}
MasterSystem::~MasterSystem()
{
}

void MasterSystem::sendData(shared_ptr<Invoke> invoke)
{
	communicator_->sendData(invoke);
}

void MasterSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid"))
	{
		thread([this, invoke]()
		{
			// INIT HISTORY - WITH START TIME
			unique_ptr<InvokeHistory> history(new InvokeHistory(invoke));
			invoke->erase("invoke_history_uid");

			// MAIN PROCESS - REPLY_DATA
			replyData(invoke);

			// NOTIFY - WITH END TIME
			history->notifyEnd();
			sendData(history->toInvoke());
		}).detach();
	}
	else
		replyData(invoke);
}