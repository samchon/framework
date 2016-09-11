#include <samchon/protocol/InvokeHistory.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
InvokeHistory::InvokeHistory()
	: super()
{
}

InvokeHistory::InvokeHistory(shared_ptr<Invoke> invoke)
	: super()
{
	uid_ = invoke->get("_History_uid")->getValue<size_t>();
	listener_ = invoke->getListener();

	start_time_ = std::chrono::system_clock::now();
}

InvokeHistory::~InvokeHistory()
{
}

void InvokeHistory::construct(shared_ptr<XML> xml)
{
	// UID AND LISTENER
	uid_ = xml->getProperty<size_t>("uid");
	listener_ = xml->getProperty("listener");

	//--------
	// START AND END TIME
	//--------
	// INIT TIMES TO DEFAULT (0; 1970-01-01 09:00:00
	start_time_ = std::chrono::system_clock::from_time_t(0);
	end_time_ = std::chrono::system_clock::from_time_t(0);

	// ADD NUMBERS WHO REPRESENT LINUX_TIME
	start_time_ += std::chrono::duration<long long, std::ratio_multiply<std::ratio<100i64, 1i64>, std::nano>>(xml->getProperty<long long>("startTime"));
	end_time_ += std::chrono::duration<long long, std::ratio_multiply<std::ratio<100i64, 1i64>, std::nano>>(xml->getProperty<long long>("endTime"));
}

/* ---------------------------------------------------------
	ACCESSORS
--------------------------------------------------------- */
auto InvokeHistory::computeElapsedTime() const -> long long
{
	return (end_time_ - start_time_).count();
}

void InvokeHistory::complete()
{
	end_time_ = std::chrono::system_clock::now();
}

/* ---------------------------------------------------------
	EXPORTERS
--------------------------------------------------------- */
auto InvokeHistory::TAG() const -> string
{
	return "history";
}

auto InvokeHistory::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("uid", uid_);
	xml->setProperty("listener", listener_);

	xml->setProperty("startTime", start_time_.time_since_epoch().count());
	xml->setProperty("endTime", end_time_.time_since_epoch().count());

	return xml;
}

auto InvokeHistory::toInvoke() const -> shared_ptr<Invoke>
{
	return make_shared<Invoke>("_Report_history", toXML());
}