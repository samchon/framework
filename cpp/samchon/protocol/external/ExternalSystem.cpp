#include <samchon/protocol/external/ExternalSystem.hpp>

#include <samchon/protocol/external/ExternalSystemArray.hpp>
#include <samchon/protocol/external/ExternalServer.hpp>

#include <samchon/protocol/Communicator.hpp>
#include <samchon/protocol/ClientDriver.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::external;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalSystem::ExternalSystem(ExternalSystemArray *systemArray) 
	: super()
{
	this->system_array_ = systemArray;
}
ExternalSystem::ExternalSystem(ExternalSystemArray *systemArray, shared_ptr<ClientDriver> driver)
	: ExternalSystem(systemArray)
{
	this->communicator_ = driver;
	driver->listen(this);
	
	for (size_t i = 0; i < systemArray->size(); i++)
		if (systemArray->at(i).get() == this)
		{
			systemArray->erase(systemArray->begin() + i);
			break;
		}
}

ExternalSystem::~ExternalSystem()
{
}

void ExternalSystem::construct(shared_ptr<XML> xml)
{
	name = xml->fetchProperty("name");
	
	ExternalServer *external_server = dynamic_cast<ExternalServer*>(this);
	if (external_server != nullptr)
	{
		external_server->ip = xml->getProperty("ip");
		external_server->port = xml->getProperty<int>("port");
	}

	super::construct(xml);
}

/* ---------------------------------------------------------
	NETWORK & MESSAGE CHAIN
--------------------------------------------------------- */
void ExternalSystem::close()
{
	communicator_->close();
}

void ExternalSystem::sendData(shared_ptr<Invoke> invoke)
{
	communicator_->sendData(invoke);
}

void ExternalSystem::replyData(shared_ptr<Invoke> invoke)
{
	for (size_t i = 0; i < size(); i++)
		at(i)->replyData(invoke);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto ExternalSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);

	const ExternalServer *external_server = dynamic_cast<const ExternalServer*>(this);
	if (external_server != nullptr)
	{
		xml->setProperty("ip", external_server->ip);
		xml->setProperty("port", external_server->port);
	}

	return xml;
}