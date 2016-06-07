/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * <p> A server connector for a physical client. </p>
	 *
	 * <p> ServerConnector is a class for a physical client connecting a server. If you want to connect 
	 * to a server,  then implements this ServerConnector and just override some methods like 
	 * getIP(), getPort() and replyData(). That's all. </p>
	 *
	 * <p> In Samchon Framework, package protocol, There are basic 3 + 1 components that can make any 
	 * type of network system in Samchon Framework. The basic 3 components are IProtocol, IServer and
	 * IClient. The last, surplus one is the ServerConnector. Looking around classes in 
	 * Samchon Framework, especially module master and slave which are designed for realizing 
	 * distributed processing systems and parallel processing systems, physical client classes are all 
	 * derived from this ServerConnector. </p>
	 *
	 * <img src="interface.png" />
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ServerConnector
		implements IProtocol
	{
		/**
		 * <p> A parent object who listens and sends Invoke message. </p>
		 * 
		 * <ul>z
		 * 	<li> ServerConnector.replyData(Invoke) -> parent.replyData(Invoke) </li>
		 * </ul>
		 */
		private parent: IProtocol;

		/**
		 * <p> A socket for network I/O. </p>
		 */
		private socket: WebSocket;

		private binary_invoke: Invoke;

		/**
		 * <p> An open-event listener. </p>
		 */
		public onopen: Function;

		/**
		 * <p> Constructor with parent. </p>
		 */
		constructor(parent: IProtocol) 
		{
			this.parent = parent;
			
			this.binary_invoke = null;
			this.onopen = null;
		}

		/**
		 * <p> Connects to a cloud server with specified host and port. </p>
		 * 
		 * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown: 
		 * an error event is dispatched if a host was specified, and an exception is thrown if no host 
		 * was specified. Otherwise, the status of the connection is reported by an event. 
		 * If the socket is already connected, the existing connection is closed first. </p>
		 * 
		 * @param ip
		 * 		The name or IP address of the host to connect to. 
		 * 		If no host is specified, the host that is contacted is the host where the calling 
		 * 		file resides. If you do not specify a host, use an event listener to determine whether 
		 * 		the connection was successful.
		 * @param port 
		 * 		The port number to connect to.
		 * 
		 * @throws IOError
		 * 		No host was specified and the connection failed.
		 * @throws SecurityError
		 * 		This error occurs in SWF content for the following reasons: 
		 * 		Local untrusted SWF files may not communicate with the Internet. You can work around 
		 * 		this limitation by reclassifying the file as local-with-networking or as trusted.
		 */
	 public connect(ip: string, port: number, path: string = ""): void 
		{
			if(ip.indexOf("ws://") == -1)
			{
				if(ip.indexOf("://") != -1)
					throw "only websocket is possible";
				else
					ip = "ws://" + ip;
			}
			this.socket = new WebSocket(ip + ":" + port + "/" + path);
			
			let this_ = this;

			this.socket.onopen = function (event: Event)
			{
				this_.handleConnect(event);
			}
			this.socket.onmessage = function (event: MessageEvent)
			{
				this_.handleReply(event)
			};
		}

		/* ----------------------------------------------------
			IPROTOCOL'S METHOD
		---------------------------------------------------- */
		/**
		 * <p> Send data to the server. </p>
		 */
		public sendData(invoke: Invoke): void 
		{
			let xml: library.XML = invoke.toXML();
			let str: string = xml.toString();

			this.socket.send(str);
		}

		/**
		 * <p> Shift responsiblity of handling message to parent. </p>
		 */
		public replyData(invoke: Invoke): void 
		{
			this.parent.replyData(invoke);
		}

		/* ----------------------------------------------------
			HANDLING CONNECTION AND MESSAGES
		---------------------------------------------------- */
		private handleConnect(event: Event): void
		{
			if(this.onopen == null)
				return;
		
			this.onopen(event);
		}

		/**
		 * <p> Handling replied message. </p>
		 */
		private handleReply(event: MessageEvent): void
		{
			console.log("handle_reply: #" + event.data.length);

			if (this.binary_invoke == null)
			{
				let xml: library.XML = new library.XML(event.data);
				let invoke: Invoke = new Invoke(xml);

				// THE INVOKE MESSAGE INCLUDES BINARY DATA?
				let is_binary: boolean = std.any_of
					(
						invoke.begin(), invoke.end(),
						function (parameter: InvokeParameter): boolean
						{
							return parameter.getType() == "ByteArray";
						}
					);

				// IF EXISTS, REGISTER AND TERMINATE
				if (is_binary)
					this.binary_invoke = invoke;
				else // IF NOT EXISTS, JUST SHIFT THE MESSAGE
					this.replyData(invoke);
			}
			else
			{
				// FIND THE MATCHED PARAMETER
				let it = std.find_if(this.binary_invoke.begin(), this.binary_invoke.end(),
					function (parameter: InvokeParameter): boolean
					{
						return parameter.getType() == "ByteArray" && parameter.getValue() == null;
					}
				);
				
				// SET BINARY DATA
				it.value.setValue(event.data);

				// FIND THE REMAINED BINARY PARAMETER
				it = std.find_if(it.next(), this.binary_invoke.end(),
					function (parameter: InvokeParameter): boolean
					{
						return parameter.getType() == "ByteArray" && parameter.getValue() == null;
					}
				);
				if (it.equal_to(this.binary_invoke.end()))
				{
					// AND IF NOT, SEND THE INVOKE MESSAGE
					this.replyData(this.binary_invoke);
					this.binary_invoke = null;
				}
			}
		}
	}
}