#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystem.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalServer
		: public virtual ExternalSystem
	{
	private:
		typedef ExternalSystem super;

	protected:
		std::string ip;
		int port;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		ExternalServer() : super()
		{
		};
		virtual ~ExternalServer() = default;

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			ip = xml->fetchProperty("ip");
			port = xml->fetchProperty<int>("port");

			super::construct(xml);
		};

	protected:
		virtual auto createServerConnector() -> ServerConnector*
		{
			return new ServerConnector();
		};

	public:
		auto getIP() const -> std::string
		{
			return ip;
		};
		auto getPort() const -> int
		{
			return port;
		};

		virtual void connect()
		{
			if (communicator != nullptr || ip.empty() == true)
				return;

			ServerConnector *connector = this->createServerConnector();
			communicator.reset(connector);

			connector->connect(ip, port);
			connector->listen(this);
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML> override
		{
			std::shared_ptr<library::XML> &xml = super::toXML();
			xml->setProperty("ip", ip);
			xml->setProperty("port", port);

			return xml;
		};
	};
};
};