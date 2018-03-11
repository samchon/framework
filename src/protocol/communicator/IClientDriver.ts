import { ICommunicator } from "./ICommunicator";

import { IProtocol } from "../invoke/IProtocol";

/**
 * An interface for communicator with remote client. 
 * 
 * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
 * connected in a {@link IServer server}. It takes full charge of network communication with the remote client. 
 * 
 * The {@link IClientDriver} object is created and delivered from {@link IServer} and 
 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being 
 * created by the matched {@link IServer} object.
 * 
 * Protocol                | Derived Type                        | Created By
 * ------------------------|-------------------------------------|----------------------------
 * Samchon Framework's own | {@link ClientDriver}                | {@link Server}
 * Web-socket protocol     | {@link WebClientDriver}             | {@link WebServer}
 * DedicatedWorker         | {@link DedicatedWorkerClinetDriver} | {@link DedicatedWorkerServer}
 * SharedWorker            | {@link SharedWorkerClientDriver}    | {@link SharedWorkerServer}
 * 
 * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then 
 * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes 
 * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object 
 * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method. 
 * Below code is an example specifying and managing the {@link IProtocol listener} objects.
 * 
 * - https://github.com/samchon/framework-examples/blob/master/calculator/calculator-server.ts
 * 
 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
 *		  target="_blank">
	*	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	*		 style="max-width: 100%" />
	* </a>
	* 
	* @see {@link IServer}, {@link IProtocol}
	* @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
	* @author Jeongho Nam <http://samchon.org>
	*/
export interface IClientDriver extends ICommunicator
{
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
	listen(listener: IProtocol): void;
}