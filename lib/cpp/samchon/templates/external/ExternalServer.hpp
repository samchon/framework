#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/external/ExternalSystem.hpp>

namespace samchon
{
namespace protocol
{
	class ServerConnector;
};

namespace templates
{
namespace external
{
	/**
	 * An external server driver.
	 *
	 * The {@link ExternalServer} is an abstract class, derived from the {@link ExternalSystem} class, connecting to
	 * remote, external server. Extends this {@link ExternalServer} class and overrides the
	 * {@link createServerConnector createServerConnector()} method following which protocol the external server uses.
	 * 
	 * #### [Inherited] {@link ExternalSystem}
	 * @copydetails external::ExternalSystem
	 */
	class SAMCHON_FRAMEWORK_API ExternalServer
		: public virtual ExternalSystem
	{
		friend class ExternalSystem;

	private:
		typedef ExternalSystem super;

	protected:
		/**
		 * IP address of target external system to connect.
		 */
		std::string ip;

		/**
		 * Port number of target external system to connect.
		 */
		int port;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ExternalSystemArray}.
		 * 
		 * @param systemArray The parent {@link ExternalSystemArray} object.
		 */
		ExternalServer(ExternalSystemArray*);

		virtual ~ExternalServer();

	protected:
		/**
		 * Factory method creating {@link IServerConnector} object.
		 * 
		 * The {@link createServerConnector createServerConnector()} is an abstract method creating 
		 * {@link IServerConnector} object. Overrides and returns one of them, considering which templates the external
		 * system follows:
		 * 
		 * - {@link ServerConnector}
		 * - {@link WebServerConnector}
		 * 
		 * @return A newly created {@link IServerConnector} object.
		 */
		virtual auto createServerConnector() -> protocol::ServerConnector*;

	public:
		/* ---------------------------------------------------------
			NETWORK
		--------------------------------------------------------- */
		/**
		 * Connect to external server.
		 */
		virtual void connect();
	};
};
};
};