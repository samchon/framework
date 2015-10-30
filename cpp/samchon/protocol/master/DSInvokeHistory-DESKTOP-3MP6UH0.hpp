#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/InvokeHistory.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystem;
			class DistributedSystemRole;

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
				master::DistributedSystem *system;

				/**
				 * @brief Source role
				 */
				master::DistributedSystemRole *role;

			public:
				/**
				 * @brief Construct from a system and role
				 *
				 * @param system a source system
				 * @param role a source role
				 */
				DSInvokeHistory(master::DistributedSystem*, master::DistributedSystemRole*);

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};