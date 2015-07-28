#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IProtocol.hpp>

namespace std
{
	class mutex;
};
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
		class Invoke;

		class SAMCHON_FRAMEWORK_API IClient
			: public virtual IProtocol
		{
		protected:
			boost::asio::basic_stream_socket<boost::asio::ip::tcp> *socket;
			std::mutex *sendMtx;

			virtual auto BUFFER_SIZE() const -> size_t;

		public:
			IClient();
			virtual ~IClient();

			virtual void listen();

			virtual void sendData(std::shared_ptr<Invoke>);
		};
	};
};