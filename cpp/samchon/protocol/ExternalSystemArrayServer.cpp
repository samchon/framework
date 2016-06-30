#include <samchon/protocol/ExternalSystemArrayServer.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>
#include <samchon/protocol/ExternalSystem.hpp>

#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon::protocol;

ExternalSystemArrayServer::ExternalSystemArrayServer(ExternalSystemArray *systemArray)
	: super()
{
	this->systemArray = systemArray;
}
ExternalSystemArrayServer::~ExternalSystemArrayServer()
{
}

void ExternalSystemArrayServer::addClient(shared_ptr<ClientDriver> driver)
{
	// CONSTRUCT CHILD SYSTEM
	ExternalSystem *system = systemArray->createSystem("");
	system->communicator = driver;
	system->ip = "external client";
	system->port = 0;

	// REGISTER AND START COMMUNICATION
	systemArray->emplace_back(system);
	driver->listen(system);
}