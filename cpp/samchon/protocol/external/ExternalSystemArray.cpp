#include <samchon/protocol/external/ExternalSystemArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::external;

/* =========================================================
	CONSTRUCTORS
		- DEFAULT
		- FACTORY METHODS FOR CHILDREN
============================================================
	DEFAULT
--------------------------------------------------------- */
ExternalSystemArray::ExternalSystemArray()
	: super()
{
}
ExternalSystemArray::~ExternalSystemArray()
{
}

/* ---------------------------------------------------------
	FACTORY METHODS FOR CHILDREN
--------------------------------------------------------- */
//void ExternalSystemArray::addClient(shared_ptr<ClientDriver> driver)
//{
//	ExternalSystem *system = createExternalClient(driver);
//	if (system == nullptr)
//		return;
//
//	system->communicator = driver;
//
//	emplace_back(system);
//	driver->listen(system);
//}
//auto ExternalSystemArray::createChild(shared_ptr<XML> xml) -> ExternalSystem*
//{
//	return this->createExternalServer(xml);
//}

/* =========================================================
	NETWORK
		- SERVER AND CLIENT
		- MESSAGE CHAIN
============================================================
	SERVER AND CLIENT
--------------------------------------------------------- */
//void ExternalSystemArray::connect()
//{
//	for (size_t i = 0; i < size(); i++)
//	{
//		auto external_server = std::dynamic_pointer_cast<ExternalServer>(this->at(i));
//		external_server->connect();
//	}
//}

void ExternalSystemArray::sendData(shared_ptr<Invoke> invoke)
{
	for (size_t i = 0; i < size(); i++)
		at(i)->sendData(invoke);
}