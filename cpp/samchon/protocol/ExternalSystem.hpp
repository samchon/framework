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
	class ExternalSystem 
		: public SharedEntityDeque<ExternalSystemRole>,
		public virtual IProtocol
	{
		friend class ExternalSystemArray;
		friend class ExternalSystemArrayServer;

	private:
		typedef SharedEntityDeque<ExternalSystemRole> super;

	protected:
		std::string name;

		std::shared_ptr<Communicator> communicator;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		ExternalSystem()
		{
		};
		virtual ~ExternalSystem() = default;

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			name = xml->fetchProperty("name");
			
			super::construct(xml);
		};

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		virtual auto key() const -> std::string
		{
			return name;
		};

		auto getName() const -> std::string
		{
			return name;
		};

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
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

			return xml;
		};
	};
};
};