#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/MasterSystem.hpp>

namespace samchon
{
namespace protocol
{
	class ServerConnector;

namespace slave
{
	class SAMCHON_FRAMEWORK_API MasterServer
		: public virtual MasterSystem
	{
	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		MasterServer();
		virtual ~MasterServer();

	protected:
		virtual auto createServerConnector() -> ServerConnector*;

	public:
		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		void connect(const std::string &ip, int port);
	};
};
};
};