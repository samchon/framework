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
		class SAMCHON_FRAMEWORK_API IServerConnector
			: public virtual IClient
		{
		private:
			typedef IClient super;

		protected:
			boost::asio::io_service *ioService;
			boost::asio::ip::basic_endpoint<boost::asio::ip::tcp> *endPoint;
			boost::asio::ip::basic_endpoint<boost::asio::ip::tcp> *localEndPoint;

			virtual auto IP() const -> String = NULL;
			virtual auto PORT() const -> int = NULL;

			virtual auto MY_IP() const -> String;

		public:
			IServerConnector();
			virtual ~IServerConnector();

			virtual void connect();
		};
	};
};