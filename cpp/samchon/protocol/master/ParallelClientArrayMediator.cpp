#include <samchon/protocol/master/ParallelClientArrayMediator.hpp>

#include <thread>

using namespace std;
using namespace samchon::protocol::external;
using namespace samchon::protocol::master;

ParallelClientArrayMediator::ParallelClientArrayMediator()
	: ParallelSystemArrayMediator(),
	ExternalClientArray()
{
}

ParallelClientArrayMediator::~ParallelClientArrayMediator()
{
}

void ParallelClientArrayMediator::open(int port)
{
	thread t1([this, port]()
	{
		ExternalClientArray::open(port);
	});
	thread t2(&ParallelClientArrayMediator::start_mediator, this);

	t1.join();
	t2.join();
}