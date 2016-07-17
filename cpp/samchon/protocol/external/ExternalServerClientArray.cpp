#include <samchon/protocol/external/ExternalServerClientArray.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::external;

ExternalServerClientArray::ExternalServerClientArray()
	: ExternalServerArray(),
	ExternalClientArray()
{
}
ExternalServerClientArray::~ExternalServerClientArray()
{
}

auto ExternalServerClientArray::createChild(shared_ptr<XML> xml) -> ExternalSystem*
{
	return createExternalServer(xml);
}