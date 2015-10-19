#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IClient.hpp>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief An interface for a web-client.
		 *
		 * @details
		 * <p> IWebClient is a IClient following web-socket protocol. </p>
		 *
		 * \par [Inherited]
		 *		@copydetails protocol::IClient
		 */
		class SAMCHON_FRAMEWORK_API IWebClient
			: public virtual IClient
		{
		protected:
			typedef IClient super;

		public:
			/**
			 * @brief Default Constructor.
			 */
			IWebClient();
			virtual ~IWebClient() = default;

			virtual void listen() override;

			/**
			 * @brief Send Invoke message following web-socket protocol.
			 *
			 * @param invoke Invoke message to send associated network system.
			 */
			virtual void sendData(std::shared_ptr<Invoke>) override;
		};
	};
};