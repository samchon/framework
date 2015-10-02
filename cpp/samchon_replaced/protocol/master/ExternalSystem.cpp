#include <samchon/protocol/master/ExternalSystem.hpp>
#	include <samchon/protocol/master/ExternalSystemArray.hpp>
#	include <samchon/protocol/master/ExternalSystemRole.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ---------------------------------------------------------
	XML TAGS
--------------------------------------------------------- */
auto ExternalSystem::TAG() const -> String { return _T("system"); }
auto ExternalSystem::CHILD_TAG() const -> String { return _T("role"); }

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ExternalSystem::ExternalSystem(ExternalSystemArray *systemArray)
{
	this->systemArray = systemArray;
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ExternalSystem, ExternalSystemRole)
auto ExternalSystem::getSystemArray() const -> ExternalSystemArray*
{
	return systemArray;
}
auto ExternalSystem::getIP() const -> String
{
	return ip;
}
auto ExternalSystem::getPort() const -> int
{
	return port;
}

/* ---------------------------------------------------------
	NETWORK I/O CHAIN
--------------------------------------------------------- */
void ExternalSystem::replyData(shared_ptr<Invoke> invoke)
{
	systemArray->replyData(invoke);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto ExternalSystem::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("ip"), ip);
	if (myIP.empty() == false)
		xml->setProperty(_T("myIP"), myIP);
	xml->setProperty(_T("port"), port);

	return xml;
}