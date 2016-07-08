#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/MediatorServer.hpp>

#include <samchon/protocol/WebServer.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class MediatorWebServer
		: public MediatorServer,
		public virtual WebServer
	{
	public:
		MediatorWebServer(external::ExternalSystemArray *systemArray, int port)
			: MediatorServer(systemArray, port),
			WebServer()
		{
		};
		virtual ~MediatorWebServer() = default;
	};
};
};
};