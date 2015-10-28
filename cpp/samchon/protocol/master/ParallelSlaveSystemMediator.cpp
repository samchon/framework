#include <samchon/protocol/master/ParallelSlaveSystemMediator.hpp>

#include <samchon/protocol/master/ParallelSystemArrayMediator.hpp>

#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

ParallelSlaveSystemMediator::ParallelSlaveSystemMediator()
	: super()
{
	master = nullptr;
}
void ParallelSlaveSystemMediator::replyPieceData(shared_ptr<Invoke> invoke, size_t index, size_t size)
{
	if (master == nullptr)
		return;

	master->sendPieceData(invoke, index, size);
}

auto ParallelSlaveSystemMediator::TAG() const -> string
{
	return "slave";
}