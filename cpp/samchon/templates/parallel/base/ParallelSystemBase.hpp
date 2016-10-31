#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IProtocol.hpp>

#include <samchon/HashMap.hpp>
#include <samchon/templates/parallel/PRInvokeHistory.hpp>

namespace samchon
{
namespace templates
{
namespace parallel
{
	class ParallelSystem;

namespace base
{
	class ParallelSystemArrayBase;

	class ParallelSystemBase
		: public virtual protocol::IProtocol
	{
		friend class ParallelSystemArrayBase;
		friend class ParallelSystem;

	private:
		HashMap<size_t, std::pair<std::shared_ptr<protocol::Invoke>, std::shared_ptr<InvokeHistory>>> progress_list_;
		HashMap<size_t, std::shared_ptr<InvokeHistory>> history_list_;

		double performance_{ 1.0 };
		bool enforced_{ false };
		bool excluded_{ false };
	};
};
};
};
};