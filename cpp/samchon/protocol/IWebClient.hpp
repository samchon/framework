#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IClient.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API IWebClient
			: public virtual IClient
		{
		protected:
			typedef IClient super;

		public:
			IWebClient();
			virtual ~IWebClient() = default;

			virtual void listen() override;
			virtual void sendData(std::shared_ptr<Invoke>) override;
		};
	};
};