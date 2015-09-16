#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IClient.hpp>

#include <string>

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
			EndPoint *endPoint;

			/**
			 * 
			 */
			EndPoint *localEndPoint;

			/**
			 * @brief Destinatio IP
			 */
			virtual auto IP() const -> std::string = NULL;

			/**
			 * @brief Destination port
			 */
			virtual auto PORT() const -> int = NULL;

			/**
			 * @brief (optional) My IP, if you want to bind
			 */
			virtual auto MY_IP() const -> std::string;

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