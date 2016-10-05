#include <samchon/templates/distributed/DistributedServer.hpp>

#include <samchon/templates/distributed/DistributedSystemArray.hpp>

using namespace samchon::templates::distributed;

DistributedServer::DistributedServer(DistributedSystemArray *systemArray)
	: DistributedSystem(systemArray),
	external::ExternalServer(systemArray)
{
	this->system_array_ = systemArray;
}
DistributedServer::~DistributedServer()
{
}