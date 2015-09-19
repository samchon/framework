#pragma once
#include <samchon/API.hpp>

#include <string>
#include <samchon/protocol/Socket.hpp>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief An interface of a server
		 * 
		 * @details Provides methods for opening a server.
		 *
		 * <h3>Example source</h3>
		 * <p> A simple chat server running on console </p>
		 *
		 *	\par examples/console_chat_server/ChatServer.hpp
		 *		@includelineno console_chat_server/ChatServer.hpp
		 *	\par examples/console_chat_server/ChatServer.cpp
		 *		@includelineno console_chat_server/ChatServer.cpp
		 *	\par examples/console_chat_server/ChatClient.hpp
		 *		@includelineno console_chat_server/ChatClient.hpp
		 *	\par examples/console_chat_server/ChatClient.cpp
		 *		@includelineno console_chat_server/ChatClient.cpp
		 *	\par examples/console_chat_server/main.cpp
		 *		@includelineno console_chat_server/main.cpp
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API IServer
		{
		protected:
			/**
			 * @brief An acceptor for clients
			 */
			Acceptor *acceptor;

			/**
			 * @brief (optional) Server's IP
			 */
			virtual auto MY_IP() const -> std::string;

			/**
			 * @brief Port number of the server
			 */
			virtual auto PORT() const -> int = NULL;

		public:
			/**
			 * @brief Default Constructor
			 */
			IServer();
			virtual ~IServer();

			/**
			 * @brief Open the server
			 */
			virtual void open();

			/**
			 * @brief Close the server
			 */
			virtual void close();

		protected:
			/**
			 * @brief Handling connection of a client
			 */
			virtual void addClient(Socket*) = NULL; //ADD_CLIENT
		};
	};
};