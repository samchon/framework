#include <samchon/protocol/distributed/DSInvokeHistory.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/distributed/DistributedSystem.hpp>
#include <samchon/protocol/distributed/DistributedSystemRole.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::distributed;

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
		DistributedSystemRole *role,
		shared_ptr<Invoke> invoke
	) : super(invoke)
{
	this->system_ = system;
	this->role_ = role;
}

DSInvokeHistory::~DSInvokeHistory()
{
}

void DSInvokeHistory::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	if (xml->hasProperty("role") == false)
	{
		role_ = nullptr;
		return;
	}

	string &role_name = xml->getProperty("role");

	if (system_->getSystemArray()->hasRole(role_name) == true)
		role_ = system_->getSystemArray()->getRole(role_name).get();
	else
		role_ = nullptr;
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto DSInvokeHistory::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (role_ != nullptr)
		xml->setProperty("role", role_->getName());

	return xml;
}