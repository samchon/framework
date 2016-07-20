#include <samchon/protocol/master/MediatorServer.hpp>

#include <samchon/protocol/external/ExternalClientArray.hpp>
#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;
using namespace samchon::protocol::external;

MediatorServer::MediatorServer(ExternalClientArray *systemArray, int port)
	: MediatorSystem(systemArray)
{
	this->port = port;
}

MediatorServer::~MediatorServer()
{
}

void MediatorServer::start()
{
	this->open(this->port);
};

void MediatorServer::addClient(shared_ptr<ClientDriver> driver)
{
	this->communicator = driver;
	driver->listen(this);
};