#pragma once
#include <samchon/protocol/master/ExternalSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class DistributedSystem;
			class DistributedSystemRole;

			class SAMCHON_FRAMEWORK_API DistributedSystemArray
				: public virtual ExternalSystemArray
			{
			private:
				typedef ExternalSystemArray super;

			public:
				DistributedSystemArray(IProtocol*);
				virtual ~DistributedSystemArray() = default;

			public:
				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(DistributedSystem)

					virtual void distributeRoles();
			};
		};
	};
};