namespace samchon.protocol
{
	/**
	 * An interface for a server.
	 * 
	 * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and 
	 * {@link IClientDriver accepting clients}.
	 * 
	 * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
	 * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
	 * object. Then at last, call {@link open open()} method with specified port number.
	 * 
	 * Protocol                | Derived Type                  | Related {@link IClientDriver}
	 * ------------------------|-------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerClientDriver}
	 *  
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients. 
	 * - https://github.com/samchon/framework-examples/blob/master/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework-examples/blob/master/chat-server/server.ts
	 * - {@link service.Server}
	 * - {@link external.ExternalClientArray}
	 * - {@link slave.SlaveServer}
	 * 
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link IClientDriver}, {@link IServerBase}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IServer
	{
		/**
		 * Open server.
		 * 
		 * @param port Port number to open.
		 */
		open(port: number): void;

		/**
		 * Close server. 
		 * 
		 * Close opened server. All remote clients, have connected with this server, are also closed and their call back 
		 * functions, for closed connection, {@link IClientDriver.onClose} are also called.
		 */
		close(): void;

		/**
		 * Add a newly connected remote client.
		 * 
		 * The {@link addClient addClient()} is an abstract method being called when a remote client is newly connected 
		 * with {@link IClientDriver} object who communicates with the remote system. Overrides this method and defines 
		 * what to do with the *driver*, a newly connected remote client. 
		 * 
		 * Below methods and example codes may be good for comprehending how to utilize this {@link addClient} method.
		 * 
		 * - https://github.com/samchon/framework-examples/blob/master/calculator/calculator-server.ts
		 * - https://github.com/samchon/framework-examples/blob/master/chat-server/server.ts
		 * - {@link service.Server.addClient}
		 * - {@link external.ExternalClientArray.addClient}
		 * - {@link slave.SlaveServer.addClient}
		 * 
		 * @param driver A {@link ICommunicator communicator} with (newly connected) remote client.
		 */
		addClient(driver: IClientDriver): void;
	}
}