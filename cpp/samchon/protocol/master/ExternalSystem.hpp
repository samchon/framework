#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystemArray;
			class ExternalSystemRole;

			class SAMCHON_FRAMEWORK_API ExternalSystem
				: public virtual SharedEntityArray,
				public virtual IProtocol
			{
			private:
				typedef SharedEntityArray super;

			protected:
				virtual auto TAG() const -> String;
				virtual auto CHILD_TAG() const -> String;

				String ip;
				String myIP; //OPTIONAL
				int port;

			protected:
				ExternalSystemArray *systemArray;

			public:
				ExternalSystem(ExternalSystemArray* = nullptr);
				virtual ~ExternalSystem() = default;

				virtual void start() = NULL;

				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalSystemRole)
				auto getSystemArray() const->ExternalSystemArray*;
				auto getIP() const->String;
				auto getPort() const -> int;

			public:
				virtual void replyData(std::shared_ptr<Invoke>);

				virtual auto toXML() const -> std::shared_ptr<library::XML>;
			};
		};
	};
};