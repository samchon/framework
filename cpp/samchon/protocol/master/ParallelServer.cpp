#include <samchon/protocol/master/ParallelServer.hpp>

using namespace samchon::protocol::external;
using namespace samchon::protocol::master;

ParallelServer::ParallelServer(ParallelSystemArray *systemArray)
	: ParallelSystem(systemArray),
	external::ExternalServer()
{
}

ParallelServer::~ParallelServer()
{
}