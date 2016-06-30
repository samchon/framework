#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Server.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystemArray;

	class SAMCHON_FRAMEWORK_API ExternalSystemArrayServer
		: public virtual Server
	{
	private:
		typedef Server super;

		ExternalSystemArray *systemArray;

	public:
		ExternalSystemArrayServer(ExternalSystemArray *systemArray);
		virtual ~ExternalSystemArrayServer();

	protected:
		virtual void addClient(std::shared_ptr<ClientDriver>);
	};
};
};