#include <samchon/protocol/distributed/DistributedServer.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>

using namespace samchon::protocol::distributed;

DistributedServer::DistributedServer(DistributedSystemArray *systemArray)
	: DistributedSystem(systemArray),
	external::ExternalServer(systemArray)
{
	this->system_array_ = systemArray;
}
DistributedServer::~DistributedServer()
{
}