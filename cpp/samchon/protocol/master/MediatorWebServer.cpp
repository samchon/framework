#include <samchon/protocol/master/MediatorWebServer.hpp>

#include <samchon/protocol/external/ExternalClientArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorWebServer::MediatorWebServer(ExternalClientArray *systemArray, int port)
	: MediatorServer(systemArray, port),
	WebServer()
{
}

MediatorWebServer::~MediatorWebServer()
{
}