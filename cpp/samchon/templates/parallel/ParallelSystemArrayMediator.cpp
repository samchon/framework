#include <samchon/templates/parallel/ParallelSystemArrayMediator.hpp>

#include <samchon/templates/parallel/MediatorSystem.hpp>
#include <samchon/templates/parallel/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ParallelSystemArrayMediator::ParallelSystemArrayMediator()
{
}

ParallelSystemArrayMediator::~ParallelSystemArrayMediator()
{
}

void ParallelSystemArrayMediator::startMediator()
{
	if (mediator_ != nullptr)
		return;

	mediator_.reset(createMediator());
	mediator_->start();
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
auto ParallelSystemArrayMediator::_Complete_history(shared_ptr<InvokeHistory> history) -> bool
{
	bool ret = super::_Complete_history(history);
	if (ret == true)
		mediator_->_Complete_history(history->getUID());

	return ret;
}