#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IClient.hpp>
#include <samchon/protocol/service/ServiceKeeper.hpp>

#include <mutex>
#include <samchon/String.hpp>

#define KEEP_CLIENT_ALIVE auto &ucPair = __keepAlive();

namespace samchon
{
	namespace protocol
	{
		namespace service
		{
			class Server;
			class User;
			class Service;

			class SAMCHON_FRAMEWORK_API Client
				: public IClient
			{
			private:
				typedef IClient super;

			protected:
				User *user; //PARENT
				long no; //PK

				//SERVICE
				Service *service;

			public:
				Client(User*, long, boost::asio::basic_stream_socket<boost::asio::ip::tcp>*);
				virtual ~Client();

				virtual void listen();

			protected:
				virtual auto createService(const String &) const -> Service* = NULL;

				auto __keepAlive() -> ServiceKeeper;

			public:
				//GETTERS
				auto getUser() const -> User*;
				auto getService() const -> Service*;
				auto getNo() const -> long;

			public:
				virtual void replyData(std::shared_ptr<Invoke>);

				virtual void sendData(std::shared_ptr<Invoke>);
				//virtual void sendData(std::shared_ptr<Invoke>, const std::vector<unsigned char>&);
				virtual void sendError(const long);

				// 		protected:
				// 			virtual void archiveReplyDataHistory(std::shared_ptr<Invoke>);

			private:
				void goService(const String &);
			};
		};
	};
};