#include <samchon/protocol/ExternalClientArray.hpp>

#include <samchon/protocol/ExternalClient.hpp>

#include <thread>
#include <boost/asio.hpp>
#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ExternalClientArray::ExternalClientArray()
	: super(),
	IServer()
{
}
void ExternalClientArray::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if(xml->has_property("myIP") == true)
		this->myIP = xml->get_property("myIP");
	else
		this->myIP.clear();

	this->port = xml->get_property<int>("port");
}

void ExternalClientArray::start()
{
	this->open();
}

/* ------------------------------------------------------------------
	ISERVER METHODS
------------------------------------------------------------------ */
auto ExternalClientArray::PORT() const -> int
{
	return port;
}
auto ExternalClientArray::MY_IP() const -> string
{
	return myIP;
}

void ExternalClientArray::addClient(Socket *socket)
{
	ExternalClient *client = dynamic_cast<ExternalClient*>(create_child(nullptr));
	
	if(client == nullptr)
		throw exception("invalid factory method");

	string &ip = socket->remote_endpoint().address().to_string();
	int port = socket->remote_endpoint().port();

	client->ip = ip;
	client->port = port;
	client->socket = socket;

	emplace_back(client);

	thread(&ExternalClient::start, client).detach();
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ExternalClientArray::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();

	if(myIP.empty() == false)
		xml->set_property("myIP", myIP);

	return xml;
}