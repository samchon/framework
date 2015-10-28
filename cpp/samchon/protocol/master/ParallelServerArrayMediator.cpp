#include <samchon/protocol/master/ParallelServerArrayMediator.hpp>

#include <samchon/protocol/master/ParallelSlaveServerMediator.hpp>

#include <array>
#include <thread>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

ParallelServerArrayMediator::ParallelServerArrayMediator()
	: super(),
	network_super()
{
	slave = new ParallelSlaveServerMediator();
}
void ParallelServerArrayMediator::start()
{
	//STARTS EACH SYSTEM ASYNCHRONOUSLY
	array<thread, 2> threadArray =
	{
		thread
		(
			[this]()
			{
				super::start();
			}
		),
		thread
		(
			[this]()
			{
				network_super::start();
			}
		)
	};

	//HOWEVER, THIS START IS SYNCHRONOUS
	for (size_t i = 0; i < threadArray.size(); i++)
		threadArray[i].join();
}