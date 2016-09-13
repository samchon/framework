#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/parallel/ParallelSystemArrayMediator.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class SAMCHON_FRAMEWORK_API DistributedSystemArrayMediator
		: public virtual DistributedSystemArray,
		public virtual parallel::ParallelSystemArrayMediator
	{
	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		DistributedSystemArrayMediator();
		virtual ~DistributedSystemArrayMediator();

	protected:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual auto _Complete_history(std::shared_ptr<InvokeHistory>) -> bool override;
	};
};
};
};