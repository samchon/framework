#include <samchon/protocol/master/ParallelServerClientArrayMediator.hpp>

#include <thread>

using namespace std;
using namespace samchon::protocol::external;
using namespace samchon::protocol::master;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ParallelServerClientArrayMediator::ParallelServerClientArrayMediator()
	: ParallelSystemArrayMediator(),
	ExternalServerClientArray()
{
}

ParallelServerClientArrayMediator::~ParallelServerClientArrayMediator()
{
}

/* ---------------------------------------------------------
	OPEN & CONNECT
--------------------------------------------------------- */
void ParallelServerClientArrayMediator::open(int port)
{
	thread t1([this, port]()
	{
		ExternalServerClientArray::open(port);
	});
	thread t2(&ParallelServerClientArrayMediator::start_mediator, this);

	t1.join();
	t2.join();
}

void ParallelServerClientArrayMediator::connect()
{
	thread t1([this]()
	{
		ExternalServerClientArray::connect();
	});
	thread t2(&ParallelServerClientArrayMediator::start_mediator, this);

	t1.join();
	t2.join();
}