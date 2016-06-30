#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#	include <samchon/protocol/ExternalSystem.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystemArrayServer;

	class SAMCHON_FRAMEWORK_API ExternalSystemArray
		: public SharedEntityArray<ExternalSystem>,
		public virtual IProtocol
	{
		friend class ExternalSystem;
		friend class ExternalSystemArrayServer;

	private:
		typedef SharedEntityArray<ExternalSystem> super;

	protected:
		std::unique_ptr<ExternalSystemArrayServer> server;

	public:
		/* =========================================================
			CONSTRUCTORS
				- MEMBERS
				- CHILDREN ELEMENTS
		============================================================
			MEMBERS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		ExternalSystemArray();
		virtual ~ExternalSystemArray();

	protected:
		virtual auto createServer() -> ExternalSystemArrayServer* = 0;

		/* ---------------------------------------------------------
			CHILDREN ELEMENTS
		--------------------------------------------------------- */
		virtual auto createChild(std::shared_ptr<library::XML> xml) -> ExternalSystem*
		{
			return createSystem(xml->getProperty<std::string>("name"));
		};
		virtual auto createSystem(const std::string &name = "") -> ExternalSystem* = 0;
		virtual auto createRole(const std::string &name) -> ExternalSystemRole* = 0;

	public:
		/* =========================================================
			NETWORK
				- SERVER AND CLIENT
				- MESSAGE I/O
		============================================================
			SERVER AND CLIENT
		--------------------------------------------------------- */
		void open(int port);
		void connect();

		/* ---------------------------------------------------------
			MESSAGE I/O
		--------------------------------------------------------- */
		virtual void sendData(std::shared_ptr<Invoke>);
		virtual void replyData(std::shared_ptr<Invoke>);

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string override
		{
			return "systemArray";
		};
		virtual auto CHILD_TAG() const -> std::string override
		{
			return "system";
		};
	};
};
};