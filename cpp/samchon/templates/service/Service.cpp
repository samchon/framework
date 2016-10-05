#include <samchon/templates/service/Service.hpp>

#include <samchon/templates/service/User.hpp>
#include <samchon/templates/service/Client.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::service;

Service::Service(Client *client, const string &path)
{
	this->client = client;
	this->path = path;
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