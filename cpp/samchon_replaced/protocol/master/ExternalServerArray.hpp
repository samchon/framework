#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/ExternalSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalServer;

			class SAMCHON_FRAMEWORK_API ExternalServerArray
				: public virtual ExternalSystemArray
			{
				//External Systems are Servers
				//And I'm a Client for them
			public:
				ExternalServerArray(IProtocol*);
				virtual ~ExternalServerArray() = default;

				virtual void start();
				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalServer)

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> Entity*;
			};
		};
	};
};