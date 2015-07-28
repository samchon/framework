#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IProtocol.hpp>
#include <samchon/protocol/service/ServiceKeeper.hpp>

#define KEEP_SERVICE_ALIVE auto &ucPair = __keepAlive();

namespace samchon
{
	namespace library
	{
		class XML;
		class SQLi;
	};
	namespace protocol
	{
		namespace service
		{
			class Client;

			class SAMCHON_FRAMEWORK_API Service
				: public IProtocol
			{
			private:
				typedef IProtocol super;

			public:
				virtual auto ID() const -> long = NULL;

			protected:
				Client *client;

			public:
				Service(Client*);
				virtual ~Service() = default;

				virtual auto REQUIRE_AUTHORITY() const -> long = NULL;
				auto getClient() const -> const Client*;
				virtual auto getSQLi() const->library::SQLi*;

			protected:
				auto __keepAlive()->ServiceKeeper;

			public:
				virtual void replyData(std::shared_ptr<Invoke>) = NULL;

				virtual void sendData(std::shared_ptr<Invoke>);
				//virtual void sendData(std::shared_ptr<Invoke>, const std::vector<unsigned char>&);
				virtual void sendError(const long);
			};
		};
	};
};