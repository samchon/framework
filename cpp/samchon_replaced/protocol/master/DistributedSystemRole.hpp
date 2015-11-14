#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/ExternalSystemRole.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystem;

			/**
			 * @brief Role of a slavery distributed system
			 *
			 * @author Jeongho Nam
			 */
			class SAMCHON_FRAMEWORK_API DistributedSystemRole
				: public ExternalSystemRole
			{
			private:
				typedef ExternalSystemRole super;

			protected:
				/** 
				 * @brief Measurement of required resource
				 */
				double performance;

			public:
				//CONSTRUCTORS
				DistributedSystemRole(DistributedSystem* = nullptr);
				virtual ~DistributedSystemRole() = default;

				virtual void construct(std::shared_ptr<library::XML>);

				//SETTER & GETTERS
				void setSystem(DistributedSystem*);
				auto getPerformance() const -> double;

				//EXPORTERS
				virtual auto toXML() const -> std::shared_ptr<library::XML>;
			};
		};
	};
};