#pragma once
#include <samchon/protocol/master/ExternalSystem.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystemArray;
			class DistributedSystemRole;

			/**
			 * @brief A slavery distributed system
			 *
			 * @author Jeongho Nam
			 */
			class SAMCHON_FRAMEWORK_API DistributedSystem
				: public virtual ExternalSystem
			{
			private:
				typedef ExternalSystem super;

			protected:
				/**
				 * @brief Measurement of performance
				 */
				double performance;

			public:
				DistributedSystem(DistributedSystemArray*);
				virtual ~DistributedSystem() = default;

				virtual void construct(std::shared_ptr<library::XML>);

			public:
				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(DistributedSystemRole)

				virtual auto toXML() const -> std::shared_ptr<library::XML>;
			};
		};
	};
};