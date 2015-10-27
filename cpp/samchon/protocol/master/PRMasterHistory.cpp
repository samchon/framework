#include <samchon/protocol/master/PRMasterHistory.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>
#include <samchon/protocol/master/ParallelSystem.hpp>
#include <samchon/protocol/master/PRMasterHistoryArray.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

PRMasterHistory::PRMasterHistory
	(
		PRMasterHistoryArray *historyArray,
		shared_ptr<Invoke> invoke, size_t index, size_t size
	) : super()
{
	this->master = historyArray->master;

	this->uid = invoke->get("invoke_history_uid")->getValue<size_t>();
	this->listener = invoke->getListener();
	this->startTime = chrono::system_clock::now();

	this->index = index;
	this->size = size;

	this->completed = 0;
}
void PRMasterHistory::notifyEnd()
{
	if (++completed < historyArray.size())
		return;

	// ESTIMATE LOCAL PERFORMANCE INDEX
	double avgElapsedTime = 0.0;
	for (size_t i = 0; i < historyArray.size(); i++)
		avgElapsedTime += historyArray[i]->calcAverageElapsedTime();
	
	for (size_t i = 0; i < historyArray.size(); i++)
	{
		PRInvokeHistory *history = historyArray[i];
		ParallelSystem *system = history->system;

		double historyPerformance = avgElapsedTime / history->calcAverageElapsedTime();
		system->performance = system->performance * .7 + historyPerformance * .3;
	}

	// ESTIMATE PERFORMANCE
	master->estimatePerformances();
}