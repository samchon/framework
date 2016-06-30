#include <samchon/protocol/ExternalSystem.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>
#include <samchon/protocol/ExternalSystemRole.hpp>

#include <samchon/protocol/ServerConnector.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalSystem::ExternalSystem(ExternalSystemArray *systemArray)
	: super()
{
	this->systemArray = systemArray;
	this->communicator = nullptr;
}

ExternalSystem::~ExternalSystem()
{
}

void ExternalSystem::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	name = xml->getProperty<string>("name");
	ip = xml->getProperty<string>("ip");
	port = xml->getProperty<int>("port");
}

auto ExternalSystem::createChild(shared_ptr<XML> xml) -> ExternalSystemRole*
{
	return systemArray->createRole(xml->getProperty<string>("name"));
}

/* ---------------------------------------------------------
	NETWORK & MESSAGE I/O
--------------------------------------------------------- */
void ExternalSystem::connect()
{
	if (communicator != nullptr)
		return;

	// CREATE SERVER_CONNECTOR
	ServerConnector *connector = createServerConnector();
	communicator.reset(connector);

	// CONNECT AND INTERACT
	connector->connect(ip, port);
	connector->listen(this);
}

void ExternalSystem::sendData(shared_ptr<Invoke> invoke)
{
	communicator->sendData(invoke);
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
	xml->setProperty("ip", ip);
	xml->setProperty("port", port);

	return xml;
}