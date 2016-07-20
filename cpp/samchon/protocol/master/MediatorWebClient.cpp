#include <samchon/protocol/master/MediatorWebClient.hpp>

#include <samchon/protocol/WebServerConnector.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorWebClient::MediatorWebClient(ExternalClientArray *systemArray, const string &ip, int port)
	: MediatorClient(systemArray, ip, port)
{
	this->ip = ip;
	this->port = port;
}
MediatorWebClient::~MediatorWebClient()
{
}

auto MediatorWebClient::createServerConnector() -> ServerConnector*
{
	return new WebServerConnector(this);
}