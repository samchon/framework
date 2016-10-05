#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityDeque.hpp>
#	include <samchon/templates/external/ExternalSystemRole.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
namespace protocol
{
	class Communicator;
	class ClientDriver;
};

namespace templates
{
namespace external
{
	class ExternalSystemArray;
	class ExternalServer;
	
	/**
	 * An external system driver.
	 * 
	 * The {@link ExternalSystem} class represents an external system, connected and interact with this system. 
	 * {@link ExternalSystem} takes full charge of network communication with the remote, external system have connected.
	 * Replied {@link Invoke} messages from the external system is shifted to and processed in, children elements of this
	 * class, {@link ExternalSystemRole} objects.
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png)
	 * 
	 * #### Bridge & Proxy Pattern
	 * The {@link ExternalSystem} class can be a *bridge* for *logical proxy*. In framework within user, 
	 * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is *which can be done*.
	 *
	 * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
	 *
	 * <ul>
	 *	<li>
	 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the 
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called *Bridge Pattern* and *Proxy Pattern*. </li>
	 * </ul>
	 * 
	 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API ExternalSystem 
		: public protocol::SharedEntityDeque<ExternalSystemRole>,
		public virtual protocol::IProtocol
	{
		friend class ExternalClientArray;
		friend class ExternalServer;

	private:
		typedef protocol::SharedEntityDeque<ExternalSystemRole> super;

	protected:
		ExternalSystemArray *system_array_;

		std::shared_ptr<protocol::Communicator> communicator_;
	
		/**
		 * The name represents external system have connected. 
		 */
		std::string name;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ExternalSystemArray}.
		 * 
		 * @param systemArray The parent {@link ExternalSystemArray} object.
		 */
		ExternalSystem(ExternalSystemArray*);

		/**
		 * Constrct from parent {@link ExternalSystemArray} and communicator.
		 * 
		 * @param systemArray The parent {@link ExternalSystemArray} object.
		 * @param communicator Communicator with the remote, external system.
		 */
		ExternalSystem(ExternalSystemArray*, std::shared_ptr<protocol::ClientDriver>);

		/**
		 * Default Destructor.
		 * 
		 * The {@link ExternalSystem} object is destructed when connection with the remote system is closed or this 
		 * {@link ExternalSystem} object is {@link ExternalSystemArray.erase erased} from its parent 
		 * {@link ExternalSystemArray} object.
		 */
		virtual ~ExternalSystem();

		virtual void construct(std::shared_ptr<library::XML> xml) override;

	protected:
		ExternalSystem();

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get parent {@link ExternalSystemArray} object.
		 */
		auto getSystemArray() const -> ExternalSystemArray*
		{
			return system_array_;
		};
		
		/**
		 * Identifier of {@link ExternalSystem} is its {@link name}.
		 * 
		 * @return name.
		 */
		virtual auto key() const -> std::string
		{
			return name;
		};

		/**
		 * Get {@link name}.
		 */
		auto getName() const -> std::string
		{
			return name;
		};

	public:
		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * Close connection.
		 */
		void close();

		/**
		 * Send {@link Invoke} message to external system.
		 * 
		 * @param invoke An {@link Invoke} message to send.
		 */
		virtual void sendData(std::shared_ptr<protocol::Invoke> invoke) override;

		/**
		 * Handle an {@Invoke} message has received.
		 * 
		 * @param invoke An {@link Invoke} message have received.
		 */
		virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override;

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
};