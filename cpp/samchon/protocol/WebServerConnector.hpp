#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ServerConnector.hpp>
#include <samchon/protocol/IWebClient.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API WebServerConnector
			: public virtual ServerConnector,
			public virtual IWebClient
		{
		public:
			WebServerConnector();
			virtual ~WebServerConnector() = default;

			virtual void connect() override;
		};
	};
};