import { ICommunicator } from "./ICommunicator";

/**
 * An interface for server connector.
 * 
 * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to 
 * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full 
 * charge of network communication with the remote server.
 * 
 * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the 
 * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will 
 * be converted to an {@link Invoke} object and the {@link Invoke} object will be shifted to the 
 * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method. Below code is an example
 * connecting to remote server and interacting with it.
 * 
 * - https://github.com/samchon/framework-examples/blob/master/calculator/calculator-application.ts
 * 
 * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of 
 * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
 * 
 * Protocol                | Derived Type                           | Connect to
 * ------------------------|----------------------------------------|-------------------------------
 * Samchon Framework's own | {@link ServerConnector}                | {@link Server}
 * Web-socket protocol     | {@link WebServerConnector}             | {@link WebServer}
 * DedicatedWorker         | {@link DedicatedWorkerServerConnector} | {@link DedicatedWorkerServer}
 * SharedWorker            | {@link SharedWorkerServerConnector}    | {@link SharedWorkerServer}
 * 
 * ![Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png)
 * 
 * @see {@link IServer}, {@link IProtocol}
 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
 * @author Jeongho Nam <http://samchon.org>
 */
export interface IServerConnector
	extends ICommunicator
{
	/**
	 * Callback function for connection completed.
	 * 
	 * When you call {@link connect connect()} and the connection has completed, then this call back function 
	 * {@link onConnect} will be called. Note that, if the listener of this {@link onConnect} is a member method of 
	 * some class, then you've use the ```bind```.
	 */
	onConnect: Function;

	//constructor(listener: IProtocol);

	/**
	 * Connect to a server.
	 * 
	 * Connects to a server with specified *host* address and *port* number. After the connection has
	 * succeeded, callback function {@link onConnect} is called. Listening data from the connected server also begins.
	 * Replied messages from the connected server will be converted to {@link Invoke} classes and will be shifted to
	 * the {@link WebCommunicator.listener listener}'s {@link IProtocol.replyData replyData()} method.
	 * 
	 * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
	 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
	 * the status of the connection is reported by an event. If the socket is already connected, the existing 
	 * connection is closed first.
	 * 
	 * @param ip The name or IP address of the host to connect to. 
	 *			 If no host is specified, the host that is contacted is the host where the calling file resides. 
		*			 If you do not specify a host, use an event listener to determine whether the connection was 
		*			 successful.
		* @param port The port number to connect to.
		*/
	connect(ip: string, port: number): void;
}