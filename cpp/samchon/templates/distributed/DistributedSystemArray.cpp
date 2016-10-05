#include <samchon/templates/distributed/DistributedSystemArray.hpp>

#include <samchon/templates/distributed/DSInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::distributed;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
DistributedSystemArray::DistributedSystemArray()
	: super()
{
}

DistributedSystemArray::~DistributedSystemArray()
{
}

void DistributedSystemArray::construct(shared_ptr<XML> xml)
{
	//--------
	// CONSTRUCT ROLES
	//--------
	// CLEAR ORDINARY ROLES
	process_map_.clear();

	// CREATE ROLES
	if (xml->has("processes") == true && xml->get("processes")->front()->has("process") == true)
	{
		shared_ptr<XMLList> &role_xml_list = xml->get("processes")->front()->get("process");
		for (size_t i = 0; i < role_xml_list->size(); i++)
		{
			shared_ptr<XML> &role_xml = role_xml_list->at(i);

			// CONSTRUCT ROLE FROM XML
			std::shared_ptr<DistributedProcess> role(createRole(role_xml));
			role->construct(role_xml);

			// AND INSERT TO ROLE_MAP
			insertProcess(role);
		}
	}

	//--------
	// CONSTRUCT SYSTEMS
	//--------
	super::construct(xml);
}

/* ---------------------------------------------------------
	HISTORY HANDLER - PERFORMANCE ESTIMATION
--------------------------------------------------------- */
auto DistributedSystemArray::_Complete_history(shared_ptr<InvokeHistory> _history) -> bool
{
	shared_ptr<DSInvokeHistory> history = dynamic_pointer_cast<DSInvokeHistory>(_history);

	// ParallelSystem's history -> PRInvokeHistory
	if (history == nullptr)
		return super::_Complete_history(_history);

	//--------
	// DistributedProcess's history -> DSInvokeHistory
	//--------
	// NO ROLE, THEN FAILED TO COMPLETE
	if (history->getProcess() == nullptr)
		return false;

	// ESTIMATE PERFORMANCE INDEXES
	estimate_system_performance(history); // ESTIMATE SYSTEMS' INDEX
	estimate_role_performance(history); // ESTIMATE ROLE' INDEX

	// AT LAST, NORMALIZE PERFORMANCE INDEXES OF ALL SYSTEMS AND ROLES
	_Normalize_performance();
	return true;
}

void DistributedSystemArray::estimate_role_performance(shared_ptr<DSInvokeHistory> history)
{
	DistributedProcess *process = history->getProcess();
	if (process->enforced_ == true)
		return; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

	double average_elapsed_time_of_others = 0;
	size_t denominator = 0;

	// COMPUTE AVERAGE ELAPSED TIME
	for (auto it = process_map_.begin(); it != process_map_.end(); it++)
	{
		DistributedProcess *my_process = it->second.get();
		if (my_process == process || my_process->history_list_.empty() == true)
			continue;

		average_elapsed_time_of_others += my_process->compute_average_elapsed_time() * my_process->getResource();
		denominator++;
	}

	// COMPARE WITH THIS HISTORY'S ELAPSED TIME
	if (denominator != 0)
	{
		// DIVE WITH DENOMINATOR
		average_elapsed_time_of_others /= (double)denominator;

		// DEDUCT NEW PERFORMANCE INDEX BASED ON THE EXECUTION TIME
		//	- ROLE'S PERFORMANCE MEANS; HOW MUCH TIME THE ROLE NEEDS
		//	- ELAPSED TIME IS LONGER, THEN PERFORMANCE IS HIGHER
		double new_performance = history->computeElapsedTime() / average_elapsed_time_of_others;

		// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 15%
		double ordinary_ratio;
		if (process->history_list_.size() < 2)
			ordinary_ratio = .15;
		else
			ordinary_ratio = min(.85, 1.0 / (process->history_list_.size() - 1.0));

		// DEFINE NEW PERFORMANCE
		process->setResource
		(
			(process->getResource() * ordinary_ratio)
			+ (new_performance * (1 - ordinary_ratio))
		);
	}
}
void DistributedSystemArray::estimate_system_performance(shared_ptr<DSInvokeHistory> history)
{
	DistributedSystem *system = history->getSystem();
	if (system->enforced_ == true)
		return; // THE PERFORMANCE INDEX IS ENFORCED. IT DOESN'T PERMIT REVALUATION

	double average_elapsed_time_of_others = 0;
	size_t denominator = 0;

	// COMPUTE AVERAGE ELAPSED TIME
	for (size_t i = 0; i < this->size(); i++)
	{
		shared_ptr<DistributedSystem> system = this->at(i);

		double avg = system->compute_average_elapsed_time();
		if (avg == -1)
			continue;

		average_elapsed_time_of_others += avg;
		denominator++;
	}

	// COMPARE WITH THIS HISTORY'S ELAPSED TIME
	if (denominator != 0)
	{
		// DIVE WITH DENOMINATOR
		average_elapsed_time_of_others /= denominator;

		// DEDUCT NEW PERFORMANCE INDEX BASED ON THE EXECUTION TIME
		//	- SYSTEM'S PERFORMANCE MEANS; HOW FAST THE SYSTEM IS
		//	- ELAPSED TIME IS LOWER, THEN PERFORMANCE IS HIGHER
		double new_performance = average_elapsed_time_of_others / history->computeElapsedTime();

		// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX -> MAXIMUM: 30%
		double ordinary_ratio;
		if (system->history_list_.size() < 2)
			ordinary_ratio = .3;
		else
			ordinary_ratio = min(0.7, 1.0 / (system->history_list_.size() - 1.0));

		// DEFINE NEW PERFORMANCE
		system->setPerformance
		(
			(system->getPerformance() * ordinary_ratio)
			+ (new_performance * (1 - ordinary_ratio))
		);
	}
}

void DistributedSystemArray::_Normalize_performance()
{
	// NORMALIZE SYSTEMS' PERFORMANCE INDEXES
	super::_Normalize_performance();

	// NORMALIZE ROLES' PERFORMANCE INDEXES
	double average = 0;
	size_t denominator = 0;

	for (auto it = process_map_.begin(); it != process_map_.end(); it++)
	{
		auto process = it->second;
		if (process->enforced_ == true)
			continue; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

		average += process->getResource();
		denominator++;
	}
	average /= (double)denominator;

	// DIVIDE FROM THE AVERAGE
	for (auto it = process_map_.begin(); it != process_map_.end(); it++)
	{
		auto process = it->second;
		if (process->enforced_ == true)
			continue; // THE RESOURCE INDEX IS ENFORCED. DO NOT PERMIT REVALUATION

		process->setResource(process->getResource() / average);
	}
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto DistributedSystemArray::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (process_map_.empty() == true)
		return xml;

	shared_ptr<XML> processes_xml(new XML());
	{
		processes_xml->setTag("processes");
		for (auto it = process_map_.begin(); it != process_map_.end(); it++)
			processes_xml->push_back(it->second->toXML());
	}
	xml->push_back(processes_xml);
	return xml;
}