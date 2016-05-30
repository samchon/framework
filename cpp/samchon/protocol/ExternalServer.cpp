#include <samchon/protocol/ExternalServer.hpp>

#include <thread>
#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ExternalServer::ExternalServer()
	: super(),
	ServerConnector()
{
}
void ExternalServer::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if(xml->hasProperty("myIP") == true)
		this->myIP = xml->getProperty("myIP");
	else
		this->myIP.clear();
}

void ExternalServer::start()
{
	this->connect();
	this->listen();
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
auto ExternalServer::getIP() const -> string
{
	return ip;
}
auto ExternalServer::getPort() const -> int
{
	return port;
}

auto ExternalServer::getMyIP() const -> string
{
	return myIP;
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ExternalServer::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();

	if(myIP.empty() == false)
		xml->setProperty("myIP", myIP);

	return xml;
}