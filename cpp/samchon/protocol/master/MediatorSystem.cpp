#include <samchon/protocol/master/MediatorSystem.hpp>

#include <samchon/protocol/external/ExternalSystemArray.hpp>
#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorSystem::MediatorSystem(ExternalSystemArray *systemArray)
{
	this->system_array = systemArray;
}
MediatorSystem::~MediatorSystem()
{
}

void MediatorSystem::notifyEnd(size_t uid)
{
	if (progress_list.has(uid) == false)
		return;

	shared_ptr<InvokeHistory> &history = progress_list.get(uid);
	this->sendData(history->toInvoke());

	progress_list.erase(history->getUID());
}