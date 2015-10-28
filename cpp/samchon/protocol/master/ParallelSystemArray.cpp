#include <samchon/protocol/master/ParallelSystemArray.hpp>

#include <samchon/protocol/master/ParallelSystem.hpp>
#include <samchon/protocol/master/PRMasterHistoryArray.hpp>
#include <samchon/protocol/master/PRMasterHistory.hpp>

#include <thread>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ParallelSystemArray::ParallelSystemArray()
{
	historyArray = new PRMasterHistoryArray(this);
	progressArray = new PRMasterHistoryArray(this);
}
ParallelSystemArray::~ParallelSystemArray()
{
	delete historyArray;
	delete progressArray;
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ParallelSystemArray, ParallelSystem)

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ParallelSystemArray::sendSegmentData(shared_ptr<Invoke> invoke, size_t totalSize)
{
	sendPieceData(invoke, 0, totalSize);
}
void ParallelSystemArray::sendPieceData(shared_ptr<Invoke> invoke, size_t index, size_t totalSize)
{
	if (invoke->has("invoke_history_uid") == false)
		invoke->emplace_back(new InvokeParameter("invoke_history_uid", ++uid));

	vector<thread> threadArray(size());

	PRMasterHistory *history = new PRMasterHistory(historyArray, invoke, index, totalSize);
	historyArray->emplace_back(history);

	for (size_t i = 0; i < size(); i++)
	{
		//DETERMINE PIECE SIZE
		size_t pieceSize;
		if (i == size() - 1)
			pieceSize = (index < totalSize - 1) ? totalSize - index : 0;
		else
			pieceSize = (size_t)((totalSize - index) / (double)size() * at(i)->performance);

		//LINKAGE
		if (at(i)->systemArray == nullptr)
			at(i)->systemArray = this;

		//CALL ASYNCHRONOUSLY
		threadArray[i] = 
			thread
			(
				&ParallelSystem::sendPieceData, at(i).get(), 
				history, invoke, index, pieceSize
			);

		index += pieceSize;
	}
	for (size_t i = 0; i < threadArray.size(); i++)
		threadArray[i].join();
}

void ParallelSystemArray::notifyEnd(PRMasterHistory *masterHistory)
{
	// ESTIMATE LOCAL PERFORMANCE INDEX
	auto &historyArray = masterHistory->historyArray;
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

	//NORMALIZE ALL PERFORMANCE INDEX
	double avgPerformance = 0.0;

	for (size_t i = 0; i < size(); i++)
		avgPerformance += at(i)->performance / (double)size();

	for (size_t i = 0; i < size(); i++)
		at(i)->performance /= avgPerformance;
}

/*void ParallelSystemArray::notifyEnd(size_t uid)
{
	//DE-COUNT
	if (--progressMap[uid] == 0)
		progressMap.erase(uid);

	//ESTIMATE PERFORMANCE
	vector<pair<ParallelSystem*, PRInvokeHistory*>> systemPairArray;
	size_t i;

	//FIND SYSTEMS PARTICIPATED IN PARALLEL PROCESS
	for (i = 0; i < size(); i++)
	{
		if (at(i)->historyArray->has(to_string(uid)) == false)
			continue;

		systemPairArray.push_back({at(i).get(), at(i)->historyArray->get(to_string(uid)).get()});
	}

	//CALCULATE PERFORMANCE INDEX
	double avgElapsedTime = 0.0; //AVREAGE ELAPSED TIME
	
	for (i = 0; i < systemPairArray.size(); i++)
	{
		PRInvokeHistory *history = systemPairArray[i].second;

		avgElapsedTime += history->calcAverageElapsedTime() / (double)systemPairArray.size();
	}
	for (i = 0; i < systemPairArray.size(); i++)
	{
		ParallelSystem *system = systemPairArray[i].first;
		PRInvokeHistory *history = systemPairArray[i].second;

		double historyPerformance = avgElapsedTime / history->calcAverageElapsedTime();
		system->performance = system->performance * .7 + historyPerformance * .3;
	}

	//NORMALIZE ALL PERFORMANCE INDEX
	double avgPerformance = 0.0;
	
	for (i = 0; i < size(); i++)
		avgPerformance += at(i)->performance / (double)size();
	
	for (i = 0; i < size(); i++)
		at(i)->performance /= avgPerformance;
}*/