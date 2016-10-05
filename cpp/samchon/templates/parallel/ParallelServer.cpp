#include <samchon/templates/parallel/ParallServer.hpp>

#include <samchon/templates/parallel/ParallelSystemArray.hpp>

using namespace samchon::templates::parallel;

ParallelServer::ParallelServer(ParallelSystemArray *systemArray)
	: ParallelSystem(systemArray),
	external::ExternalServer(systemArray)
{
	this->system_array_ = systemArray;
}
ParallelServer::~ParallelServer()
{
}