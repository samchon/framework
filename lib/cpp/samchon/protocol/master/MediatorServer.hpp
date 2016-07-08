#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/MediatorSystem.hpp>
#include <samchon/protocol/Server.hpp>

#include <samchon/protocol/ClientDriver.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class MediatorServer
		: public MediatorSystem,
		public virtual Server
	{
	protected:
		int port;

	public:
		MediatorServer(external::ExternalSystemArray *systemArray, int port)
			: MediatorSystem(systemArray)
		{
			this->port = port;
		};
		virtual ~MediatorServer() = default;

		virtual void start()
		{
			this->open(this->port);
		};

	protected:
		virtual void addClient(std::shared_ptr<ClientDriver> driver) override final
		{
			this->communicator = driver;
			this->communicator->listen(this);
		};
	};
};
};
};