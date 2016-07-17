#include <samchon/protocol/master/ParallelServerArrayMediator.hpp>

#include <thread>

using namespace std;
using namespace samchon::protocol::external;
using namespace samchon::protocol::master;

ParallelServerArrayMediator::ParallelServerArrayMediator()
	: ParallelSystemArrayMediator(),
	ExternalServerArray()
{
}
ParallelServerArrayMediator::~ParallelServerArrayMediator()
{
}

void ParallelServerArrayMediator::connect()
{
	thread t1([this]()
	{
		ExternalServerArray::connect();
	});
	thread t2(&ParallelServerArrayMediator::start_mediator, this);

	t1.join();
	t2.join();
};