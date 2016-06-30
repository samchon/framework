#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#	include <samchon/protocol/ExternalSystemRole.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystemArray;
	class Communicator;
	class ServerConnector;
	class ExternalSystemArrayServer;

	class SAMCHON_FRAMEWORK_API ExternalSystem 
		: public SharedEntityArray<ExternalSystemRole>,
		public virtual IProtocol
	{
		friend class ExternalSystemArray;
		friend class ExternalSystemArrayServer;

	private:
		typedef SharedEntityArray<ExternalSystemRole> super;

		ExternalSystemArray *systemArray;
		std::shared_ptr<Communicator> communicator;

	protected:
		std::string name;
		std::string ip;
		int port;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		ExternalSystem(ExternalSystemArray *systemArray);
		virtual ~ExternalSystem();

		virtual void construct(std::shared_ptr<library::XML> xml) override;

	protected:
		virtual auto createChild(std::shared_ptr<library::XML> xml) -> ExternalSystemRole*
		/*{
			return systemArray->createRole(xml->getProperty<string>("name"));
		}*/;

		virtual auto createServerConnector() -> ServerConnector* = 0;

	public:
		/* ---------------------------------------------------------
			NETWORK & MESSAGE I/O
		--------------------------------------------------------- */
		virtual auto key() const -> std::string
		{
			return name;
		};

		auto getSystemArray() const -> ExternalSystemArray* 
		{
			return systemArray;
		};
		auto getName() const -> std::string
		{
			return name;
		};
		auto getIP() const -> std::string 
		{
			return ip;
		};
		auto getPort() const -> int
		{
			return port;
		};

		/* ---------------------------------------------------------
			NETWORK & MESSAGE I/O
		--------------------------------------------------------- */
		void connect();

		virtual void sendData(std::shared_ptr<Invoke>);
		virtual void replyData(std::shared_ptr<Invoke>);

	public:
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string override
		{
			return "system";
		};
		virtual auto CHILD_TAG() const -> std::string override
		{
			return "role";
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};