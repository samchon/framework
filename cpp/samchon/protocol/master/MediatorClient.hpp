#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/MediatorSystem.hpp>
#include <samchon/protocol/external/ExternalServer.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class MediatorClient
		: public MediatorSystem,
		public external::ExternalServer
	{
	public:
		MediatorClient(external::ExternalSystemArray *systemArray, const std::string &ip, int port)
			: MediatorSystem(systemArray),
			external::ExternalServer()
		{
			this->ip = ip;
			this->port = port;
		};
		virtual ~MediatorClient() = default;

		virtual void start()
		{
			this->connect();
		};
	};
};
};
};