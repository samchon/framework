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
		friend class DistributedSystemArray;

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
		auto compute_average_elapsed_time() const -> double;

	public:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual void replyData(std::shared_ptr<Invoke>) override;

	protected:
		virtual void _Report_history(std::shared_ptr<library::XML>) override;
	};
};
};
};