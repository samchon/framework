/// <reference path="../API.ts" />

/// <reference path="Server.ts" />
/// <reference path="ClientDriver.ts" />
/// <reference path="ServerConnector.ts" />

namespace samchon.protocol
{
	export class WebCommunicatorBase implements IProtocol
	{
		private communicator: IProtocol;
		private connection: websocket.connection;

		public constructor(clientDriver: WebClientDriver, connection: websocket.connection);
		public constructor(serverConnector: WebServerConnector, connection: websocket.connection);

		public constructor(communicator: IProtocol, connection: websocket.connection)
		{
			this.communicator = communicator;
			this.connection = connection;
		}

		public listen(): void
		{
			this.connection.on("message", this.handle_message.bind(this));
		}

		private handle_message(message: websocket.IMessage)
		{
			if (message.type == "utf8")
				this.replyData(new Invoke(new library.XML(message.utf8Data)));
		}

		public replyData(invoke: Invoke): void
		{
			this.communicator.replyData(invoke);
		}

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
		private http_server: socket.http_server;

		private sequence: number;

		public constructor()
		{
			super();

			this.sequence = 0;
		}

		public open(port: number): void
		{
			this.http_server = http.createServer();
			this.http_server.listen(port);

			let ws_server = new websocket.server({ httpServer: this.http_server });
			ws_server.on("request", this.handle_request.bind(this));
		}

		protected abstract addClient(driver: WebClientDriver): void;

		private handle_request(request: websocket.request): void
		{
			let path: string = request.resource;
			let session_id: string = this.get_session_id(request.cookies);

			let connection = request.accept
				(
				"", request.origin,
				[{ name: "SESSION_ID", value: session_id }]
				);

			let driver = new WebClientDriver(connection, path, session_id);
			this.addClient(driver);
		}

		private get_session_id(cookies: websocket.ICookie[]): string
		{
			for (let i: number = 0; i < cookies.length; i++)
				if (cookies[i].name == "SESSION_ID")
					return cookies[i].value;

			return this.issue_session_id();
		}

		private issue_session_id(): string
		{
			return "" + ++this.sequence;
		}
	}
}

namespace samchon.protocol
{
	export class WebClientDriver extends ClientDriver
	{
		private base: WebCommunicatorBase;
		private path: string;
		private session_id: string;

		public constructor(connection: websocket.connection, path: string, session_id: string)
		{
			super();

			this.base = new WebCommunicatorBase(this, connection);
			this.path = path;
			this.session_id = session_id;
		}

		public listen(listener: IProtocol): void
		{
			this.listener = listener;
			this.base.listen();
		}

		public getPath(): string
		{
			return this.path;
		}
		public getSessionID(): string
		{
			return this.session_id;
		}

		public sendData(invoke: Invoke): void
		{
			this.base.sendData(invoke);
		}
	}
}

namespace samchon.protocol
{
	declare var websocket: typeof __websocket;

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
	export class WebServerConnector
		extends ServerConnector
	{
		///////
		// WEB-BROWSER
		///////
		/**
		 * <p> A socket for network I/O. </p>
		 */
		private socket: WebSocket = null;

		///////
		// NODE CLIENT
		///////
		private client: websocket.client = null;
		private base: WebCommunicatorBase = null;

		/**
		 * <p> Constructor with parent. </p>
		 */
		public constructor(listener: IProtocol) 
		{
			super(listener);
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
				this.client = new websocket.client();
				this.client.on("connect", this.handle_node_connect.bind(this));

				this.client.connect(address);
			}
			else
			{
				this.socket = new WebSocket(address);

				this.socket.onopen = this.handle_browser_connect.bind(this);
				this.socket.onmessage = this.handle_browser_message.bind(this);
			}
		}

		/* ----------------------------------------------------
			IPROTOCOL'S METHOD
		---------------------------------------------------- */
		/**
		 * <p> Send data to the server. </p>
		 */
		public sendData(invoke: Invoke): void 
		{
			if (this.socket != null)
			{
				this.socket.send(invoke.toXML().toString());

				for (let i: number = 0; i < invoke.size(); i++)
					if (invoke.at(i).getType() == "ByteArray")
						this.socket.send(invoke.at(i).getValue());
			}
			else
			{
				this.base.sendData(invoke);
			}
		}

		private handle_browser_connect(event: Event): void
		{
			if (this.onopen != null)
				this.onopen();
		}

		/**
		 * <p> Handling replied message. </p>
		 */
		private handle_browser_message(event: MessageEvent): void
		{
			this.replyData(new Invoke(new library.XML(event.data)));
		}

		private handle_node_connect(connection: websocket.connection): void
		{
			this.base = new WebCommunicatorBase(this, connection);
			this.base.listen();

			if (this.onopen != null)
				this.onopen();
		}
	}
}