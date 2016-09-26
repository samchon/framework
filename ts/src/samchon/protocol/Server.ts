/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * An interface for a server.
	 * 
	 * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and 
	 * {@link IClientDriver accepting clients}.
	 * 
	 * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
	 * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
	 * object. Then at last, call {@link open()} method with specified port number. Below code will be a good example for 
	 * opening a server and handling remote clients using {@link IServer}.
	 * 
	 * Protocol | Derived Type 
	 * ---------|--------------
	 * Samchon Framework's own | {@link ServerConnector}
	 * Web-socket protocol | {@link WebServerConnector}
	 * SharedWorker | {@link SharedWorkerServerConnector}
	 *  
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * 
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link IClientDriver}, {@link IServerBase}
	 * @handbook [Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserverconnector)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IServer
	{
		/**
		 * Open server.
		 * 
		 * @param port Port number to open.
		 */
		open(port: number): void;

		/**
		 * Close server. 
		 * 
		 * Close opened server. All remote clients, have connected with this server, are also closed and their call back 
		 * functions, for closed connection, {@link IClientDriver.onClose} are also called.
		 */
		close(): void;

		/**
		 * Add a newly connected remote client.
		 * 
		 * Overrides this method and defines what to do with the *driver*, a newly connected remote client. Below modules
		 * and example codes may be good examples how to utilize this {@link addClient addClient()} method.
		 * 
		 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
		 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
		 * - {@link service.Server.addClient}
		 * - {@link external.ExternalClientArray.addClient}
		 * - {@link slave.SlaveServer.addClient}
		 * 
		 * @param driver A {@link ICommunicator communicator} with (newly connected) remote client.
		 */
		addClient(driver: IClientDriver): void;
	}
}

namespace samchon.protocol
{
	/**
	 * @hidden
	 */
	declare var net: typeof NodeJS.net;

	export abstract class Server implements IServer
	{
		/**
		 * @hidden
		 */
		private server: socket.server;

		/**
		 * @inheritdoc
		 */
		public abstract addClient(driver: ClientDriver): void;

		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server = net.createServer(this.handle_connect.bind(this));
			this.server.listen(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.server.close();
		}

		private handle_connect(socket: socket.server): void
		{
			let clientDriver: ClientDriver = new ClientDriver(socket);;
			this.addClient(clientDriver);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * @hidden
	 */
	declare var http: typeof NodeJS.http;
	
	/**
	 * @hidden
	 */
	declare var websocket: typeof __websocket;

	export abstract class WebServer implements IServer
	{
		/**
		 * A server handler.
		 */
		private http_server_: socket.http_server;

		/** 
		 * Sequence number for issuing session id.
		 */
		private sequence_: number;

		/**
		 * @hidden
		 */
		private my_port_: number;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			this.sequence_ = 0;
		}

		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.my_port_ = port;

			this.http_server_ = http.createServer();
			this.http_server_.listen(port);

			let ws_server = new websocket.server({ httpServer: this.http_server_ });
			ws_server.on("request", this.handle_request.bind(this));
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.http_server_.close();
		}

		/**
		 * @inheritdoc
		 */
		public abstract addClient(driver: WebClientDriver): void;

		/**
		 * Handle request from a client system.
		 * 
		 * This method {@link handle_request} will be called when a client is connected. It will call an abstract 
		 * method method {@link addClient addClient()} who handles an accepted client. If the newly connected client 
		 * doesn't have its own session id, then a new session id will be issued.
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
		 * Get session id from a newly connected.
		 * 
		 * Queries ordinary session id from cookies of a newly connected client. If the client has not, a new 
		 * session id will be issued.
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
			let port: number = this.my_port_;
			let uid: number = ++this.sequence_;
			let linux_time: number = new Date().getTime();
			let rand: number = Math.floor(Math.random() * 0xffffffff);

			return port.toString(16) + uid.toString(16) + linux_time.toString(16) + rand.toString(16);
		}
	}
}

namespace samchon.protocol
{
	export abstract class SharedWorkerServer implements IServer
	{
		/**
		 * @inheritdoc
		 */
		public abstract addClient(driver: SharedWorkerClientDriver): void;

		/**
		 * @inheritdoc
		 */
		public open(): void
		{
			self.addEventListener("connect", this.handle_connect.bind(this));
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			// MAY IMPOSSIBLE
		}

		private handle_connect(event: {ports: MessagePort[]}): void
		{
			let port: MessagePort = event.ports[event.ports.length - 1];
			let driver: SharedWorkerClientDriver = new SharedWorkerClientDriver(port);

			this.addClient(driver);
		}
	}
}