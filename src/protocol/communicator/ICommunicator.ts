import { IProtocol } from "../invoke/IProtocol";

import { Invoke } from "../invoke/Invoke";

/**
 * An interface taking full charge of network communication.
 * 
 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with 
 * remote system, without reference to whether the remote system is a server or a client. Type of the 
 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system 
 * is a server (that I've to connect) or a client (a client connected to my server).
 * 
 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class 
 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s 
 * {@link IProtocol.replyData IProtocol.replyData()} method.
 * 
 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
 *		  target="_blank">
	*	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	*		 style="max-width: 100%" />
	* </a>
	* 
	* @see {@link IClientDriver}, {@link IServerConnector}, {@link IProtocol}
	* @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	* @author Jeongho Nam <http://samchon.org>
	*/
export interface ICommunicator extends IProtocol
{
	/**
	 * Callback function for connection closed.
	 */
	onClose: Function;

	/**
	 * Close connection.
	 */
	close(): void;

	/**
	 * Test connection.
	 * 
	 * Test whether this {@link ICommunicator communicator} object is connected with the remote system. If the 
	 * connection is alive, then returns ```true```. Otherwise, the connection is not alive or this 
	 * {@link ICommunicator communicator has not connected with the remote system yet, then returns ```false```.
	 * 
	 * @return true if connected, otherwise false.
	 */
	isConnected(): boolean;

	/**
	 * Send message.
	 * 
	 * Send {@link Invoke} message to remote system.
	 *
	 * @param invoke An {@link Invoke} message to send.
	 */
	sendData(invoke: Invoke): void;

	/** 
	 * Handle replied message.
	 * 
	 * Handles replied {@link Invoke} message recived from remove system. The {@link Invoke} message will be shifted
	 * to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} by this method.
	 *
	 * @param invoke An {@link Invoke} message received from remote system.
	 */
	replyData(invoke: Invoke): void;
}