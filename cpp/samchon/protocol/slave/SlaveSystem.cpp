#include <samchon/protocol/slave/SlaveSystem.hpp>

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

void SlaveSystem::replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid"))
	{
		// INIT HISTORY - WITH START TIME
		InvokeHistory history(invoke);
		invoke->erase("invoke_history_uid");

		// MAIN PROCESS - REPLY_DATA
		super::replyData(invoke);

		// NOTIFY - WITH END TIME
		history.notifyEnd();
		sendData(history.toInvoke());
	}
	else
		super::replyData(invoke);
}