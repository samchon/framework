#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystemRole.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class DistributedSystem;
	class DSInvokeHistory;

	class SAMCHON_FRAMEWORK_API DistributedSystemRole
		: public external::ExternalSystemRole
	{
		friend class DistributedSystem;

	private:
		typedef external::ExternalSystemRole super;

		std::deque<std::shared_ptr<DistributedSystem>> systems;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> progress_list;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> history_list;

		double performance;

	public:
		DistributedSystemRole();
		virtual ~DistributedSystemRole();

		virtual void sendData(std::shared_ptr<Invoke>) override;

	private:
		void reply_data(std::shared_ptr<Invoke>);
	};
};
};
};