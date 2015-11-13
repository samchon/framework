#pragma once
#include <samchon/protocol/ExternalServer.hpp>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			/**
			 * @brief A driver for each system.
			 * 		  
			 * @details
			 * <p> SystemDriver is a boundary class interacting with a system which is one of them; PackerMaster, 
			 * TSPMaster and Reporter. The SystemDriver classes are belonged to a Chief logically and real systems
			 * associated with the SystemDriver classes are belonged to a Cheif physically. </p>
			 * 
			 * \par [Inherited]
			 *		@copydoc protocol::ExternalServer 
			 *
			 * @author Jeongho Nam
			 */
			class MasterDriver
				: public protocol::ExternalServer
			{
			private:
				typedef protocol::ExternalServer super;

				/**
				 * @brief A parent, master object.
				 * 		  
				 * @details A parent object representing a master, which means a Chief.
				 * 			The system interacting with the SystemDriver class is belonged to the parent.
				 */
				protocol::IProtocol *parent;

			public:
				/**
				 * @brief Construct from parent(master), name, ip and port.
				 * 
				 * @param parent Parent object means a Cheif.
				 * @param name Name of the system the driver is connected to.
				 * @param ip IP address of the slave system.
				 * @param port Port number of the slave system.
				 */
				MasterDriver(protocol::IProtocol *parent, const std::string &name, const std::string &ip, int port)
					: super()
				{
					this->parent = parent;
					this->name = name;

					this->ip = ip;
					this->port = port;
				};
				virtual ~MasterDriver() = default;

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::ExternalSystemRole* override
				{
					return nullptr;
				};

			public:
				virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
				{
					parent->replyData(invoke);
				};
			};
		};
	};
};