#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystem.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystemArray;
			class DSInvokeHistoryList;
			class DSRoleHistoryList;

			class SAMCHON_FRAMEWORK_API DistributedSystem
				: protected virtual ExternalSystem
			{
			protected:
				typedef ExternalSystem super;

				DistributedSystemArray *master;
				double performance;
				size_t process;

				DSRoleHistoryList *historyList;
				DSInvokeHistoryList *invokeHistoryList;

			public:
				/* ------------------------------------------------------------------
					CONSTRUCTORS
				------------------------------------------------------------------ */
				DistributedSystem();
				virtual ~DistributedSystem() = default;

				virtual void construct(std::shared_ptr<library::XML>) override;

				/* ------------------------------------------------------------------
					CHAIN OF INVOKE MESSAGE
				------------------------------------------------------------------ */
				virtual void sendData(std::shared_ptr<Invoke>) override;
				virtual void replyData(std::shared_ptr<Invoke>) override;

				/* ------------------------------------------------------------------
					EXPORTERS
				------------------------------------------------------------------ */
				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};