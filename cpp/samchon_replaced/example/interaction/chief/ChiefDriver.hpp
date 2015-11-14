#pragma once
#include <samchon/protocol/IServer.hpp>
#include <samchon/protocol/IClient.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <mutex>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			namespace chief
			{
				class ChiefDriver
					: public protocol::IServer,
					public protocol::IClient
				{
				private:
					typedef protocol::IServer super;

				protected:
					protocol::IProtocol *parent;
					int port;

					std::mutex mtx;

				public:
					ChiefDriver(protocol::IProtocol *parent, int port)
						: super(),
						protocol::IClient()
					{
						this->parent = parent;
						this->port = port;
					};
					virtual ~ChiefDriver() = default;

					virtual void addClient(protocol::Socket *socket) override
					{
						std::unique_lock<std::mutex> uk(mtx);

						this->socket = socket;
						listen();
					};

					virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
					{
						parent->replyData(invoke);
					};

				protected:
					virtual auto PORT() const -> int override
					{
						return port;
					};
				};
			};
		};
	};
};