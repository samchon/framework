#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityDeque.hpp>
#	include <samchon/protocol/external/ExternalSystem.hpp>
#	include <samchon/protocol/external/ExternalServer.hpp>
#include <samchon/protocol/Server.hpp>
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/protocol/ClientDriver.hpp>

namespace samchon
{
namespace protocol
{
namespace external
{
	class SAMCHON_FRAMEWORK_API ExternalSystemArray
		: public SharedEntityDeque<ExternalSystem>,
		public virtual Server, // YOU CAN REPLACE IT -> WebServer
		public virtual IProtocol
	{
		friend class ExternalSystem;

	private:
		typedef SharedEntityDeque<ExternalSystem> super;

	public:
		/* =========================================================
			CONSTRUCTORS
				- DEFAULT
				- FACTORY METHODS FOR CHILDREN
		============================================================
			DEFAULT
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		ExternalSystemArray();
		virtual ~ExternalSystemArray();

	protected:
		/* ---------------------------------------------------------
			FACTORY METHODS FOR CHILDREN
		--------------------------------------------------------- */
		virtual void addClient(std::shared_ptr<ClientDriver> driver) final;
		virtual auto createChild(std::shared_ptr<library::XML> xml) -> ExternalSystem* override final;

		virtual auto createExternalClient(std::shared_ptr<ClientDriver>) -> ExternalSystem* = 0;
		virtual auto createExternalServer(std::shared_ptr<library::XML>) -> ExternalServer* = 0;
		
	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto hasRole(const std::string &key) const -> bool
		{
			for (size_t i = 0; i < size(); i++)
				for (size_t j = 0; j < at(i)->size(); j++)
					if (at(i)->at(j)->key() == key)
						return true;

			return false;
		};

		auto getRole(const std::string &key) const -> std::shared_ptr<ExternalSystemRole>
		{
			for (size_t i = 0; i < size(); i++)
				for (size_t j = 0; j < at(i)->size(); j++)
					if (at(i)->at(j)->key() == key)
						return at(i)->at(j);

			throw std::out_of_range("No such key.");
		};

		/* =========================================================
			NETWORK
				- SERVER AND CLIENT
				- MESSAGE CHAIN
		============================================================
			SERVER AND CLIENT
		--------------------------------------------------------- */
		// virtual void open(int port) override;

		virtual void connect();

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		virtual void sendData(std::shared_ptr<Invoke> invoke);

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
};