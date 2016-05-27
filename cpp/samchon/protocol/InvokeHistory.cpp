#include <samchon/protocol/InvokeHistory.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* -----------------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------------- */
InvokeHistory::InvokeHistory()
	: super()
{
}
InvokeHistory::InvokeHistory(shared_ptr<Invoke> invoke)
	: super()
{
	this->uid = invoke->get("invoke_history_uid")->get_value<size_t>();
	this->listener = invoke->get_listener();

	this->startTime = chrono::system_clock::now();
}

void InvokeHistory::construct(shared_ptr<XML> xml)
{
	this->uid = xml->get_property<size_t>("uid");
	this->listener = xml->get_property("listener");

	startTime = chrono::system_clock::from_time_t(0);
	endTime = chrono::system_clock::from_time_t(0);

	startTime += 
		chrono::duration
		<
			long long, 
			ratio_multiply
			<
				ratio<100i64, 1i64>, 
				nano
			>
		>(xml->get_property<long long>("startTime"));

	endTime +=
		chrono::duration
		<
			long long, 
			ratio_multiply
			<
				ratio<100i64, 1i64>, 
				nano
			>
		>(xml->get_property<long long>("endTime"));
}
void InvokeHistory::notifyEnd()
{
	endTime = chrono::system_clock::now();
}

/* -----------------------------------------------------------------
	GETTERS
----------------------------------------------------------------- */
auto InvokeHistory::key() const -> string
{
	return to_string(uid);
}

auto InvokeHistory::getUID() const -> size_t
{
	return uid;
}
auto InvokeHistory::get_listener() const -> string
{
	return listener;
}
auto InvokeHistory::getStartTime() const -> Datetime
{
	return startTime;
}
auto InvokeHistory::getEndTime() const -> Datetime
{
	return endTime;
}

auto InvokeHistory::calcElapsedTime() const -> long long
{
	return (endTime - startTime).count();
}

/* -----------------------------------------------------------------
	EXPORTERS
----------------------------------------------------------------- */
auto InvokeHistory::TAG() const -> string
{
	return "invokeHistory";
}

auto InvokeHistory::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	
	xml->set_property("uid", uid);
	xml->set_property("listener", listener);
	xml->set_property("startTime", startTime.time_since_epoch().count());
	xml->set_property("endTime", endTime.time_since_epoch().count());
	
	return xml;
}
auto InvokeHistory::toInvoke() const -> shared_ptr<Invoke>
{
	return shared_ptr<Invoke>(new Invoke("reportInvokeHistory", to_XML()));
}