#pragma once
#include <samchon/API.hpp>

#include <vector>
#include <memory>

namespace samchon
{
	namespace protocol
	{
		class Invoke;

		/**
		 * @brief An interface of Invoke message chain
		 *
		 * @details 
		 * <p> IProtocol is an interface for Invoke message, which is standard message of network I/O 
		 * in Samchon Framework, chain. The IProtocol interface is used to network drivers and some classes
		 * which are in a relationship of chain of responsibility with those network drivers. </p>
		 *
		 * <p> IProtocol is one of the basic 3 + 1 components that can make any type of network system in
		 * Samchon Framework with IServer and IClient. Following the "chain of responsibility" pattern, 
		 * looking around classes in Samchon Framework, you can see all related classes with network I/O 
		 * are implemented from the IProtocol. </p>
		 *
		 * @image html cpp/protocol_interface.png
		 * @image latex cpp/protocol_interface.png
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API IProtocol
		{
		public:
			/**
			 * @brief Default Constructor.
			 */
			IProtocol();
			virtual ~IProtocol() = default;

			/**
			 * @brief Replying message
			 *
			 * @details Handles replied message or shifts the responsibility to chain.
			 * @param invoke Invoke message from other network system
			 */
			virtual void replyData(std::shared_ptr<Invoke>) = NULL;

			/**
			 * @brief Sending message
			 *
			 * @details Sends message to related system or shifts the responsibility to chain.
			 * @param invoke Invoke message to send
			 */
			virtual void sendData(std::shared_ptr<Invoke>) = NULL;
		};
	};
};