#include <samchon/templates/external/ExternalServer.hpp>

#include <samchon/templates/external/ExternalSystemArray.hpp>
#include <samchon/protocol/ServerConnector.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::external;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalServer::ExternalServer(ExternalSystemArray *systemArray)
	: super(systemArray)
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

	shared_ptr<ServerConnector> connector(this->createServerConnector());
	this->communicator_ = connector;

	connector->connect(ip, port);

	for (size_t i = 0; i < system_array_->size(); i++)
		if (system_array_->at(i).get() == this)
		{
			system_array_->erase(system_array_->begin() + i);
			break;
		}
}