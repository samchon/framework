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
		 * @param host The name or IP address of the host to connect to. 
		 *			   If no host is specified, the host that is contacted is the host where the calling file resides. 
		 *			   If you do not specify a host, use an event listener to determine whether the connection was 
		 *			   successful.
		 * @param port The port number to connect to.
		 */
		connect(ip: string, port: number): void;
	}
}

namespace samchon.protocol
{
	declare var net: typeof NodeJS.net;

	export class NormalServerConnector
		extends NormalCommunicator
		implements IServerConnector
	{
		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		public constructor(listener: IProtocol)
		{
			super();

			this.listener = listener;
		}

		/**
		 * @inheritdoc
		 */
		public connect(ip: string, port: number): void
		{
			this.socket = net.connect({ host: ip, port: port }, this.handle_connect.bind(this));
		}

		private handle_connect(...arg: any[]): void
		{
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
		private browser_socket: WebSocket;

		///////
		// NODE CLIENT
		///////
		/**
		 * <p> A driver for server connection. </p>
		 * 
		 * <p> Note that, {@link node_client} is only used in NodeJS environment. </p>
		 */
		private node_client: websocket.client;

		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		/* ----------------------------------------------------
			CONSTRUCTORS
		---------------------------------------------------- */
		public constructor(listener: IProtocol)
		{
			super();

			this.listener = listener;
			this.browser_socket = null;
			this.node_client = null;

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
				this.node_client = new websocket.client();
				this.node_client.on("connect", this.handle_node_connect.bind(this));

				this.node_client.connect(address);
			}
			else
			{
				this.browser_socket = new WebSocket(address);

				this.browser_socket.onopen = this.handle_browser_connect.bind(this);
				this.browser_socket.onerror = this.handle_close.bind(this);
				this.browser_socket.onclose = this.handle_close.bind(this);
				this.browser_socket.onmessage = this.handle_browser_message.bind(this);
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
			if (this.browser_socket != null)
			{
				this.browser_socket.send(invoke.toXML().toString());

				for (let i: number = 0; i < invoke.size(); i++)
					if (invoke.at(i).getType() == "ByteArray")
						this.browser_socket.send(invoke.at(i).getValue());
			}
			else
			{
				super.sendData(invoke);
			}
		}

		private handle_browser_connect(event: Event): void
		{
			if (this.onConnect != null)
				this.onConnect();
		}

		private handle_browser_message(event: MessageEvent): void
		{
			this.replyData(new Invoke(new library.XML(event.data)));
		}

		private handle_node_connect(connection: websocket.connection): void
		{
			this.connection = connection;
			this.connection.on("message", this.handle_message.bind(this));
			this.connection.on("close", this.handle_close.bind(this));
			this.connection.on("error", this.handle_close.bind(this));

			if (this.onConnect != null)
				this.onConnect();
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerServerConnector
		implements IServerConnector
	{
		private listener: IProtocol;

		private worker: any; //SharedWorker;
		private communicator_base: NormalCommunicatorBase;

		/**
		 * @inheritdoc
		 */
		public onConnect: Function;
		
		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		/* ---------------------------------------------------------
			CONSTRUCTORS AND CONNECTORS
		--------------------------------------------------------- */
		public constructor(listener: IProtocol)
		{
			this.listener = listener;
			this.worker = null;
		}
		
		public connect(jsFile: string): void
		{
			this.worker = new SharedWorker(jsFile);
			this.worker.port.addEventListener("message", this.handle_message.bind(this));

			this.worker.port.start();
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.worker.port.close();
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		private handle_message(event: MessageEvent): void
		{
			this.communicator_base.listen_piece(event.data);
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}

		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			this.worker.port.postMessage(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteaArray")
					this.worker.port.postMessage(invoke.at(i).getValue());
		}
	}
}