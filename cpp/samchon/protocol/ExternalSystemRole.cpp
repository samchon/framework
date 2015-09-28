#include <samchon/protocol/ExternalSystemRole.hpp>
#include <samchon/protocol/ExternalSystem.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

ExternalSystemRole::ExternalSystemRole(ExternalSystem *system)
	: super()
{
	this->system = system;
}
void ExternalSystemRole::sendData(shared_ptr<Invoke> invoke)
{
	system->sendData(invoke);
}