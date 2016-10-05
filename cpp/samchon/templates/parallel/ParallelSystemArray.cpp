#include <samchon/templates/parallel/ParallelSystemArray.hpp>

#include <samchon/templates/parallel/PRInvokeHistory.hpp>

#include <thread>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::parallel;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
ParallelSystemArray::ParallelSystemArray()
	: super()
{
	history_sequence = 0;
}
ParallelSystemArray::~ParallelSystemArray()
{
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void ParallelSystemArray::sendPieceData(shared_ptr<Invoke> invoke, size_t first, size_t last)
{
	if (invoke->has("_History_uid") == false)
		invoke->emplace_back(new InvokeParameter("_History_uid", ++history_sequence));
	else
	{
		// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
		//	- THIS IS A TYPE OF ParallelSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
		//	- A ParallelSystem HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO OTHER SLAVES.
		size_t uid = invoke->get("_History_uid")->getValue<size_t>();

		// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
		if (uid > history_sequence)
			history_sequence = uid;
	}

	// TOTAL NUMBER OF PIECES TO DIVIDE
	size_t segment_size = last - first;

	// SYSTEMS TO BE GET DIVIDED PROCESSES AND
	vector<shared_ptr<ParallelSystem>> system_array;
	vector<thread> threads; // THREADS TO EMBARK THEM
	
	system_array.reserve(size());
	threads.reserve(size());

	// POP EXCLUDEDS
	for (size_t i = 0; i < size(); i++)
		if (at(i)->excluded_ == false)
			system_array.push_back(at(i));

	// ORDERS
	for (size_t i = 0; i < system_array.size(); i++)
	{
		shared_ptr<ParallelSystem> system = system_array.at(i);
		
		// COMPUTE FIRST AND LAST INDEX TO ALLOCATE
		size_t piece_size = (i == system_array.size() - 1)
			? segment_size - first 
			: (size_t)(segment_size / system_array.size() * system->getPerformance());
		if (piece_size == 0)
			continue;

		// SEND DATA WITH PIECES' INDEXES
		threads.emplace_back(&ParallelSystem::send_piece_data, system.get(), invoke, first, first + piece_size);
		first += piece_size; // FOR THE NEXT STEP
	}

	for (auto it = threads.begin(); it != threads.end(); it++)
		it->join();
}

auto ParallelSystemArray::_Complete_history(shared_ptr<InvokeHistory> history) -> bool
{
	// WRONG TYPE
	if (dynamic_pointer_cast<PRInvokeHistory>(history) == nullptr)
		return false;

	size_t uid = history->getUID();

	// ALL THE SUB-TASKS ARE DONE?
	for (size_t i = 0; i < size(); i++)
		if (at(i)->progress_list_.has(uid) == true)
			return false; // IT'S ON A PROCESS IN SOME SYSTEM.

	//--------
	// RE-CALCULATE PERFORMANCE INDEX
	//--------
	// CONSTRUCT BASIC DATA
	vector<pair<shared_ptr<ParallelSystem>, double>> system_pairs;
	double performance_index_average = 0.0;
	
	system_pairs.reserve(size());

	for (size_t i = 0; i < size(); i++)
	{
		shared_ptr<ParallelSystem> system = at(i);
		if (system->history_list_.has(uid) == false)
			continue; // NO HISTORY (HAVE NOT PARTICIPATED IN THE PARALLEL PROCESS)

		// COMPUTE PERFORMANCE INDEX BASIS ON EXECUTION TIME OF THIS PARALLEL PROCESS
		shared_ptr<PRInvokeHistory> my_history = dynamic_pointer_cast<PRInvokeHistory>(system->history_list_.get(uid));
		double performance_index = my_history->computeSize() / (double)my_history->computeElapsedTime();

		// PUSH TO SYSTEM PAIRS AND ADD TO AVERAGE
		system_pairs.emplace_back(system, performance_index);
		performance_index_average += performance_index;
	}
	performance_index_average /= system_pairs.size();

	// RE-CALCULATE PERFORMANCE INDEX
	for (size_t i = 0; i < system_pairs.size(); i++)
	{
		// SYSTEM AND NEW PERFORMANCE INDEX BASIS ON THE EXECUTION TIME
		shared_ptr<ParallelSystem> system = system_pairs[i].first;
		if (system->enforced_ == true)
			continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

		double new_performance = system_pairs[i].second / performance_index_average;

		// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX
		double ordinary_ratio;
		if (system->history_list_.size() < 2)
			ordinary_ratio = .3;
		else
			ordinary_ratio = min(0.7, 1.0 / (system->history_list_.size() - 1.0));

		system->performance_ = (system->getPerformance() * ordinary_ratio) + (new_performance * (1 - ordinary_ratio));
	}

	// AT LAST, NORMALIZE PERFORMANCE INDEXES OF ALL SLAVE SYSTEMS
	_Normalize_performance();
	return true;
}

void ParallelSystemArray::_Normalize_performance()
{
	// COMPUTE AVERAGE
	double average = 0.0;
	size_t denominator = 0;

	for (size_t i = 0; i < size(); i++)
	{
		shared_ptr<ParallelSystem> &system = at(i);
		if (system->enforced_ == true)
			continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

		average += system->getPerformance();
		denominator++;
	}
	average /= (double)denominator;

	// DIVIDE FROM THE AVERAGE
	for (size_t i = 0; i < size(); i++)
	{
		shared_ptr<ParallelSystem> &system = at(i);
		if (system->enforced_ == true)
			continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

		system->setPerformance(system->getPerformance() / average);
	}
}