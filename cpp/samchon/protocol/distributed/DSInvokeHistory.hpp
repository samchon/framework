#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedSystem;
	class DistributedSystemRole;

	class SAMCHON_FRAMEWORK_API DSInvokeHistory
		: public InvokeHistory
	{
	private:
		typedef InvokeHistory super;

		DistributedSystem *system_;
		DistributedSystemRole *role_;

	public:
		DSInvokeHistory(DistributedSystem*);
		DSInvokeHistory(DistributedSystem*, DistributedSystemRole*, std::shared_ptr<Invoke>);
		virtual ~DSInvokeHistory();

		virtual void construct(std::shared_ptr<library::XML>) override;

		auto getSystem() const -> DistributedSystem*
		{
			return system_;
		};
		auto getRole() const -> DistributedSystemRole*
		{
			return role_;
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};