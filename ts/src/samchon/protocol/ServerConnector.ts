/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	/**
	 * An interface for server connector.
	 * 
	 * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to 
	 * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full 
	 * charge of network communication with the remote server.
	 * 
	 * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the 
	 * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will 
	 * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the 
	 * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method. Below code is an example
	 * connecting to remote server and interacting with it.
	 * 
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-application.ts
	 * 
	 * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of 
	 * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
	 * 
	 * Protocol | Derived Type | Connect to
	 * ---------|--------------|---------------
	 * Samchon Framework's own | {@link ServerConnector} | {@link Server}
	 * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
	 * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
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
}

namespace samchon.protocol
{
	/**
	 * @hidden
	 */
	declare var net: typeof NodeJS.net;

	/**
	 * Server connnector.
	 * 
	 * {@link ServerConnector} is a class connecting to remote server who follows Samchon Framework's own protocol and 
	 * taking full charge of network communication with the remote server. Create a {@link ServerConnector} instance from 
	 * the {@IProtocol listener} and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link IServerConnector}
	 * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
	 * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
	 * charge of network communication with the remote server.
	 *
	 * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
	 * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
	 * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
	 * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 *
	 * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
	 * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
	 *
	 * Protocol | Derived Type | Connect to
	 * ---------|--------------|---------------
	 * Samchon Framework's own | {@link ServerConnector} | {@link Server}
	 * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
	 * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link Server}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ServerConnector
		extends Communicator
		implements IServerConnector
	{
		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		/**
		 * Construct from *listener*.
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
		 */
		public constructor(listener: IProtocol)
		{
			super(listener);

			this.connected_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public connect(ip: string, port: number): void
		{
			this.socket_ = net.connect({ host: ip, port: port }, this.handle_connect.bind(this));
		}

		/**
		 * @hidden
		 */
		private handle_connect(...arg: any[]): void
		{
			this.connected_ = true;

			this.start_listen();

			if (this.onConnect != null)
				this.onConnect();
		}
	}
}

namespace samchon.protocol
{
	/**
	 * @hidden
	 */
	declare var websocket: typeof __websocket;

	/**
	 * A server connector for web-socket protocol.
	 * 
	 * {@link WebServerConnector} is a class connecting to remote server who follows Web-socket protocol and taking full 
	 * charge of network communication with the remote server. Create an {@link WebServerConnector} instance from the
	 * {@IProtocol listener} and call the {@link connect connect()} method.
	 *
	 * #### [Inherited] {@link IServerConnector}
	 * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
	 * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
	 * charge of network communication with the remote server.
	 *
	 * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
	 * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
	 * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
	 * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 *
	 * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
	 * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
	 *
	 * Protocol | Derived Type | Connect to
	 * ---------|--------------|---------------
	 * Samchon Framework's own | {@link ServerConnector} | {@link Server}
	 * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
	 * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link WebServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class WebServerConnector
		extends WebCommunicator
		implements IServerConnector
	{
		///////
		// WEB-BROWSER
		///////
		/**
		 * @hidden
		 */
		private browser_socket_: WebSocket;

		///////
		// NODE CLIENT
		///////
		/**
		 * @hidden
		 */
		private node_client_: websocket.client;

		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		/* ----------------------------------------------------
			CONSTRUCTORS
		---------------------------------------------------- */
		/**
		 * Construct from *listener*.
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
		 */
		public constructor(listener: IProtocol)
		{
			super(listener);

			this.browser_socket_ = null;
			this.node_client_ = null;

			this.connected_ = false;
			this.onConnect = null;
		}

		/**
		 * Connect to a web server.
		 * 
		 * Connects to a server with specified *host* address, *port* number and *path*. After the connection has
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
		 * @param path Path of service which you want.
		 */
		public connect(ip: string, port: number, path: string = ""): void 
		{
			// COMPOSITE FULL-ADDRESS
			let address: string;

			if (ip.indexOf("ws://") == -1)
				if (ip.indexOf("://") != -1)
					throw "only websocket is possible";
				else
					ip = "ws://" + ip;

			address = ip + ":" + port + "/" + path;

			// CONNECTION BRANCHES
			if (is_node() == true)
			{
				this.node_client_ = new websocket.client();
				this.node_client_.on("connect", this.handle_node_connect.bind(this));

				this.node_client_.connect(address);
			}
			else
			{
				this.browser_socket_ = new WebSocket(address);
				
				this.browser_socket_.onopen = this.handle_browser_connect.bind(this);
				this.browser_socket_.onerror = this.handle_close.bind(this);
				this.browser_socket_.onclose = this.handle_close.bind(this);
				this.browser_socket_.onmessage = this.handle_browser_message.bind(this);
			}
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.close();
		}

		/* ----------------------------------------------------
			IPROTOCOL'S METHOD
		---------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void 
		{
			if (this.browser_socket_ != null)
			{
				this.browser_socket_.send(invoke.toXML().toString());

				for (let i: number = 0; i < invoke.size(); i++)
					if (invoke.at(i).getType() == "ByteArray")
						this.browser_socket_.send(invoke.at(i).getValue());
			}
			else
			{
				super.sendData(invoke);
			}
		}

		/**
		 * @hidden
		 */
		private handle_browser_connect(event: Event): void
		{
			this.connected_ = true;

			if (this.onConnect != null)
				this.onConnect();
		}

		/**
		 * @hidden
		 */
		private handle_browser_message(event: MessageEvent): void
		{
			if (this.is_binary_invoke() == false)
				this.handle_string(event.data);
			else
				this.handle_binary(event.data);
		}

		/**
		 * @hidden
		 */
		private handle_node_connect(connection: websocket.connection): void
		{
			this.connected_ = true;

			this.connection_ = connection;
			this.connection_.on("message", this.handle_message.bind(this));
			this.connection_.on("close", this.handle_close.bind(this));
			this.connection_.on("error", this.handle_close.bind(this));

			if (this.onConnect != null)
				this.onConnect();
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A server connector for SharedWorker.
	 *
	 * {@link SharedWorkerServerConnector} is a class connecting to SharedWorker and taking full charge of network 
	 * communication with the SharedWorker. Create an {@link SharedWorkerServerConnector} instance from the
	 * {@IProtocol listener} and call the {@link connect connect()} method.
	 * 
	 * #### Why SharedWorker be a server?
	 * SharedWorker, it allows only an instance (process) to be created whether the SharedWorker is declared in a browser
	 * or multiple browsers. To integrate them, messages are being sent and received. Doesn't it seem like a relationship
	 * between a server and clients? Thus, Samchon Framework consider the SharedWorker as a server and browsers as
	 * clients.
	 *
	 * The class {@link SharedWorkerCommunicator} is designed make such relationship. From now on, SharedWorker is a
	 * {@link SharedWorkerServer server} and {@link SharedWorkerServerConnector browsers} are clients. Integrate the
	 * server and clients with this {@link SharedWorkerCommunicator}.
	 * 
	 * #### [Inherited] {@link IServerConnector}
	 * {@link IServerConnector} is a type of {@link ICommunicator}, specified for server connector classes who connect to
	 * the remote server as a client. {@link IServerConnector} provides {@link connect connection method} and takes full
	 * charge of network communication with the remote server.
	 *
	 * Declare specific type of {@link IServerConnector} from {@link IProtocol listener} and call the
	 * {@link connect connect()} method. Then whenever a replied message comes from the remote system, the message will
	 * be converted to an {@link Invoke} class and the {@link Invoke} object will be shifted to the
	 * {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 *
	 * Note that, protocol of this client and remote server must be matched. Thus, before determining specific type of
	 * this {@link IServerConnector}, you've to consider which protocol and type the remote server follows.
	 *
	 * Protocol | Derived Type | Connect to
	 * ---------|--------------|---------------
	 * Samchon Framework's own | {@link ServerConnector} | {@link Server}
	 * Web-socket protocol | {@link WebServerConnector} | {@link WebServer}
	 * SharedWorker | {@link SharedWorkerServerConnector} | {@link SharedWorkerServer}
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link SharedWorkerServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class SharedWorkerServerConnector
		extends SharedWorkerCommunicator
		implements IServerConnector
	{
		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		/* ---------------------------------------------------------
			CONSTRUCTORS AND CONNECTORS
		--------------------------------------------------------- */
		/**
		 * Construct from *listener*.
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
		 */
		public constructor(listener: IProtocol)
		{
			super(listener);

			this.connected_ = false;
			this.onConnect = null;
		}
		
		/**
		 * Connect to a SharedWorker.
		 * 
		 * Connects to a server with specified *jstFile* path. If a SharedWorker instance of the *jsFile* is not 
		 * constructed yet, then the SharedWorker will be newly constructed. Otherwise the SharedWorker already exists,
		 * then connect to the SharedWorker. After those processes, callback function {@link onConnect} is called. 
		 * Listening data from the connected server also begins. Replied messages from the connected server will be 
		 * converted to {@link Invoke} classes and will be shifted to the {@link WebCommunicator.listener listener}'s 
		 * {@link IProtocol.replyData replyData()} method.
		 * 
		 * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
		 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
		 * the status of the connection is reported by an event. If the socket is already connected, the existing 
		 * connection is closed first.
		 * 
		 * @param jsFile Path of JavaScript file to execute who defines SharedWorker.
		 */
		public connect(jsFile: string): void
		{
			// CONSTRUCT AND START SHARED-WORKER-SERVER
			let worker: SharedWorker = new SharedWorker(jsFile);
			
			// LISTEN MESSAGE
			this.port_ = worker.port;
			this.port_.onmessage = this.handle_message.bind(this);

			// NOTIFY THE CONNECTION
			this.connected_ = true;
			if (this.onConnect != null)
				this.onConnect();
		}
	}
}