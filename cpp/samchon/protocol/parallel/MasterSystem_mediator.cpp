#include <samchon/protocol/parallel/MasterSystem.hpp>

#include <samchon/protocol/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
MasterSystem::MasterSystem(ParallelSystemArrayMediator *mediator)
	: super()
{
	this->mediator_ = mediator;
}
MasterSystem::~MasterSystem()
{
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void MasterSystem::notify_end(size_t uid)
{

}

void MasterSystem::_replyData(shared_ptr<Invoke> invoke)
{

}

void MasterSystem::replyData(shared_ptr<Invoke> invoke)
{
	mediator_->sendData(invoke);
}