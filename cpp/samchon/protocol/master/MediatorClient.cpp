#include <samchon/protocol/master/MediatorClient.hpp>

#include <samchon/protocol/external/ExternalClientArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorClient::MediatorClient(ExternalClientArray *systemArray, const string &ip, int port)
	: MediatorSystem(systemArray),
	external::ExternalServer()
{
	this->ip = ip;
	this->port = port;
}
MediatorClient::~MediatorClient()
{
}

void MediatorClient::start()
{
	this->connect();
}