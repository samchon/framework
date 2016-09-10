#include <samchon/protocol/slave/MasterClient.hpp>

#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::slave;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
MasterClient::MasterClient()
	: MasterSystem(), Server()
{
}
MasterClient::~MasterClient()
{
}

void MasterClient::addClient(shared_ptr<ClientDriver> driver)
{
	this->communicator_ = driver;
	driver->listen(this);
}