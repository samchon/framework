#include <samchon/protocol/service/ServiceRole.hpp>

#include <samchon/protocol/service/Service.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

ServiceRole::ServiceRole(Service *service, const string &name)
	: super()
{
	this->service = service;
	this->name = name;
}
void ServiceRole::sendData(shared_ptr<Invoke> invoke)
{
	service->sendData(invoke);
}