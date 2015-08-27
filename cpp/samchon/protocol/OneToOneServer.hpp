#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IServer.hpp>
#include <samchon/protocol/IClient.hpp>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief A server accepts only a client
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API OneToOneServer
			: public virtual IServer, 
			public virtual IClient
		{
		public:
			/**
			 * @brief Default Constructor
			 */
			OneToOneServer();
			virtual ~OneToOneServer() = default;

		protected:
			virtual void addClient(Socket*); //LISTEN
		};
	};
};