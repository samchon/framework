#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/InvokeHistory.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ParallelSystem;

			/**
			 * @brief A reported history of an Invoke message
			 *
			 * @details
			 * \par Inherited
			 *		@copydoc protocol::InvokeHistory
			 */
			class SAMCHON_FRAMEWORK_API DSInvokeHistory
				: public slave::InvokeHistory
			{
			protected:
				typedef slave::InvokeHistory super;

				/**
				 * @brief Source system
				 */
				master::ParallelSystem *system;

			public:
				/**
				 * @brief Construct from a system
				 */
				DSInvokeHistory(master::ParallelSystem*);

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};