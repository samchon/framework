#include <samchon/protocol/slave/ParallelSystem.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

ParallelSystem::ParallelSystem()
{
}
ParallelSystem::~ParallelSystem()
{
}

void ParallelSystem::replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid"))
	{
		// INIT HISTORY - WITH START TIME
		InvokeHistory history(invoke);
		size_t index = invoke->get("piece_index")->getValue<size_t>();
		size_t size = invoke->get("piece_size")->getValue<size_t>();

		// ERASE UNNECCESARY PARAMETERS
		invoke->erase("invoke_history_uid");
		invoke->erase("piece_index");
		invoke->erase("piece_size");

		// MAIN PROCESS - REPLY_DATA
		this->replyPieceData(invoke, index, size);

		// NOTIFY - WITH END TIME
		history.notifyEnd();
		this->sendData(history.toInvoke());
	}
	else
		external::ExternalSystem::replyData(invoke);
}