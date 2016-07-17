/// <reference path="../API.ts" />

/// <reference path="Server.ts" />

namespace samchon.protocol
{
	/**
	 * <p> Base class for web-communicator, {@link WebClientDriver} and {@link WebServerConnector}. </p>
	 * 
	 * <p> This class {@link WebCommunicatorBase} subrogates network communication for web-communicator classes, 
	 * {@link WebClinetDriver} and {@link WebServerConnector}. The web-communicator and this class 
	 * {@link WebCommunicatorBase} share same interface {@link IProtocol} and have a <b>chain of responsibily</b> 
	 * relationship. </p>
	 * 
	 * <p> When an {@link Invoke} message was delivered from the connected remote system, then this class calls 
	 * web-communicator's {@link WebServerConnector.replyData replyData()} method. Also, when called web-communicator's 
	 * {@link WebClientDriver.sendData sendData()}, then {@link sendData sendData()} of this class will be caleed. </p>
	 * 
	 * <ul>
	 *	<li> this.replyData() -> communicator.replyData() </li>
	 *	<li> communicator.sendData() -> this.sendData() </li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class WebCommunicator implements ICommunicator
	{
		/**
		 * Communicator of web-socket.
		 */
		protected listener: IProtocol;
		
		/**
		 * Connection driver, a socket for web-socket.
		 */
		protected connection: websocket.connection;

		public onClose: Function;

		/**
		 * Initialization Constructor.
		 * 
		 * @param communicator Communicator of web-socket.
		 * @param connection Connection driver, a socket for web-socket.
		 */
		public constructor()
		{
			this.listener = null;
			this.connection = null;

			this.onClose = null;
		}

		/**
		 * Listen message from remoate system.
		 */
		//public listen(): void
		//{
		//	this.connection.on("message", this.handle_message.bind(this));
		//}

		/**
		 * Close the connection.
		 */
		public close(): void
		{
			this.connection.close();
		}

		/**
		 * <p> Handle raw-data received from the remote system. </p>
		 * 
		 * <p> Queries raw-data received from the remote system. When the raw-data represents an formal {@link Invoke} 
		 * message, then it will be sent to the {@link replyData}. </p> 
		 * 
		 * @param message A raw-data received from the remote system.
		 */
		protected handle_message(message: websocket.IMessage)
		{
			if (message.type == "utf8")
				this.replyData(new Invoke(new library.XML(message.utf8Data)));
			else
				message.binaryData
		}

		protected handle_close(): void
		{
			if (this.onClose != null)
				this.onClose();
		}

		/**
		 * Reply {@link Invoke} message from the remote system. </p>
		 * 
		 * <p> {@link WebCommunicator} delivers replied {@link Invoke} message from remote system to its parent class,
		 * {@link communicator}. </p>
		 * 
		 * @param invoke An Invoke message replied from the remote system.
		 */
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}

		/**
		 * <p> Send message to the remote system. </p>
		 * 
		 * {@link WebCommunicator}.{@link sendData} is called from its parent {@link communicator}'s sendData(). </p>
		 * 
		 * @param invoke An Inovoke message to send to the remote system.
		 */
		public sendData(invoke: Invoke): void
		{
			this.connection.sendUTF(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					this.connection.sendBytes(invoke.at(i).getValue());
		}
	}
}

namespace samchon.protocol
{
	declare var http: typeof NodeJS.http;
	declare var websocket: typeof __websocket;

	export abstract class WebServer extends Server
	{
		/**
		 * A server handler.
		 */
		private http_server: socket.http_server;

		/** 
		 * Sequence number for issuing session id.
		 */
		private sequence: number;

		/**
		 * @hidden
		 */
		private my_port: number;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.sequence = 0;
		}

		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.my_port = port;

			this.http_server = http.createServer();
			this.http_server.listen(port);

			let ws_server = new websocket.server({ httpServer: this.http_server });
			ws_server.on("request", this.handle_request.bind(this));
		}

		public close(): void
		{
			this.http_server.close();
		}

		/**
		 * @inheritdoc
		 */
		protected abstract addClient(driver: WebClientDriver): void;

		/**
		 * <p> Handle request from a client system. </p>
		 * 
		 * <p> This method {@link handle_request} will be called when a client is connected. It will call an abstract 
		 * method method {@link addClient addClient()} who handles an accepted client. If the newly connected client 
		 * doesn't have its own session id, then a new session id will be issued. </p>
		 * 
		 * @param request Requested header.
		 */
		private handle_request(request: websocket.request): void
		{
			let path: string = request.resource.substr(1);
			let session_id: string = this.get_session_id(request.cookies);

			let connection = request.accept
			(
				"", request.origin,
				[{ name: "SESSION_ID", value: session_id }]
			);

			let driver = new WebClientDriver(connection, path, session_id);
			this.addClient(driver);
		}

		/**
		 * <p> Get session id from a newly connected. </p>
		 * 
		 * <p> Queries ordinary session id from cookies of a newly connected client. If the client has not, a new 
		 * session id will be issued. </p>
		 * 
		 * @param cookies Cookies from the remote client.
		 */
		private get_session_id(cookies: websocket.ICookie[]): string
		{
			for (let i: number = 0; i < cookies.length; i++)
				if (cookies[i].name == "SESSION_ID")
					return cookies[i].value;

			return this.issue_session_id();
		}

		/**
		 * Issue a new session id.
		 */
		private issue_session_id(): string
		{
			let port: number = this.my_port;
			let uid: number = ++this.sequence;
			let linux_time: number = new Date().getTime();
			let rand: number = Math.floor(Math.random() * 0xffffffff);

			return port.toString(16) + uid.toString(16) + linux_time.toString(16) + rand.toString(16);
		}
	}
}

namespace samchon.protocol
{
	export class WebClientDriver 
		extends WebCommunicator 
		implements IClientDriver
	{
		/**
		 * Requested path.
		 */
		private path: string;
		
		/**
		 * Session ID, an identifier of the remote client.
		 */
		private session_id: string;

		private listening_: boolean;

		/**
		 * Initialization Constructor.
		 * 
		 * @param connection Connection driver, a socket for web-socket.
		 * @param path Requested path.
		 * @param session_id Session ID, an identifier of the remote client.
		 */
		public constructor(connection: websocket.connection, path: string, session_id: string)
		{
			super();

			this.connection = connection;
			this.path = path;
			this.session_id = session_id;

			this.listening_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener = listener;

			if (this.listening_ == false)
			{
				this.listening_=  true;

				this.connection.on("message", this.handle_message.bind(this));
				this.connection.on("close", this.handle_close.bind(this));
				this.connection.on("error", this.handle_close.bind(this));
			}
		}
		
		/**
		 * Get requested path.
		 */
		public getPath(): string
		{
			return this.path;
		}

		/**
		 * Get session ID, an identifier of the remote client.
		 */
		public getSessionID(): string
		{
			return this.session_id;
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