#include <samchon/protocol/slave/SlaveSystem.hpp>

#include <thread>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

SlaveSystem::SlaveSystem()
{
}
SlaveSystem::~SlaveSystem()
{
}

void SlaveSystem::sendData(shared_ptr<Invoke> invoke)
{
	communicator_->sendData(invoke);
}

void SlaveSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("_History_uid"))
	{
		thread([this, invoke]()
		{
			// INIT HISTORY - WITH START TIME
			unique_ptr<InvokeHistory> history(new InvokeHistory(invoke));
			invoke->erase("_History_uid");

			// MAIN PROCESS - REPLY_DATA
			replyData(invoke);

			// NOTIFY - WITH END TIME
			history->complete();
			sendData(history->toInvoke());
		}).detach();
	}
	else
		replyData(invoke);
}