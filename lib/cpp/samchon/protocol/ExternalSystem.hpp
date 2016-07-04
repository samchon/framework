#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityDeque.hpp>
#	include <samchon/protocol/ExternalSystemRole.hpp>
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/protocol/Communicator.hpp>
#include <samchon/protocol/ServerConnector.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystemArray;
	class ExternalSystemArrayServer;

	class ExternalSystem 
		: public SharedEntityDeque<ExternalSystemRole>,
		public virtual IProtocol
	{
		friend class ExternalSystemArray;
		friend class ExternalSystemArrayServer;

	private:
		typedef SharedEntityDeque<ExternalSystemRole> super;

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
		ExternalSystem(ExternalSystemArray *systemArray)
		{
			this->systemArray = systemArray;
		};
		virtual ~ExternalSystem() = default;

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			name = xml->fetchProperty("name");
			ip = xml->fetchProperty("ip");
			port = xml->fetchProperty<int>("port");
		};

	protected:
		virtual auto createServerConnector() -> ServerConnector*
		{
			return new ServerConnector();
		};

	public:
		/* ---------------------------------------------------------
			ACCESSORS
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
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual void connect()
		{
			if (communicator != nullptr || ip.empty() == true)
				return;

			ServerConnector *connector = this->createServerConnector();
			communicator.reset(connector);

			connector->connect(ip, port);
			connector->listen(this);
		};

		virtual void sendData(std::shared_ptr<Invoke> invoke)
		{
			communicator->sendData(invoke);
		};

		virtual void replyData(std::shared_ptr<Invoke> invoke)
		{
			for (size_t i = 0; i < size(); i++)
				at(i)->replyData(invoke);
		};

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

		virtual auto toXML() const -> std::shared_ptr<library::XML> override
		{
			std::shared_ptr<library::XML> &xml = super::toXML();
			xml->setProperty("name", name);
			xml->setProperty("ip", ip);
			xml->setProperty("port", port);

			return xml;
		};
	};
};
};