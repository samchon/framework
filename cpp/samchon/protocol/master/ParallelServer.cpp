#include <samchon/protocol/master/ParallelServer.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

ParallelServer::ParallelServer()
	: super(),
	network_super()
{
}

void ParallelServer::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if(xml->hasProperty("myIP") == true)
		this->myIP = xml->getProperty("myIP");
	else
		this->myIP.clear();
}

auto ParallelServer::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();

	if(myIP.empty() == false)
		xml->setProperty("myIP", myIP);

	return xml;
}