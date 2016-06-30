#include <samchon/protocol/service/Service.hpp>

#include <samchon/protocol/service/User.hpp>
#include <samchon/protocol/service/Client.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

Service::Service()
{
}
Service::~Service()
{
}

void Service::sendData(shared_ptr<Invoke> invoke)
{
	client->sendData(invoke);
}

auto Service::__keep_alive() const -> pair<shared_ptr<User>, shared_ptr<Client>>
{
	return client->__keep_alive();
}