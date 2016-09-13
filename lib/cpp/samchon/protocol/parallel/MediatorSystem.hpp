#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/SlaveSystem.hpp>
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

	class SAMCHON_FRAMEWORK_API MediatorSystem
		: public virtual slave::SlaveSystem,
		public virtual IListener
	{
	private:
		typedef slave::SlaveSystem super;

		ParallelSystemArrayMediator *system_array_;
		HashMap<size_t, std::shared_ptr<InvokeHistory>> progress_list_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		MediatorSystem(ParallelSystemArrayMediator*);
		virtual ~MediatorSystem();

		virtual void start() = 0;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getSystemArray() const -> ParallelSystemArrayMediator*
		{
			return system_array_;
		};

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		void _Complete_history(size_t uid);

	private:
		virtual void _replyData(std::shared_ptr<Invoke>) override;

	public:
		virtual void replyData(std::shared_ptr<Invoke>) override;
	};
};
};
};