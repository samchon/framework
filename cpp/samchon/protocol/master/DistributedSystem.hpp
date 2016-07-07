#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystem.hpp>
#include <samchon/protocol/master/DistributedSystemRole.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class DistributedSystemArray;

	class SAMCHON_FRAMEWORK_API DistributedSystem
		: public virtual external::ExternalSystem
	{
	private:
		typedef external::ExternalSystem super;

	protected:
		DistributedSysmteArray *systemArray;

	private:
		double performance;

	public:
		DistributedSystem(DistributedSysmteArray *systemArray);
		virtual ~DistributedSystem();

	protected:
		virtual auto createChild(std::shared_ptr<library::XML>) -> external::ExternalSystemRole* final;

	public:
		virtual void replyData(std::shared_ptr<Invoke>) override;
	};
};
};
};