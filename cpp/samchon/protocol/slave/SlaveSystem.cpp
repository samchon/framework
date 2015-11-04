#include <samchon/protocol/slave/SlaveSystem.hpp>

#include <samchon/protocol/Invoke.hpp>
#include <samchon/protocol/InvokeHistory.hpp>
#include <thread>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

SlaveSystem::SlaveSystem()
	: super()
{
}
void SlaveSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid") == true)
	{
		thread
		(
			[this, invoke]
			{
				InvokeHistory history(invoke);

				replyData(invoke);

				history.notifyEnd();
				sendData(history.toInvoke());
			}
		).detach();
	}
	else
		replyData(invoke);
}