#include <samchon/protocol/master/MediatorWebServer.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorWebServer::MediatorWebServer(ExternalSystemArray *systemArray, int port)
	: MediatorServer(systemArray, port),
	WebServer()
{
}

MediatorWebServer::~MediatorWebServer()
{
}