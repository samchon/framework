/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export interface ICommunicator extends IProtocol
	{
		onClose: Function;

		close();
	}

	export interface IClientDriver extends ICommunicator
	{
		listen(listener: IProtocol): void;
	}

	/**
	 * <p> An abstract server connector. </p>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IServerConnector
		extends ICommunicator
	{
		onConnect: Function;

		//constructor(listener: IProtocol);

		/**
		 * <p> Connect to a server. </p>
		 * 
		 * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown: 
		 * an error event is dispatched if a host was specified, and an exception is thrown if no host 
		 * was specified. Otherwise, the status of the connection is reported by an event. 
		 * If the socket is already connected, the existing connection is closed first. </p>
		 * 
		 * @param ip The name or IP address of the host to connect to. 
		 *			 If no host is specified, the host that is contacted is the host where the calling file resides. If 
		 *			 you do not specify a host, use an event listener to determine whether the connection was successful.
		 * @param port The port number to connect to.
		 */
		connect(ip: string, port: number): void;
	}
}