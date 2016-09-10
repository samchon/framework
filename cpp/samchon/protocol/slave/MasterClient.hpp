#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/MasterSystem.hpp>
#include <samchon/protocol/Server.hpp>

namespace samchon
{
namespace protocol
{
namespace slave
{
	class MasterClient
		: public virtual MasterSystem,
		public virtual Server

	{
	public:
		MasterClient();
		virtual ~MasterClient();

	protected:
		virtual void addClient(std::shared_ptr<ClientDriver> driver) override final;
	};
};
};
};