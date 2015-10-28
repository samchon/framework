#include <samchon/protocol/slave/ParallelSystem.hpp>

#include <samchon/protocol/Invoke.hpp>
#include <samchon/protocol/InvokeHistory.hpp>
#include <thread>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

ParallelSystem::ParallelSystem()
	: super()
{
}
void ParallelSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid") == true)
	{
		thread(
			[this, invoke]
			{
				InvokeHistory history(invoke);

				size_t index = invoke->get("invoke_history_index")->getValue<size_t>();
				size_t size = invoke->get("invoke_history_size")->getValue<size_t>();

				replyData(invoke, index, size);

				history.notifyEnd();
				this->sendData(history.toInvoke());
			}
		).detach();
	}
	else
		replyData(invoke);
}
