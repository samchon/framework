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

	if(xml->has_property("myIP") == true)
		this->myIP = xml->get_property("myIP");
	else
		this->myIP.clear();
}

auto ParallelServer::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();

	if(myIP.empty() == false)
		xml->set_property("myIP", myIP);

	return xml;
}