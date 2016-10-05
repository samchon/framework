#include <samchon/templates/distributed/DistributedSystemArrayMediator.hpp>

#include <samchon/protocol/InvokeHistory.hpp>
#include <samchon/templates/parallel/MediatorSystem.hpp>

using namespace std;
using namespace samchon::protocol;
using namespace samchon::templates::distributed;
using namespace samchon::templates::parallel;

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