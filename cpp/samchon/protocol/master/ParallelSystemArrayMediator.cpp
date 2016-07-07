#include <samchon/protocol/master/ParallelSystemArrayMediator.hpp>

#include <samchon/protocol/master/ParallelMediator.hpp>
#include <samchon/protocol/master/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ParallelSystemArrayMediator::ParallelSystemArrayMediator()
	: super()
{
}
ParallelSystemArrayMediator::~ParallelSystemArrayMediator()
{
}

/* ---------------------------------------------------------
	NETWORK INITIALIZATION
--------------------------------------------------------- */
void ParallelSystemArrayMediator::open(int port)
{
	start_mediator();
	super::open(port);
}

void ParallelSystemArrayMediator::connect()
{
	start_mediator();
	super::connect();
}

void ParallelSystemArrayMediator::start_mediator()
{
	if (mediator == nullptr)
		return;

	mediator.reset(this->createMediator());
	mediator->start();
}

auto ParallelSystemArrayMediator::notify_end(shared_ptr<PRInvokeHistory> history) -> bool
{
	if (super::notify_end(history) == false)
		return false;

	mediator->notify_end(history->getUID());
	return true;
}