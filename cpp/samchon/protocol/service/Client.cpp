#include <samchon/protocol/service/Client.hpp>

#include <samchon/protocol/service/Server.hpp>
#include <samchon/protocol/service/User.hpp>
#include <samchon/protocol/service/Service.hpp>

#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

Client::Client()
{
}
Client::~Client()
{
}

auto Client::__keep_alive() const -> pair<shared_ptr<User>, shared_ptr<Client>>
{
	return {user->my_weak_ptr.lock(), my_weak_ptr.lock()};
}

void Client::sendData(shared_ptr<Invoke> invoke)
{
	driver->sendData(invoke);
}

void Client::replyData(shared_ptr<Invoke> invoke)
{
	user->replyData(invoke);
	service->replyData(invoke);
}