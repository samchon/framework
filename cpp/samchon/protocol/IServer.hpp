#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>

namespace boost
{
	namespace asio
	{
		namespace ip
		{
			class tcp;
		};
		template <typename Protocol> class stream_socket_service;
		template <typename Protocol, typename StreamSocketService = stream_socket_service<Protocol>>
		class basic_stream_socket;

		template <typename Protocol> class socket_acceptor_service;
		template <typename Protocol, typename SocketAcceptorService = socket_acceptor_service<Protocol>>
		class basic_socket_acceptor;
	};
};
namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API IServer
		{
		protected:
			boost::asio::basic_socket_acceptor<boost::asio::ip::tcp> *acceptor;

			virtual auto MY_IP() const -> String;
			virtual auto PORT() const -> int = NULL;

		public:
			IServer();
			virtual ~IServer();

			virtual void open();
			virtual void close();

		protected:
			virtual void addClient(boost::asio::basic_stream_socket<boost::asio::ip::tcp>*) = NULL; //ADD_CLIENT
		};
	};
};