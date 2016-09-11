#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class MediatorSystem;

	class SAMCHON_FRAMEWORK_API ParallelSystemArrayMediator
		: public virtual ParallelSystemArray
	{
	private:
		typedef ParallelSystemArray super;

		std::unique_ptr<MediatorSystem> mediator_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * @brief Default Constructor.
		 */
		ParallelSystemArrayMediator();

		virtual ~ParallelSystemArrayMediator();

	protected:
		virtual auto createMediator() -> MediatorSystem* = 0;

		virtual void startMediator();

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getMediator() const -> MediatorSystem*
		{
			return mediator_.get();
		};

	protected:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual auto _Complete_history(std::shared_ptr<InvokeHistory>) -> bool override;
	};
};
};
};