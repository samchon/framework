/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export interface IServer
	{
		open(port: number): void;

		close(): void;

		addClient(clientDriver: IClientDriver): void;
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

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.http_server.close();
		}

		/**
		 * @inheritdoc
		 */
		public abstract addClient(driver: WebClientDriver): void;

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