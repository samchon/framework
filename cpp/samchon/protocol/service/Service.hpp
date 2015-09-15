#pragma once

#include <samchon/protocol/IProtocol.hpp>

#include <string>
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

			/**
			 * @brief Service
			 */
			class  Service
				: public IProtocol
			{
				friend class Client;

			private:
				typedef IProtocol super;

			protected:
				/**
				 * @brief Name of the service
				 */
				virtual auto NAME() const -> std::string = NULL;

				/**
				 * @brief Required authority to access the service
				 */
				virtual auto REQUIRE_AUTHORITY() const -> int = NULL;
				
			private:
				/**
				 * @brief Client object Service is belonged to
				 */
				Client *client;

			public:
				/**
				 * @brief Construct from Client
				 *
				 * @param client Client object Service is belonged to
				 */
				Service(Client*);
				virtual ~Service() = default;
				
				/**
				 * @brief Get Client
				 */
				auto getClient() const -> Client*;
				
			protected:
				auto __keepAlive() -> ServiceKeeper;

			public:
				/**
				 * @brief Shift the responsibility of sending an Invoke message to Client
				 *
				 * @param in An Invoke message to be sent to the (physical) client
				 */
				virtual void sendData(std::shared_ptr<Invoke>);
			};
		};
	};
};