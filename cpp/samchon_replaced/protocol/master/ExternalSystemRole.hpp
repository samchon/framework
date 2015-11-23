#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>
#include <samchon/Set.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystem;

			/**
			 * @brief A role allocated to (a) system(s)
			 */
			class SAMCHON_FRAMEWORK_API ExternalSystemRole
				: public virtual Entity
			{
			private:
				typedef Entity super;

			protected:
				virtual auto TAG() const -> std::string;

				Set<ExternalSystem*> externalSystems;

				/**
				 * @brief Listeners the role has
				 */
				Set<std::string> listeners;

			public:
				/**
				 * @brief Default Constructor
				 */
				ExternalSystemRole();
				virtual ~ExternalSystemRole() = default;
				
				void registerSystem(ExternalSystem*);
				void eraseSystem(ExternalSystem*);

				virtual auto key() const -> std::string = NULL;
				auto getSystems() const -> Set<ExternalSystem*>;
				auto hasListener(const std::string &) const -> bool;
			};
		};
	};
};