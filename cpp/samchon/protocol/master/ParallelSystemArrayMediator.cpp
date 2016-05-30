#include <samchon/protocol/master/ParallelSystemArrayMediator.hpp>

#include <samchon/protocol/master/ParallelSlaveSystemMediator.hpp>
#include <samchon/protocol/master/PRMasterHistory.hpp>

#include <array>
#include <thread>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ParallelSystemArrayMediator::ParallelSystemArrayMediator()
	: super()
{
	slave = nullptr;
}
ParallelSystemArrayMediator::~ParallelSystemArrayMediator()
{
	delete slave;
}

void ParallelSystemArrayMediator::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if (slave == nullptr)
		return;

	if (xml->has(slave->TAG()))
		slave->construct(xml->get(slave->TAG())->at(0));
}

/* ------------------------------------------------------------------
	PROCESS
------------------------------------------------------------------ */
void ParallelSystemArrayMediator::start()
{
	if (slave == nullptr)
		return;

	slave->master = this;
	slave->start();

	//STARTS EACH SYSTEM ASYNCHRONOUSLY
	/*array<thread, 2> threadArray;
	threadArray[0] = thread(&ParallelSystemArray::start, this);
	threadArray[1] = thread(&ParallelSlaveSystemMediator::start, slave);
	
	//HOWEVER, THIS START IS SYNCHRONOUS
	for (size_t i = 0; i < threadArray.size(); i++)
		threadArray[i].join();*/
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ParallelSystemArrayMediator::notifyEnd(PRMasterHistory *masterHistory)
{
	//RE-CALCULATE PERFORMANCE INDEX
	super::notifyEnd(masterHistory);

	//REPORT TO ITS ORIGIN MASTER
	slave->sendData(masterHistory->toInvoke());
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ParallelSystemArrayMediator::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (slave != nullptr)
		xml->push_back(slave->toXML());

	return xml;
}
