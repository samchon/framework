#include <samchon/protocol/ExternalServer.hpp>
#include <samchon/protocol/ExternalServerRole.hpp>

using namespace samchon;
using namespace samchon::protocol;

auto ExternalServerRole::TAG() const -> String
{
	return _T("role");
}

ExternalServerRole::ExternalServerRole(ExternalServer *externalServer)
	: super()
{
	this->externalServer = externalServer;
}

auto ExternalServerRole::getExternalServer() const -> ExternalServer*
{
	return externalServer;
}