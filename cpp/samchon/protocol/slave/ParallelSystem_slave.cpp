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
auto ParallelSystem::create_child(shared_ptr<XML>) -> ExternalSystemRole*
{
	return nullptr;
}

void ParallelSystem::_replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid") == true)
	{
		thread
		(
			[this, invoke]
			{
				InvokeHistory history(invoke);

				size_t index = invoke->get("invoke_history_index")->get_value<size_t>();
				size_t size = invoke->get("invoke_history_size")->get_value<size_t>();

				replyPieceData(invoke, index, size);

				history.notifyEnd();
				this->sendData(history.toInvoke());
			}
		).detach();
	}
	else
		replyData(invoke);
}
