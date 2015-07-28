#include <samchon/protocol/master/ExternalSystemRole.hpp>
#	include <samchon/protocol/master/ExternalSystemArray.hpp>
#	include <samchon/protocol/master/ExternalSystem.hpp>

#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

auto ExternalSystemRole::TAG() const -> String { return _T("role"); }

ExternalSystemRole::ExternalSystemRole(ExternalSystem *externalSystem)
	: super()
{
	this->externalSystem = externalSystem;
}

auto ExternalSystemRole::getSystem() const -> ExternalSystem*
{
	return externalSystem;
}
auto ExternalSystemRole::hasListener(const String &listener) const -> bool
{
	return listenerSet.has(listener);
}