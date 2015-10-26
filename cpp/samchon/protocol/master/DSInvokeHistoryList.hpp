#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityList.hpp>
#include <samchon/protocol/master/DSInvokeHistory.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			/**
			 * @brief A list of DSInvokeHistory.
			 *
			 * @author Jeongho Nam
			 */
			class SAMCHON_FRAMEWORK_API DSInvokeHistoryList
				: public SharedEntityList<DSInvokeHistory>
			{
			protected:
				typedef SharedEntityList<DSInvokeHistory> super;

			public:
				/**
				 * @brief Default Constructor.
				 */
				DSInvokeHistoryList();
				virtual ~DSInvokeHistoryList() = default;

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> DSInvokeHistory* override;
			};
		};
	};
};