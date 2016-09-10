#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

#include <samchon/library/Date.hpp>
#include <samchon/protocol/Invoke.hpp>

namespace samchon
{
namespace protocol
{
	class InvokeHistory : public Entity
	{
	private:
		typedef Entity super;

	private:
		size_t uid_;

		std::string listener_;

		library::Date start_time_;

		library::Date end_time_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		InvokeHistory() : super()
		{
		};

		InvokeHistory(std::shared_ptr<Invoke> invoke) : super()
		{
			uid_ = invoke->get("invoke_history_uid")->getValue<size_t>();
			listener_ = invoke->getListener();

			start_time_ = std::chrono::system_clock::now();
		};

		virtual ~InvokeHistory() = default;

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			// UID AND LISTENER
			uid_ = xml->getProperty<size_t>("uid");
			listener_ = xml->getProperty("listener");

			// START AND END TIME
			start_time_ = std::chrono::system_clock::from_time_t(0);
			end_time_ = std::chrono::system_clock::from_time_t(0);

			start_time_ += std::chrono::duration<long long, std::ratio_multiply<std::ratio<100i64, 1i64>, std::nano>>(xml->getProperty<long long>("startTime"));
			end_time_ += std::chrono::duration<long long, std::ratio_multiply<std::ratio<100i64, 1i64>, std::nano>>(xml->getProperty<long long>("endTime"));
		};

		void notifyEnd()
		{
			end_time_ = std::chrono::system_clock::now();
		};

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getUID() const -> size_t
		{
			return uid_;
		};

		auto getListener() const -> std::string
		{
			return listener_;
		};

		auto getStartTime() const -> library::Date
		{
			return start_time_;
		};

		auto getEndTime() const -> library::Date
		{
			return end_time_;
		};

		auto computeElapsedTime() const -> long long
		{
			return (end_time_ - start_time_).count();
		};

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string
		{
			return "invokeHistory";
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML>
		{
			std::shared_ptr<library::XML> &xml = super::toXML();
			xml->setProperty("uid", uid_);
			xml->setProperty("listener", listener_);
			xml->setProperty("startTime", start_time_.time_since_epoch().count());
			xml->setProperty("endTime", end_time_.time_since_epoch().count());

			return xml;
		};

		virtual auto toInvoke() const -> std::shared_ptr<Invoke>
		{
			return std::make_shared<Invoke>("_Report_history", this->toXML());
		};
	};
};
};