/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface for server connector. </p>
	 * 
	 * <p> {@link IServerConnector} is an interface for server connector classes who ca connect to an external server
	 * as a client. </p>
	 * 
	 * <p> Of course, {@link IServerConnector} is extended from the {@link ICommunicator}, thus, it also takes full
	 * charge of network communication and delivers replied message to {@link WebCommunicator.listener listener}'s
	 * {@link IProtocol.replyData replyData()} method. </p>
	 * 
	 * @handbook <a href="https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector"
	 *			 target="_blank"> Basic Components - IServerConnector </a>
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IServerConnector
		extends ICommunicator
	{
		/**
		 * Callback function for connection completed.
		 */
		onConnect: Function;

		//constructor(listener: IProtocol);

		/**
		 * <p> Connect to a server. </p>
		 * 
		 * <p> Connects to a server with specified <i>host</i> address and <i>port</i> number. After the connection has
		 * succeeded, callback function {@link onConnect} is called. Listening data from the connected server also begins.
		 * Replied messages from the connected server will be converted to {@link Invoke} classes and will be shifted to
		 * the {@link WebCommunicator.listener listener}'s {@link IProtocol.replyData replyData()} method. </p>
		 * 
		 * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
		 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
		 * the status of the connection is reported by an event. If the socket is already connected, the existing 
		 * connection is closed first. </p>
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
	declare var net: typeof NodeJS.net;

	export class ServerConnector
		extends Communicator
		implements IServerConnector
	{
		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

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
	declare var websocket: typeof __websocket;

	/**
	 * <p> A server connector for web-socket protocol. </p>
	 *
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
		 * <p> A socket for network I/O. </p>
		 * 
		 * <p> Note that, {@link socket} is only used in web-browser environment. </p>
		 */
		private browser_socket_: WebSocket;

		///////
		// NODE CLIENT
		///////
		/**
		 * <p> A driver for server connection. </p>
		 * 
		 * <p> Note that, {@link node_client} is only used in NodeJS environment. </p>
		 */
		private node_client_: websocket.client;

		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		/* ----------------------------------------------------
			CONSTRUCTORS
		---------------------------------------------------- */
		public constructor(listener: IProtocol)
		{
			super(listener);

			this.browser_socket_ = null;
			this.node_client_ = null;

			this.connected_ = false;
			this.onConnect = null;
		}

		/**
		 * @inheritdoc
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

		private handle_browser_connect(event: Event): void
		{
			this.connected_ = true;

			if (this.onConnect != null)
				this.onConnect();
		}

		private handle_browser_message(event: MessageEvent): void
		{
			if (this.is_binary_invoke() == false)
				this.handle_string(event.data);
			else
				this.handle_binary(event.data);
		}

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
		public constructor(listener: IProtocol)
		{
			super(listener);

			this.connected_ = false;
			this.onConnect = null;
		}
		
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