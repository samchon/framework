#include <samchon/protocol/external/ExternalServer.hpp>

#include <samchon/protocol/ServerConnector.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::external;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalServer::ExternalServer()
	: super()
{
}
ExternalServer::~ExternalServer()
{
}

auto ExternalServer::createServerConnector() -> ServerConnector*
{
	return new ServerConnector();
}

/* ---------------------------------------------------------
	NETWORK
--------------------------------------------------------- */
void ExternalServer::connect()
{
	if (communicator != nullptr || ip.empty() == true)
		return;

	ServerConnector *connector = this->createServerConnector();
	communicator.reset(connector);

	connector->connect(ip, port);
	connector->listen(this);
}