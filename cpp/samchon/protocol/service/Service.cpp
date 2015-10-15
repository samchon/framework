#include <samchon/protocol/service/Service.hpp>
#	include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/User.hpp>
#	include <samchon/protocol/service/Client.hpp>

#include <samchon/library/SQLi.hpp>
#include <samchon/library/SQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

/* --------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------- */
Service::Service(Client *client)
	: super()
{
	this->client = client;
}

auto Service::__keepAlive() -> ServiceKeeper
{
	return ServiceKeeper((User*)getClient()->getUser(), (Client*)getClient());
}

/* --------------------------------------------------------
	GETTERS
-------------------------------------------------------- */
auto Service::getClient() const -> Client*
{
	return client;
}

/* --------------------------------------------------------
	SOCKET
-------------------------------------------------------- */
void Service::sendData(shared_ptr<Invoke> invoke)
{
	client->sendData(invoke);
}