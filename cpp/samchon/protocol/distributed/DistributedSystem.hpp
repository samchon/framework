#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystem.hpp>
#	include <samchon/protocol/distributed/DistributedSystemRole.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedSystemArray;

	class SAMCHON_FRAMEWORK_API DistributedSystem
		: public virtual parallel::ParallelSystem
	{
	private:
		typedef parallel::ParallelSystem super;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		using super::super;
		virtual ~DistributedSystem();

	protected:
		virtual auto createChild(std::shared_ptr<library::XML>) -> external::ExternalSystemRole* override
		{
			return nullptr;
		};

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getSystemArray() const -> DistributedSystemArray*;

	private:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual void _Report_history(std::shared_ptr<library::XML>);
	};
};
};
};