#include <samchon/templates/slave/SlaveClient.hpp>

#include <samchon/protocol/ServerConnector.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::slave;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
SlaveClient::SlaveClient()
	: SlaveSystem()
{
}
SlaveClient::~SlaveClient()
{
}

auto SlaveClient::createServerConnector() -> ServerConnector*
{
	return new ServerConnector(this);
}

/* ---------------------------------------------------------
	METHOD OF CONNECTOR
--------------------------------------------------------- */
void SlaveClient::connect(const string &ip, int port)
{
	shared_ptr<ServerConnector> connector(createServerConnector());
	this->communicator_ = connector;

	connector->connect(ip, port);
}