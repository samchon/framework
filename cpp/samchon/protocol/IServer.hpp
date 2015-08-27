#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>
#include <samchon/protocol/Socket.hpp>

namespace boost
{
	namespace asio
	{
		template <typename Protocol> class socket_acceptor_service;
		template <typename Protocol, typename SocketAcceptorService = socket_acceptor_service<Protocol>>
		class basic_socket_acceptor;
	};
};
namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief Interface of a server
		 * 
		 * @details
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API IServer
		{
		protected:
			boost::asio::basic_socket_acceptor<boost::asio::ip::tcp> *acceptor;

			/**
			 * @brief (optional) Server's IP
			 */
			virtual auto MY_IP() const -> String;

			/**
			 * @brief Port number of the server
			 */
			virtual auto PORT() const -> int = NULL;

		public:
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
			 * @brief Handling a connection of a client
			 */
			virtual void addClient(Socket*) = NULL; //ADD_CLIENT
		};
	};
};