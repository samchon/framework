#include <samchon/protocol/master/MediatorSocket.hpp>
#	include <samchon/protocol/master/ExternalSystemArrayMediator.hpp>

#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

MediatorSocket::MediatorSocket(ExternalSystemArrayMediator *mediator)
	: super()
{
	this->mediator = mediator;
}
void MediatorSocket::replyData(shared_ptr<Invoke> invoke)
{
	mediator->replyDataFromMaster(invoke);
}