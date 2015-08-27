#pragma once

namespace boost
{
	namespace asio
	{
		namespace ip
		{
			class tcp;
			template <typename InternetProtocol> class basic_endpoint;
		};
		class io_service;

		template <typename Protocol> class stream_socket_service;
		template <typename Protocol, typename StreamSocketService = stream_socket_service<Protocol>>
		class basic_stream_socket;
	};
};

namespace samchon
{
	namespace protocol
	{
		typedef boost::asio::basic_stream_socket
			<
				boost::asio::ip::tcp,
				boost::asio::stream_socket_service<boost::asio::ip::tcp>
			> Socket;
	};
};