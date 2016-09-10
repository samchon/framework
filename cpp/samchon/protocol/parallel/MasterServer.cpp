#include <samchon/protocol/slave/MasterServer.hpp>

#include <samchon/protocol/ServerConnector.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
MasterServer::MasterServer()
	: MasterSystem()
{
}
MasterServer::~MasterServer()
{
}

auto MasterServer::createServerConnector() -> ServerConnector*
{
	return new ServerConnector(this);
}

/* ---------------------------------------------------------
	METHOD OF CONNECTOR
--------------------------------------------------------- */
void MasterServer::connect(const string &ip, int port)
{
	shared_ptr<ServerConnector> connector(createServerConnector());
	this->communicator_ = connector;

	connector->connect(ip, port);
}