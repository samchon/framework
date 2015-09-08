#pragma once
#include <samchon\API.hpp>

#include <vector>
#include <memory>

namespace samchon
{
	namespace protocol
	{
		class Invoke;

		/**
		 * @brief Interface of message chain
		 * @details IProtocol is an interface of Invoke message chain.
		 *
		 * @author Jeongho Nam
		 * @see Invoke
		 */
		class SAMCHON_FRAMEWORK_API IProtocol
		{
		public:
			IProtocol();
			virtual ~IProtocol() = default;

			/**
			 * @brief Handling replied message
			 *
			 * @details Handles replied message or shifts the responsibility to chain.
			 * @param invoke Replied invoke message 
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