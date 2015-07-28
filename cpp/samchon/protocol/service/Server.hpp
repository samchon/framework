#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IClient.hpp>
#include <samchon/Map.hpp>
#include <samchon/SmartPointer.hpp>

#include <samchon/String.hpp>

namespace samchon
{
	namespace library
	{
		class SQLi;
		class SQLStatement;
	}
	namespace protocol
	{
		namespace service
		{
			class User;
			class Client;

			class SAMCHON_FRAMEWORK_API Server
				: public Map<std::pair<String, String>, SmartPointer<User>>,
				public IClient
			{
			private:
				typedef Map<std::pair<String, String>, SmartPointer<User>> super;

			protected:
				std::mutex *containerMutex;
				library::SQLi *sqli;

			public:
				Server();
				virtual ~Server();

			protected:
				virtual auto createUser(const std::pair<String, String> &ipPair) const->User* = NULL;
				virtual void addClient(boost::asio::basic_stream_socket<boost::asio::ip::tcp>*);

			private:
				void _addClient(boost::asio::basic_stream_socket<boost::asio::ip::tcp>*);

			public:
				auto getSQLi() const->library::SQLi*;

				void eraseUser(const std::pair<String, String>&);
			};
		};
	};
};