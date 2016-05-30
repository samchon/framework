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
	this->uid = invoke->get("invoke_history_uid")->getValue<size_t>();
	this->listener = invoke->getListener();

	this->startTime = chrono::system_clock::now();
}

void InvokeHistory::construct(shared_ptr<XML> xml)
{
	this->uid = xml->getProperty<size_t>("uid");
	this->listener = xml->getProperty("listener");

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
		>(xml->getProperty<long long>("startTime"));

	endTime +=
		chrono::duration
		<
			long long, 
			ratio_multiply
			<
				ratio<100i64, 1i64>, 
				nano
			>
		>(xml->getProperty<long long>("endTime"));
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
auto InvokeHistory::getListener() const -> string
{
	return listener;
}
auto InvokeHistory::getStartTime() const -> Date
{
	return startTime;
}
auto InvokeHistory::getEndTime() const -> Date
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

auto InvokeHistory::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	
	xml->setProperty("uid", uid);
	xml->setProperty("listener", listener);
	xml->setProperty("startTime", startTime.time_since_epoch().count());
	xml->setProperty("endTime", endTime.time_since_epoch().count());
	
	return xml;
}
auto InvokeHistory::toInvoke() const -> shared_ptr<Invoke>
{
	return shared_ptr<Invoke>(new Invoke("reportInvokeHistory", toXML()));
}