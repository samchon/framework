#include <samchon/templates/distributed/DSInvokeHistory.hpp>

#include <samchon/templates/distributed/DistributedSystemArray.hpp>
#include <samchon/templates/distributed/DistributedSystem.hpp>
#include <samchon/templates/distributed/DistributedProcess.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::templates::distributed;

/* ---------------------------------------------------------
CONSTRUCTORS
--------------------------------------------------------- */
DSInvokeHistory::DSInvokeHistory(DistributedSystem *system)
	: super()
{
	this->system_ = system;
}

DSInvokeHistory::DSInvokeHistory
	(
		DistributedSystem *system, 
		DistributedProcess *process,
		shared_ptr<Invoke> invoke,
		double weight
	) : super(invoke)
{
	this->system_ = system;
	this->process_ = process;
	this->weight_ = weight;
}

DSInvokeHistory::~DSInvokeHistory()
{
}

void DSInvokeHistory::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if (xml->hasProperty("process") == false)
	{
		process_ = nullptr;
		return;
	}

	string &role_name = xml->getProperty("process");

	if (system_->getSystemArray()->hasRole(role_name) == true)
		process_ = system_->getSystemArray()->getProcess(role_name).get();
	else
		process_ = nullptr;
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto DSInvokeHistory::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (process_ != nullptr)
		xml->setProperty("process", process_->getName());

	return xml;
}