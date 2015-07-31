#include <samchon/protocol/ExternalServer.hpp>
#	include <samchon/protocol/ExternalServerArray.hpp>
#	include <samchon/protocol/ExternalServerRole.hpp>

#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ----------------------------------------------------------------
	ENTITY METHOD
---------------------------------------------------------------- */
auto ExternalServer::TAG() const -> String
{
	return _T("server");
}
auto ExternalServer::CHILD_TAG() const -> String
{
	return _T("role");
}
auto ExternalServer::key() const -> String
{
	return name;
}

auto ExternalServer::IP() const -> String
{
	return ip;
}
auto ExternalServer::PORT() const -> int
{
	return port;
}
auto ExternalServer::MY_IP() const -> String
{
	return myIP;
}

/* ----------------------------------------------------------------
	CONSTRUCTORS
---------------------------------------------------------------- */
ExternalServer::ExternalServer(ExternalServerArray *externalServerArray)
	: super(), IServerConnector()
{
	this->externalServerArray = externalServerArray;
	this->myIP = _T("");
}
void ExternalServer::construct(shared_ptr<XML> xml)
{
	name = xml->getProperty(_T("name"));
	ip = xml->getProperty(_T("ip"));
	port = stol(xml->getProperty(_T("port")));
	myIP = xml->hasProperty(_T("myIP")) ? xml->getProperty(_T("myIP")) : _T("");

	super::construct(xml);
}

/* ----------------------------------------------------------------
	GETTERS
---------------------------------------------------------------- */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ExternalServer, ExternalServerRole);
auto ExternalServer::getName() const -> String
{
	return name;
}
auto ExternalServer::getIP() const -> String
{
	return ip;
}
auto ExternalServer::getPort() const -> int
{
	return port;
}

/* ----------------------------------------------------------------
	EXPORTERS
---------------------------------------------------------------- */
void ExternalServer::replyData(shared_ptr<Invoke> invoke)
{
	externalServerArray->replyData(invoke);
}
auto ExternalServer::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("name"), name);
	xml->setProperty(_T("ip"), ip);
	xml->setProperty(_T("port"), toString(port));
	
	if (myIP.empty() == false)
		xml->setProperty(_T("myIP"), myIP);

	return xml;
}