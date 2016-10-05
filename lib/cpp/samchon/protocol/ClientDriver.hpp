#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Communicator.hpp>

namespace samchon
{
namespace protocol
{
	class Server;

	/**
	 * A communicator with remote client.
	 * 
	 * The {@link ClientDriver} class is a type of {@link Communicator}, specified for communication with remote client who
	 * has connected in a {@link Server} object who follows the protocol of Samchon Framework's own. The {@link ClientDriver} 
	 * takes full charge of network communication with the remote client. 
	 *
	 * The {@link ClientDriver} object is always created by the {@link Server} class. When you got a {@link ClientDriver} 
	 * object from the {@link Server.addClient Server.addClient()}, then specify {@link IProtocol listener} with the 
	 * {@link ClientDriver.listen ClientDriver.listen()} method. Below code is an example specifying and managing the 
	 * {@link IProtocol listener} objects.
	 * 
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * 
	 * Protocol                | Derived Type            | Created By
	 * ------------------------|-------------------------|-------------------
	 * Samchon Framework's own | {@link ClientDriver}    | {@link Server}
	 * Web-socket protocol     | {@link WebClientDriver} | {@link WebServer}
	 *
	 * ![Basic Components](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png)
	 * 
	 * @see {@link Server}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#clientdriver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API ClientDriver
		: public virtual Communicator
	{
	protected:
		Server *server;

	public:
		ClientDriver(Server *server, std::shared_ptr<Socket> socket);
		virtual ~ClientDriver();

		/**
		 * Listen message from the newly connected client.
		 * 
		 * Starts listening message from the newly connected client. Replied message from the connected client will be 
		 * converted to {@link Invoke} classes and shifted to the *listener*'s {@link IProtocol.replyData replyData()} 
		 * method. 
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in 
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
		 */
		void listen(IProtocol *listener);
	};
};
};