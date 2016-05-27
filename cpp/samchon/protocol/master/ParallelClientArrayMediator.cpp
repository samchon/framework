#include <samchon/protocol/master/ParallelClientArrayMediator.hpp>

#include <samchon/protocol/master/ParallelSlaveClientMediator.hpp>

#include <array>
#include <thread>
#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ParallelClientArrayMediator::ParallelClientArrayMediator()
	: super(),
	network_super()
{
	slave = new ParallelSlaveClientMediator();
}
void ParallelClientArrayMediator::construct(shared_ptr<XML> xml)
{
	network_super::construct(xml);

	if (xml->has(slave->TAG()))
		slave->construct(xml->get(slave->TAG())->at(0));
}

/* ------------------------------------------------------------------
	PROCESS
------------------------------------------------------------------ */
void ParallelClientArrayMediator::start()
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

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ParallelClientArrayMediator::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = network_super::to_XML();
	xml->push_back(slave->to_XML());

	return xml;
}