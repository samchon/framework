#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystemRole.hpp>

#include <samchon/HashMap.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedSystemArray;
	class DistributedSystem;
	class DSInvokeHistory;

	class SAMCHON_FRAMEWORK_API DistributedSystemRole
		: public external::ExternalSystemRole
	{
		friend class DistributedSystem;

	private:
		typedef external::ExternalSystemRole super;

		DistributedSystemArray *system_array_;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> progress_list_;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> history_list_;

	protected:
		double performance;

	public:
		DistributedSystemRole(DistributedSystemArray*);
		virtual ~DistributedSystemRole();

		virtual void sendData(std::shared_ptr<Invoke>) override;

	private:
		void report_history(std::shared_ptr<DSInvokeHistory>);
	};
};
};
};