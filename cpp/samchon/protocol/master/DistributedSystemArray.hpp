#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>

#include <samchon/Dictionary.hpp>
#include <samchon/library/RWMutex.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystemRole;

			class DSInvokeHistoryList;
			class DSRoleHistoryList;

			/**
			 * 
			 *
			 * @author Jeongho Nam
			 */
			class SAMCHON_FRAMEWORK_API DistributedSystemArray
				: public virtual ExternalSystemArray
			{
			protected:
				typedef ExternalSystemArray super;

				Dictionary<std::shared_ptr<DistributedSystemRole>> roleDictionary;
				library::RWMutex mtx;

				/* ------------------------------------------------------------------
					PARAMETERS OF GENETIC ALGORITHM
				------------------------------------------------------------------ */
				size_t generation;
				size_t population;
				double mutationRate;

			public:
				DistributedSystemArray();
				virtual ~DistributedSystemArray() = default;

				virtual void construct(std::shared_ptr<library::XML>) override;
				virtual void start() override;

			protected:
				virtual auto createRole() -> DistributedSystemRole* = 0;
				virtual void allocateRoles();

			public:
				auto hasRole(const std::string &) const -> bool;
				auto getRole(const std::string &) const -> std::shared_ptr<DistributedSystemRole>;

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};