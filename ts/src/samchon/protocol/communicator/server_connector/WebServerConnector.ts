/// <reference path="../../../API.ts" />

/// <reference path="../communicator/WebCommunicator.ts" />

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
	 * @copydoc IServerConnector
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
				this.node_client_.on("connect", this._Handle_node_connect.bind(this));

				this.node_client_.connect(address);
			}
			else
			{
				this.browser_socket_ = new WebSocket(address);
				
				this.browser_socket_.onopen = this._Handle_browser_connect.bind(this);
				this.browser_socket_.onerror = this.handle_close.bind(this);
				this.browser_socket_.onclose = this.handle_close.bind(this);
				this.browser_socket_.onmessage = this._Handle_browser_message.bind(this);
			}
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (is_node() == true)
				super.close();
			else
				this.browser_socket_.close();
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
		private _Handle_browser_connect(event: Event): void
		{
			this.connected_ = true;

			if (this.onConnect != null)
				this.onConnect();
		}

		/**
		 * @hidden
		 */
		private _Handle_browser_message(event: MessageEvent): void
		{
			if (this._Is_binary_invoke() == false)
				this._Handle_string(event.data);
			else
				this._Handle_binary(event.data);
		}

		/**
		 * @hidden
		 */
		private _Handle_node_connect(connection: websocket.connection): void
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