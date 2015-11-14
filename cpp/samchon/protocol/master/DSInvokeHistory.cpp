#include <samchon/protocol/master/DSInvokeHistory.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

DSInvokeHistory::DSInvokeHistory(DistributedSystem *system, DistributedSystemRole *role, std::shared_ptr<Invoke> invoke)
	: super(invoke)
{
	this->system = system;
	this->role = role;
}

auto DSInvokeHistory::getSystem() const -> DistributedSystem*
{
	return system;
}
auto DSInvokeHistory::getRole() const -> DistributedSystemRole*
{
	return role;
}