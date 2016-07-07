#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/SlaveSystem.hpp>

namespace samchon
{
namespace protocol
{
	class InvokeHistory;

namespace master
{
	class ParallelSystemArrayMediator;

	class SAMCHON_FRAMEWORK_API ParallelMediator
		: public virtual slave::SlaveSystem
	{
		friend class ParallelSystemArrayMediator;

	private:
		typedef slave::SlaveSystem super;

		ParallelSystemArrayMediator *systemArray;
		HashMap<size_t, std::shared_ptr<InvokeHistory>> progress_list;

	public:
		ParallelMediator(ParallelSystemArrayMediator *systemArray);
		virtual ~ParallelMediator();

		virtual void start() = 0;

		virtual void replyData(std::shared_ptr<Invoke> invoke);

	private:
		void notify_end(size_t uid);
	};
};
};
};