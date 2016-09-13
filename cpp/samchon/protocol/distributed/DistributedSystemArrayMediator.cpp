#include <samchon/protocol/distributed/DistributedSystemArrayMediator.hpp>

#include <samchon/protocol/InvokeHistory.hpp>
#include <samchon/protocol/parallel/MediatorSystem.hpp>

using namespace std;
using namespace samchon::protocol;
using namespace samchon::protocol::distributed;
using namespace samchon::protocol::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
DistributedSystemArrayMediator::DistributedSystemArrayMediator()
	: DistributedSystemArray(),
	ParallelSystemArrayMediator()
{
}

DistributedSystemArrayMediator::~DistributedSystemArrayMediator()
{
}

/* ---------------------------------------------------------
	HISTORY HANDLER
--------------------------------------------------------- */
auto DistributedSystemArrayMediator::_Complete_history(shared_ptr<InvokeHistory> history) -> bool
{
	bool ret = DistributedSystemArray::_Complete_history(history);
	if (ret == true)
		getMediator()->_Complete_history(history->getUID());

	return ret;
}