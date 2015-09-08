#pragma once

namespace boost
{
	/**
	 * @brief Boost.Asio
	 *
	 * @details 
	 * <p> The most famous network commuation library in C++ supporting cross compile between multiple 
	 * operating systems. Samchon Framework have adopted the Boost.Asio in protocol (samchon::protocol) </p>
	 * \li http://www.boost.org/doc/libs/1_59_0/doc/html/boost_asio.html
	 *
	 * @note
	 * <p> In the C++17, standard of network communiation will be established. As that reason, 
	 * network library of the Samchon Framework can be changed in near future. </p>
	 */
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