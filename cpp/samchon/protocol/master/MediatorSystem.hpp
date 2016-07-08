#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/SlaveSystem.hpp>

namespace samchon
{
namespace protocol
{
	class InvokeHistory;

namespace external
{
	class ExternalSystemArray;
};
namespace master
{
	class SAMCHON_FRAMEWORK_API MediatorSystem
		: public virtual slave::SlaveSystem
	{
	private:
		typedef slave::SlaveSystem super;

		external::ExternalSystemArray *system_array;
		HashMap<size_t, std::shared_ptr<InvokeHistory>> progress_list;

	public:
		MediatorSystem(external::ExternalSystemArray *systemArray);
		virtual ~MediatorSystem();

		virtual void start() = 0;

		void notifyEnd(size_t uid);
	};
};
};
};