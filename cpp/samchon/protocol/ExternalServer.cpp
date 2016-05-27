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

	if(xml->has_property("myIP") == true)
		this->myIP = xml->get_property("myIP");
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
auto ExternalServer::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();

	if(myIP.empty() == false)
		xml->set_property("myIP", myIP);

	return xml;
}