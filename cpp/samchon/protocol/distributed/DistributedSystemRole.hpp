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
		friend class DistributedSystemArray;
		friend class DistributedSystem;

	private:
		typedef external::ExternalSystemRole super;

		DistributedSystemArray *system_array_;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> progress_list_;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> history_list_;

	protected:
		double resource;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		DistributedSystemRole(DistributedSystemArray*);
		virtual ~DistributedSystemRole();

		virtual void construct(std::shared_ptr<library::XML>) override;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto getSystemArray() const -> DistributedSystemArray*
		{
			return system_array_;
		};
		auto getResource() const -> double
		{
			return resource;
		};

		void setResource(double val)
		{
			resource = val;
		};

	private:
		auto compute_average_elapsed_time() const -> double;

	public:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual void sendData(std::shared_ptr<Invoke>) override;

	private:
		void report_history(std::shared_ptr<DSInvokeHistory>);

	public:
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};