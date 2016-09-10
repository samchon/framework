#include <samchon/protocol/parallel/ParallelSystemArray.hpp>

#include <samchon/protocol/parallel/PRInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::parallel;

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
	if (invoke->has("invoke_history_uid") == false)
		invoke->emplace_back(new InvokeParameter("invoke_history_uid", ++history_sequence));
	else
	{
		// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
		//	- THIS IS A TYPE OF ParallelSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
		//	- A ParallelSystem HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO OTHER SLAVES.
		size_t uid = invoke->get("invoke_history_uid")->getValue<size_t>();

		// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
		if (uid > history_sequence)
			history_sequence = uid;
	}

	size_t segment_size = last - first;
	for (size_t i = 0; i < size(); i++)
	{
		shared_ptr<ParallelSystem> system = at(i);
		
		// COMPUTE FIRST AND LAST INDEX TO ALLOCATE
		size_t piece_size = (i == size() - 1) 
			? segment_size - first 
			: segment_size / size() * system->getPerformance();
		if (piece_size == 0)
			continue;

		// SEND DATA WITH PIECE INDEXES
		system->send_piece_data(invoke, first, first + piece_size);
		first += piece_size; // FOR THE NEXT STEP
	}
}

auto ParallelSystemArray::_Notify_end(shared_ptr<InvokeHistory> history) -> bool
{
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
		double performance_index = my_history->computeSize() / my_history->computeElapsedTime();

		// PUSH TO SYSTEM PAIRS AND ADD TO AVERAGE
		system_pairs.emplace_back(my_history, performance_index);
		performance_index_average += performance_index;
	}
	performance_index_average /= system_pairs.size();

	// RE-CALCULATE PERFORMANCE INDEX
	for (size_t i = 0; i < system_pairs.size(); i++)
	{
		// SYSTEM AND NEW PERFORMANCE INDEX BASIS ON THE EXECUTION TIME
		shared_ptr<ParallelSystem> system = system_pairs[i].first;
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
	normalize_performance();

	return true;
}

void ParallelSystemArray::normalize_performance()
{
	// CALC AVERAGE
	double average = 0.0;

	for (size_t i = 0; i < size(); i++)
		average += at(i)->getPerformance();
	average /= size();

	// DIVIDE FROM THE AVERAGE
	for (size_t i = 0; i < size(); i++)
		at(i)->performance_ /= average;
}