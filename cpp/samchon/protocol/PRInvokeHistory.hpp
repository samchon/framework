#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ParallelSystem;
		};

		class SAMCHON_FRAMEWORK_API DSInvokeHistory
			: public InvokeHistory
		{
		protected:
			typedef InvokeHistory super;

			master::ParallelSystem *system;

		public:
			DSInvokeHistory(master::ParallelSystem*);

			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};