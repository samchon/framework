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
	return new ServerConnector(this);
}

/* ---------------------------------------------------------
	NETWORK
--------------------------------------------------------- */
void ExternalServer::connect()
{
	if (communicator_ != nullptr || ip.empty() == true)
		return;

	ServerConnector *connector = this->createServerConnector();
	communicator_.reset(connector);

	connector->connect(ip, port);
}