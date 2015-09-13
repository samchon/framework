#pragma once

namespace boost
{
	namespace asio
	{
		template<class A, class B>
		class basic_stream_socket < A, B >;

		namespace ip
		{
			class tcp;
			template<> class boost::asio::basic_stream_socket<boost::asio::ip::tcp, boost::asio::stream_socket_service<boost::asio::ip::tcp>>;
		};
	};
};