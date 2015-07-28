#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IServer.hpp>
#include <samchon/protocol/IClient.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API OneToOneServer
			: public virtual IServer, 
			public virtual IClient
		{
		public:
			OneToOneServer();
			virtual ~OneToOneServer() = default;

		protected:
			virtual void addClient(boost::asio::basic_stream_socket<boost::asio::ip::tcp>*); //LISTEN
		};
	};
};