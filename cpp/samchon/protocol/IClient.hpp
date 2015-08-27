#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IProtocol.hpp>
#include <samchon/protocol/Socket.hpp>

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

		/**
		 * @brief Interface of a client
		 */
		class SAMCHON_FRAMEWORK_API IClient
			: public virtual IProtocol
		{
		protected:
			/**
			 * @brief Socket for network I/O
			 */
			Socket *socket;

			/**
			 * @brief A mutex for ensuring sequence of sending message
			 */
			std::mutex *sendMtx;

			/**
			 * @brief Buffer size of network I/O
			 */
			virtual auto BUFFER_SIZE() const -> size_t;

		public:
			IClient();
			virtual ~IClient();

			/**
			 * @brief Listens message from related system
			 */
			virtual void listen();

			/**
			 * @brief Sends message to related system
			 *
			 * @param invoke Invoke message to send
			 */
			virtual void sendData(std::shared_ptr<Invoke>);
		};
	};
};