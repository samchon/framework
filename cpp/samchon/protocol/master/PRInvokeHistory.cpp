#include <samchon/protocol/master/PRInvokeHistory.hpp>

#include <samchon/protocol/master/PRMasterHistory.hpp>
#include <samchon/protocol/master/ParallelSystem.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* --------------------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------------------- */
PRInvokeHistory::PRInvokeHistory()
	: super()
{
}
PRInvokeHistory::PRInvokeHistory(PRMasterHistory *masterHistory, ParallelSystem *system, shared_ptr<Invoke> invoke)
	: super(invoke)
{
	this->masterHistory = masterHistory;
	this->system = system;

	index = invoke->get("invoke_history_index")->get_value<size_t>();
	size = invoke->get("invoke_history_size")->get_value<size_t>();
}
void PRInvokeHistory::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	index = xml->get_property<size_t>("index");
	size = xml->get_property<size_t>("size");
}

void PRInvokeHistory::notifyEnd()
{
	masterHistory->notifyEnd();
}

/* --------------------------------------------------------------------
	GETTERS
-------------------------------------------------------------------- */
auto PRInvokeHistory::get_index() const -> size_t
{
	return index;
}
auto PRInvokeHistory::getSize() const -> size_t
{
	return size;
}

auto PRInvokeHistory::calcAverageElapsedTime() const -> double
{
	return calcElapsedTime() / (double)size;
}

/* --------------------------------------------------------------------
	EXPORTERS
-------------------------------------------------------------------- */
auto PRInvokeHistory::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("index", index);
	xml->set_property("size", size);

	return xml;
}