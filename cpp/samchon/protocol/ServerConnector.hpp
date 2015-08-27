#pragma once
#include <samchon/protocol/IClient.hpp>

#include <samchon/String.hpp>

namespace boost
{
	namespace asio
	{
		namespace ip
		{
			template <typename InternetProtocol> class basic_endpoint;
		};
		class io_service;
	};
};
namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief Server connector for client
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API ServerConnector
			: public virtual IClient
		{
		private:
			typedef IClient super;

		protected:
			/**
			 * 
			 */
			boost::asio::io_service *ioService;

			/**
			 * 
			 */
			boost::asio::ip::basic_endpoint<boost::asio::ip::tcp> *endPoint;

			/**
			 * 
			 */
			boost::asio::ip::basic_endpoint<boost::asio::ip::tcp> *localEndPoint;

			/**
			 * @brief Destinatio IP
			 */
			virtual auto IP() const -> String = NULL;

			/**
			 * @brief Destination port
			 */
			virtual auto PORT() const -> int = NULL;

			/**
			 * @brief (optional) My IP, if you want to bind
			 */
			virtual auto MY_IP() const -> String;

		public:
			/**
			 * @brief Default Constructor
			 */
			ServerConnector();
			virtual ~ServerConnector();

			/**
			 * @brief Connect to the server
			 */
			virtual void connect();
		};
	};
};