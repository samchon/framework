#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/MasterSystem.hpp>
#include <samchon/protocol/IListener.hpp>

#include <samchon/HashMap.hpp>

namespace samchon
{
namespace protocol
{
	class InvokeHistory;

namespace parallel
{
	class ParallelSystemArrayMediator;

	class SAMCHON_FRAMEWORK_API MasterSystem
		: public slave::MasterSystem,
		public IListener
	{
	private:
		typedef slave::MasterSystem super;

		ParallelSystemArrayMediator *mediator_;
		HashMap<size_t, std::shared_ptr<InvokeHistory>> progress_list_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		MasterSystem(ParallelSystemArrayMediator*);
		virtual ~MasterSystem();

		virtual void start() = 0;

	private:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		void notify_end(size_t uid);

		virtual void _replyData(std::shared_ptr<Invoke>) override;

	public:
		virtual void replyData(std::shared_ptr<Invoke>) override;
	};
};
};
};