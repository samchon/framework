#include <samchon/templates/distributed/DistributedProcess.hpp>

#include <samchon/templates/distributed/DistributedSystemArray.hpp>
#include <samchon/templates/distributed/DistributedSystem.hpp>

#include <samchon/templates/distributed/DSInvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::distributed;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
DistributedProcess::DistributedProcess(DistributedSystemArray *systemArray)
	: super()
{
	this->system_array_ = systemArray;
	
	resource = 1.0;
	enforced_ = false;
}

DistributedProcess::~DistributedProcess()
{
}

void DistributedProcess::construct(shared_ptr<XML> xml)
{
	name = xml->getProperty<string>("name");
	resource = xml->getProperty<double>("resource");
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
auto DistributedProcess::compute_average_elapsed_time() const -> double
{
	double sum = 0.0;
	
	for (auto it = history_list_.begin(); it != history_list_.end(); it++)
	{
		shared_ptr<DSInvokeHistory> history = it->second;
		double elapsed_time = history->computeElapsedTime() / history->getWeight();

		// THE SYSTEM'S PERFORMANCE IS 5. THE SYSTEM CAN HANDLE A PROCESS VERY QUICKLY
		// AND ELAPSED TIME OF THE PROCESS IS 3 SECONDS
		// THEN I CONSIDER THE ELAPSED TIME AS 15 SECONDS.
		sum += elapsed_time * history->getSystem()->getPerformance();
	}
	return sum / history_list_.size();
}

void DistributedProcess::setResource(double val)
{
	resource = val;
	enforced_ = false;
}

void DistributedProcess::enforceResource(double val)
{
	resource = val;
	enforced_ = true;
}

/* ---------------------------------------------------------
	INVOKE MESSAGE CHAIN
--------------------------------------------------------- */
void DistributedProcess::sendData(shared_ptr<Invoke> invoke, double weight)
{
	if (system_array_->empty() == true)
		return;

	// ADD UID FOR ARCHIVING HISTORY
	size_t uid;
	if (invoke->has("_History_uid") == false)
	{
		// ISSUE UID AND ATTACH IT TO INVOKE'S LAST PARAMETER
		uid = ++system_array_->history_sequence;
		invoke->emplace_back(new InvokeParameter("_History_uid", uid));
	}
	else
	{
		// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
		//	- system_array_ IS A TYPE OF DistributedSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
		//	- A Distributed HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO ANOTHER SLAVE.
		uid = invoke->get("_History_uid")->getValue<size_t>();

		// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
		if (uid > system_array_->history_sequence)
			system_array_->history_sequence = uid;

		// FOR CASE 2. ERASE ORDINARY PROGRESSIVE HISTORY FROM THE DISCONNECTED
		progress_list_.erase(uid);
	}

	// ADD ROLE NAME FOR MEDIATOR
	if (invoke->has("_Process_name") == false)
		invoke->emplace_back(new InvokeParameter("_Process_name", name));

	// FIND THE MOST IDLE SYSTEM
	shared_ptr<DistributedSystem> idle_system;

	for (size_t i = 0; i < system_array_->size(); i++)
	{
		shared_ptr<DistributedSystem> system = system_array_->at(i);
		if (system->excluded_ == true)
			continue; // BEING REMOVED SYSTEM

		if (idle_system == nullptr
			|| system->progress_list_.size() < idle_system->progress_list_.size()
			|| system->getPerformance() < idle_system->getPerformance())
			idle_system = system;
	}

	// ARCHIVE HISTORY ON PROGRESS_LIST (IN SYSTEM AND ROLE AT THE SAME TIME)
	shared_ptr<DSInvokeHistory> history(new DSInvokeHistory(idle_system.get(), this, invoke, weight));

	progress_list_.emplace(uid, history);
	idle_system->progress_list_.emplace(uid, make_pair(invoke, history));

	// SEND DATA
	idle_system->sendData(invoke);
}

void DistributedProcess::report_history(shared_ptr<DSInvokeHistory> history)
{
	// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
	progress_list_.erase(history->getUID());
	history_list_.emplace(history->getUID(), history);
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto DistributedProcess::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);
	xml->setProperty("resource", resource);

	return xml;
}