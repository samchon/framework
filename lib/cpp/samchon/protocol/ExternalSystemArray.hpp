#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#	include <samchon/protocol/ExternalSystem.hpp>
#include <samchon/protocol/Server.hpp>
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/protocol/ClientDriver.hpp>

namespace samchon
{
namespace protocol
{
	class ExternalSystemArrayServer;

	class ExternalSystemArray
		: public SharedEntityArray<ExternalSystem>,
		public virtual Server,
		public virtual IProtocol
	{
		friend class ExternalSystem;
		friend class ExternalSystemArrayServer;

	private:
		typedef SharedEntityArray<ExternalSystem> super;

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
		ExternalSystemArray()
			: super(),
			Server()
		{
		};
		virtual ~ExternalSystemArray() = default;

	protected:
		virtual void addClient(std::shared_ptr<ClientDriver> driver)
		{
			ExternalSystem *system = createSystem("");
			system->communicator = driver;

			emplace_back(system);
			driver->listen(system);
		};

		/* ---------------------------------------------------------
			CHILDREN ELEMENTS
		--------------------------------------------------------- */
		virtual auto createChild(std::shared_ptr<library::XML> xml) -> ExternalSystem*
		{
			return createSystem(xml->getProperty<std::string>("name"));
		};
		virtual auto createSystem(const std::string &name = "") -> ExternalSystem* = 0;
		
	public:
		/* =========================================================
			NETWORK
				- SERVER AND CLIENT
				- MESSAGE I/O
		============================================================
			SERVER AND CLIENT
		--------------------------------------------------------- */
		void connect()
		{

		};

		/* ---------------------------------------------------------
			MESSAGE I/O
		--------------------------------------------------------- */
		virtual void sendData(std::shared_ptr<Invoke> invoke)
		{
			for (size_t i = 0; i < size(); i++)
				at(i)->sendData(invoke);
		};

		virtual void replyData(std::shared_ptr<Invoke> invoke)
		{
			for (size_t i = 0; i < size(); i++)
				at(i)->replyData(invoke);
		};

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