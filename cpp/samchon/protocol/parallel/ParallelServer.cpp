#include <samchon/protocol/parallel/ParallServer.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>

using namespace samchon::protocol::parallel;

ParallelServer::ParallelServer(ParallelSystemArray *systemArray)
	: ParallelSystem(systemArray),
	external::ExternalServer(systemArray)
{
	this->system_array_ = systemArray;
}
ParallelServer::~ParallelServer()
{
}