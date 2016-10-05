#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/slave/SlaveSystem.hpp>
#include <samchon/protocol/Server.hpp>

namespace samchon
{
namespace templates
{
namespace slave
{
	class SlaveServer
		: public virtual SlaveSystem,
		public virtual protocol::Server

	{
	public:
		SlaveServer();
		virtual ~SlaveServer();

	protected:
		virtual void addClient(std::shared_ptr<protocol::ClientDriver> driver) override;
	};
};
};
};