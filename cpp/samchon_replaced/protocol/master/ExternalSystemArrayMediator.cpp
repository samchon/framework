#include <samchon/protocol/master/ExternalSystemArrayMediator.hpp>
#	include <samchon/protocol/master/MediatorSocket.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

ExternalSystemArrayMediator::ExternalSystemArrayMediator(IProtocol *parent)
	: super(parent)
{
	this->parent = parent;
}

void ExternalSystemArrayMediator::replyDataFromMaster(shared_ptr<Invoke> invoke)
{
	sendData(invoke);
}

auto ExternalSystemArrayMediator::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("masterIP"), socket->port);

	return xml;
}