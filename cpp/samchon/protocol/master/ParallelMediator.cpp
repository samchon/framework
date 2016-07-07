#include <samchon/protocol/master/ParallelMediator.hpp>

#include <samchon/protocol/master/ParallelSystemArrayMediator.hpp>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

ParallelMediator::ParallelMediator(ParallelSystemArrayMediator *systemArray)
{
	this->systemArray = systemArray;
}
ParallelMediator::~ParallelMediator()
{
}

void ParallelMediator::replyData(shared_ptr<Invoke> invoke)
{
	if (invoke->has("invoke_history_uid") == true)
	{
		// REGISTER HISTORY ON PROGRESS
		shared_ptr<InvokeHistory> history(new InvokeHistory(invoke));
		//progress_list.insert({history.getUID(), history});

		// DISTRIBUTE PIECES TO MEDIATOR'S SLAVES
		size_t index = invoke->get("piece_index")->getValue<size_t>();
		size_t size = invoke->get("piece_size")->getValue<size_t>();

		systemArray->sendPieceData(invoke, index, size);
	}
	else
		systemArray->sendData(invoke);
}

void ParallelMediator::notify_end(size_t uid)
{
	shared_ptr<InvokeHistory> &history = progress_list.get(uid);
	this->sendData(history->toInvoke());

	progress_list.erase(history->getUID());
}