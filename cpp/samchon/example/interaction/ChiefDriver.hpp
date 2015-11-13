#pragma once
#include <samchon/protocol/IServer.hpp>
#include <samchon/protocol/IClient.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <mutex>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			/**
			 * @brief A boundary class interacting with a Chief system.
			 * 
			 * @details
			 * <p> ChiefDriver is a boundary class interacting with a chief system as a server. However, the
			 * ChiefDriver represents a weird server that accepts only a client, the chief system. </p>
			 * 
			 * <p> The ChiefDriver is built for providing a guidance for designing a boundary class which is
			 * representing an unusual system within framework of OOD, handling a network system like a
			 * software class of Object-Oriented Design. </p>
			 *
			 * <p> @image html  cpp/example_interaction.png
			 *	   @image latex cpp/example_interaction.png </p>
			 * 
			 * <p> @image html  conception/example_interaction.png
			 *	   @image latex conception/example_interaction.png </p>
			 *
			 * \par [Inherited] IServer
			 *		@copydetails protocol::IServer
			 *					 
			 * \par [Inherited] IClient
			 *		@copydetails protocol::IClient
			 * 
			 * @see protocol
			 * @author Jeongho Nam
			 */
			class ChiefDriver
				: public protocol::IServer,
				public protocol::IClient
			{
			private:
				typedef protocol::IServer super;

			protected:
				/**
				 * @brief A Master object containing the ChiefDriver.
				 */
				protocol::IProtocol *master;

				/**
				 * @brief A port number to open for the Chief system. 
				 */
				int port;

				/**
				 * @brief A mutex for realizing 1:1 server.
				 */
				std::mutex mtx;

			public:
				/**
				 * @brief Construct from master and port number.
				 * 
				 * @param master A master object associated with the chief system.
				 * @param port A port number to open for chief system.
				 */
				ChiefDriver(protocol::IProtocol *master, int port)
					: super(),
					protocol::IClient()
				{
					this->master = master;
					this->port = port;
				};
				virtual ~ChiefDriver() = default;

				virtual void addClient(protocol::Socket *socket) override
				{
					std::unique_lock<std::mutex> uk(mtx);

					this->socket = socket;
					listen();
				};

				virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
				{
					master->replyData(invoke);
				};

			protected:
				virtual auto PORT() const -> int override
				{
					return port;
				};
			};
		};
	};
};