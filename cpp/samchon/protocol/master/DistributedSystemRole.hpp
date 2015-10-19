#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemRole.hpp>

#include <set>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystemArray;
			class DistributedSystem;

			class DSInvokeHistoryList;
			class DSRoleHistoryList;

			/**
			 * @brief A role of distributed processing system
			 *
			 * @details
			 * <p> DistributedSystemRole is an ExternalSystemRole allocates for distributed processing 
			 * system(s). Unlike the ExternalSystemRole, DistributedSystemRole can belonged to multiple
			 * DistributedSystem(s). </p>
			 *
			 * <p> @image html  cpp/protocol_master_distributed_system.png
			 * @image latex cpp/protocol_master_distributed_system.png </p>
			 *
			 * \par [Inherited]
			 *		@copydetails protocol::ExternalSystemRole
			 */
			class SAMCHON_FRAMEWORK_API DistributedSystemRole
				: public ExternalSystemRole
			{
				friend class DistributedSystemArray;

			protected:
				typedef ExternalSystemRole super;

				/**
				 * @brief Allocated systems of about the role, at now.
				 */
				std::set<DistributedSystem*> allocatedSystems;

				/**
				 * @brief A required performance index
				 */
				double performance;

				/**
				 * @brief A history log for archiving role allocation to a system.
				 */
				DSRoleHistoryList *allocationHistoryList;

				/**
				 * @brief A history log for archiving elapsed time for each process.
				 */
				DSInvokeHistoryList *invokeHistoryList;

			public:
				/* ------------------------------------------------------------------
					CONSTRUCTORS
				------------------------------------------------------------------ */
				/**
				 * @brief Default Constructor.
				 */
				DistributedSystemRole();
				virtual ~DistributedSystemRole() = default;

				/* ------------------------------------------------------------------
					GETTERS
				------------------------------------------------------------------ */
				/**
				 * @brief Get an external system -> depreciated
				 *
				 * @details
				 * <p> Unlike ExternalSysemRole, DistributedSystemRole can be belonged to multiple 
				 * DistributedSystem(s). By that reason, the getSystem(), a getter of a single ExternalSystem
				 * is depreciated. </p>
				 */
				auto getSystem() const -> ExternalSystem* = delete;

				/**
				 * @brief Get performance
				 */
				auto getPerformance() const -> double;

				/**
				 * @brief Get allocation histories
				 */
				auto getAllocationHistoryList() const -> DSRoleHistoryList*;

				/**
				 * @brief Get invoke histories
				 */
				auto getInvokeHistoryList() const -> DSInvokeHistoryList*;

				/* ------------------------------------------------------------------
					CHAIN OF INVOKE MESSAGE
				------------------------------------------------------------------ */
				virtual void sendData(std::shared_ptr<Invoke>) override;

				/* ------------------------------------------------------------------
					EXPORTERS
				------------------------------------------------------------------ */
				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};