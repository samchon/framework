#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/slave/SlaveSystem.hpp>

namespace samchon
{
namespace protocol
{
	class ServerConnector;
};

namespace templates
{
namespace slave
{
	class SAMCHON_FRAMEWORK_API SlaveClient
		: public virtual SlaveSystem
	{
	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		SlaveClient();
		virtual ~SlaveClient();

	protected:
		virtual auto createServerConnector() -> protocol::ServerConnector*;

	public:
		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		void connect(const std::string &ip, int port);
	};
};
};
};