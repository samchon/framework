#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystem;
			class DistributedSystemRole;
		};

		class SAMCHON_FRAMEWORK_API DSInvokeHistory
			: public InvokeHistory
		{
		protected:
			typedef InvokeHistory super;

			master::DistributedSystem *system;
			master::DistributedSystemRole *role;

		public:
			DSInvokeHistory(master::DistributedSystem*, master::DistributedSystemRole*);

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};