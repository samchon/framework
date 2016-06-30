#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystem;

	class SAMCHON_FRAMEWORK_API ExternalSystemRole
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
		ExternalSystemRole(ExternalSystem *);
		virtual ~ExternalSystemRole();

		virtual void construct(std::shared_ptr<library::XML>);

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
			MESSAGE I/O
		--------------------------------------------------------- */
		virtual void sendData(std::shared_ptr<Invoke>);

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string
		{
			return "role";
		};
		virtual auto toXML() const -> std::shared_ptr<library::XML>;
	};
};
};