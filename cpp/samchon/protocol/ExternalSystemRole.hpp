#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystem;

	class ExternalSystemRole
		: public virtual Entity,
		public virtual IProtocol
	{
	private:
		typedef Entity super;

	protected:
		ExternalSystem *system;

		std::string name;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		ExternalSystemRole(ExternalSystem *system)
		{
			this->system = system;
		};
		virtual ~ExternalSystemRole() = default;

		virtual void construct(std::shared_ptr<library::XML> xml)
		{
			name = xml->getProperty("name");
		};

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		virtual auto key() const -> std::string
		{
			return name;
		};

		auto getSystem() const -> ExternalSystem*
		{
			return system;
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
			((IProtocol*)system)->sendData(invoke);
		};

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string
		{
			return "role";
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML>
		{
			std::shared_ptr<library::XML> &xml = super::toXML();
			xml->setProperty("name", name);
			
			return xml;
		};
	};
};
};