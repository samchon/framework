#pragma once
#include <samchon/API.hpp>

#include <memory>
#include <samchon/protocol/Socket.hpp>

namespace samchon
{
namespace protocol
{
	class ClientDriver;

	/**
	 * A server.
	 * 
	 * The {@link Server} is an abstract class providing methods for {@link open opening a server} and
	 * {@link ClientDriver accepting clients}. The server opened by this {@link Server} class follows the protocol of 
	 * Samchon Framework's own.
	 * 
	 * To open a server, extends the {@link Server} class and overrides {@link addClient addClient()} method to define what 
	 * to do with a newly connected {@link ClientDriver remote clients}. At last, call {@link open open()} method with 
	 * the specified port number.
	 *
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients.
	 * 
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service::Server}
	 * - {@link external::ExternalClientArray}
	 * - {@link slave::SlaveServer}
	 * 
	 * Note that, this {@link Server} class follows the protocol of Samchon Framework's own. If you want to provide a 
	 * realtime web-service, then use {@link WebServer} instead, that is following the web-socket protocol.
	 * 
	 * Protocol                | Derived Type      | Related {@link ClientDriver}
	 * ------------------------|-------------------|-------------------------------
	 * Samchon Framework's own | {@link Server}    | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer} | {@link WebClientDriver}
	 * 
	 * ![Basic Components](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png)
	 *
	 * @see {@link ClientDriver}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#server)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class SAMCHON_FRAMEWORK_API Server
	{
	protected:
		std::unique_ptr<Acceptor> _Acceptor;

	public:
		/**
		 * Default Constructor.
		 */
		Server();

		/**
		 * Default Destructor.
		 */
		virtual ~Server();

		/**
		 * Open server.
		 * 
		 * @param port Port number to open.
		 */
		virtual void open(int port);

		/**
		 * Close the server.
		 */
		virtual void close();

	protected:
		/**
		 * Add a newly connected remote client.
		 * 
		 * The {@link addClient addClient()} is an abstract method being called when a remote client is newly connected 
		 * with {@link IClientDriver} object who communicates with the remote system. Overrides this method and defines 
		 * what to do with the *driver*, a newly connected remote client. 
		 * 
		 * Below methods and example codes may be good for comprehending how to utilizing this {@link addClient} method.
		 * 
		 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
		 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
		 * - {@link service::Server::addClient}
		 * - {@link external::ExternalClientArray::addClient}
		 * - {@link slave::SlaveServer::addClient}
		 * 
		 * @param driver A {@link ICommunicator communicator} with (newly connected) remote client.
		 */
		virtual void addClient(std::shared_ptr<ClientDriver>) = 0; //ADD_CLIENT

	private:
		virtual void handle_connection(std::shared_ptr<Socket> socket);
	};
};
};