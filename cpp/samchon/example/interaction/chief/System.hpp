#pragma once
#include <samchon/protocol/ExternalServer.hpp>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace chief
			{
				class System
					: public protocol::ExternalServer
				{
				private:
					typedef protocol::ExternalServer super;

					protocol::IProtocol *parent;

				public:
					System(protocol::IProtocol *parent, const std::string &name, const std::string &ip, int port)
						: super()
					{
						this->parent = parent;
						this->name = name;

						this->ip = ip;
						this->port = port;
					};
					virtual ~System() = default;

				protected:
					virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::ExternalSystemRole* override
					{
						return nullptr;
					};

				public:
					virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
					{
						parent->replyData(invoke);
					};
				};
			};
		};
	};
};