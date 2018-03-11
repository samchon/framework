import { Invoke } from "./Invoke";

/**
 * An interface for {@link Invoke} message chain.
 * 
 * {@link IProtocol} is an interface for {@link Invoke} message, which is standard message of network I/O in 
 * *Samchon Framework*, chain. The {@link IProtocol} interface is used to network drivers and some classes which are 
 * in a relationship of *Chain of Responsibility Pattern* with those network drivers.
 * 
 * Implements {@link IProtocol} if the class sends and handles {@link Invoke} messages. Looking around source codes of 
 * the *Samchon Framework*, especially *Templates*, you can find out that all the classes and modules handling 
 * {@link Invoke} messages are always implementing this {@link IProtocol}.
 * 
 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
 *		  target="_blank">
	*	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	*		 style="max-width: 100%" />
	* </a>
	*
	* @see {@link Invoke}
	* @handbook https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iprotocol
	* @author Jeongho Nam <http://samchon.org>
	*/
export interface IProtocol
{
	/**
	 * Sending message.
	 * 
	 * Sends message to related system or shifts the responsibility to chain.
	 *
	 * @param invoke Invoke message to send
	 */
	replyData(invoke: Invoke): void;

	/**
	 * Handling replied message.
	 * 
	 * Handles replied message or shifts the responsibility to chain.
	 *
	 * @param invoke An {@link Invoke} message has received.
	 */
	sendData(invoke: Invoke): void;
}