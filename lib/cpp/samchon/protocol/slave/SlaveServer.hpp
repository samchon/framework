#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/SlaveSystem.hpp>
#include <samchon/protocol/Server.hpp>

namespace samchon
{
namespace protocol
{
namespace slave
{
	class SlaveServer
		: public virtual SlaveSystem,
		public virtual Server

	{
	public:
		SlaveServer();
		virtual ~SlaveServer();

	protected:
		virtual void addClient(std::shared_ptr<ClientDriver> driver) override final;
	};
};
};
};