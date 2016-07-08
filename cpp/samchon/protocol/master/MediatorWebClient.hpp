#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/MediatorClient.hpp>

#include <samchon/protocol/WebServerConnector.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class MediatorWebClient
		: public MediatorClient
	{
	public:
		MediatorWebClient(external::ExternalSystemArray *systemArray, const std::string &ip, int port)
			: MediatorClient(systemArray, ip, port)
		{
		};
		virtual ~MediatorWebClient() = default;

	protected:
		virtual auto createServerConnector() -> ServerConnector*
		{
			return new WebServerConnector();
		};
	};
};
};
};