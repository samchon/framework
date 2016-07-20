#include <samchon/protocol/master/MediatorSystem.hpp>

#include <samchon/protocol/external/ExternalClientArray.hpp>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorSystem::MediatorSystem(ExternalClientArray *systemArray)
{
	this->system_array = systemArray;
}
MediatorSystem::~MediatorSystem()
{
}

void MediatorSystem::replyData(shared_ptr<Invoke> invoke)
{
	system_array->replyData(invoke);
}

void MediatorSystem::notify_end(size_t uid)
{
	if (progress_list.has(uid) == false)
		return;

	shared_ptr<InvokeHistory> history = progress_list.get(uid);
	progress_list.erase(history->getUID());

	this->sendData(history->toInvoke());
}