#include <samchon/protocol/slave/SlaveServer.hpp>

#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
SlaveServer::SlaveServer()
	: SlaveSystem(), Server()
{
}
SlaveServer::~SlaveServer()
{
}

void SlaveServer::addClient(shared_ptr<ClientDriver> driver)
{
	this->communicator_ = driver;
	driver->listen(this);
}