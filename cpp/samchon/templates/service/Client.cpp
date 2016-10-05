#include <samchon/templates/service/Client.hpp>

#include <samchon/templates/service/Server.hpp>
#include <samchon/templates/service/User.hpp>
#include <samchon/templates/service/Service.hpp>

#include <samchon/protocol/WebClientDriver.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::service;

Client::Client(User *user, shared_ptr<WebClientDriver> driver)
{
	this->user = user;
	this->driver = driver;
}
Client::~Client()
{
}

auto Client::__keep_alive() const -> pair<shared_ptr<User>, shared_ptr<Client>>
{
	return {user->my_weak_ptr.lock(), my_weak_ptr.lock()};
}

void Client::changeService(const string &path)
{
	service.reset(createService(path));
}
void Client::changeService(Service *obj)
{
	service.reset(obj);
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