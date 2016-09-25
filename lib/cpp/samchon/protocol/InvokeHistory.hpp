#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

#include <samchon/library/Date.hpp>
#include <samchon/protocol/Invoke.hpp>

namespace samchon
{
namespace protocol
{
	class SAMCHON_FRAMEWORK_API InvokeHistory 
		: public Entity<size_t>
	{
	private:
		typedef Entity<size_t> super;

	private:
		size_t uid_;

		std::string listener_;
		library::Date start_time_;
		library::Date end_time_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		InvokeHistory();
		InvokeHistory(std::shared_ptr<Invoke> invoke);

		virtual ~InvokeHistory();

		virtual void construct(std::shared_ptr<library::XML> xml) override;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		virtual auto key() const -> size_t override
		{
			return uid_;
		};

		auto getUID() const -> size_t
		{
			return uid_;
		};

		auto getListener() const -> std::string
		{
			return listener_;
		};

		auto computeElapsedTime() const -> long long;

		void complete();

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string;

		virtual auto toXML() const -> std::shared_ptr<library::XML> override;

		auto toInvoke() const -> std::shared_ptr<Invoke>;
	};
};
};