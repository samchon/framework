#pragma once
#include <samchon/protocol/master/ExternalSystemRole.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystem;

			class SAMCHON_FRAMEWORK_API DistributedSystemRole
				: public ExternalSystemRole
			{
			private:
				typedef ExternalSystemRole super;

			protected:
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