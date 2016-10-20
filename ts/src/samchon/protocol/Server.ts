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
	 * object. Then at last, call {@link open open()} method with specified port number.
	 * 
	 * Protocol                | Derived Type                  | Related {@link IClientDriver}
	 * ------------------------|-------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerClientDriver}
	 *  
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients. 
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service.Server}
	 * - {@link external.ExternalClientArray}
	 * - {@link slave.SlaveServer}
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
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
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
		 * The {@link addClient addClient()} is an abstract method being called when a remote client is newly connected 
		 * with {@link IClientDriver} object who communicates with the remote system. Overrides this method and defines 
		 * what to do with the *driver*, a newly connected remote client. 
		 * 
		 * Below methods and example codes may be good for comprehending how to utilize this {@link addClient} method.
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

	/**
	 * A server.
	 * 
	 * The {@link Server} is an abstract class designed to open a server and accept clients who are following Samchon
	 * Framework's own protocol. Extends this {@link Server} class and overrides {@link addClient addClient()} method to
	 * define what to do with newly connected {@link ClientDriver remote clients}.
	 *
	 * #### [Inherited] {@link IServer}
	 * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
	 * {@link IClientDriver accepting clients}.
	 *
	 * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
	 * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
	 * object. Then at last, call {@link open open()} method with specified port number.
	 *
	 * Protocol                | Derived Type                  | Related {@link IClientDriver}
	 * ------------------------|-------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerClientDriver}
	 *
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients.
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service.Server}
	 * - {@link external.ExternalClientArray}
	 * - {@link slave.SlaveServer}
	 *
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link ClientDriver}, {@link ServerBase}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
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

		/**
		 * @hidden
		 */
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

	/**
	 * A web server.
	 *
	 * The {@link WebServer} is an abstract class designed to open a server and accept clients who are following 
	 * web-socket protocol. Extends this {@link WebServer} class and overrides {@link addClient addClient()} method to
	 * define what to do with newly connected {@link WebClientDriver remote clients}.
	 * 
	 * #### [Inherited] {@link IServer}
	 * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
	 * {@link IClientDriver accepting clients}.
	 *
	 * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
	 * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
	 * object. Then at last, call {@link open open()} method with specified port number.
	 *
	 * Protocol                | Derived Type                  | Related {@link IClientDriver}
	 * ------------------------|-------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerClientDriver}
	 *
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients.
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service.Server}
	 * - {@link external.ExternalClientArray}
	 * - {@link slave.SlaveServer}
	 *
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link WebClientDriver}, {@link WebServerBase}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class WebServer implements IServer
	{
		/**
		 * @hidden
		 */
		private http_server_: socket.http_server;
		
		/**
		 * @hidden
		 */
		private sequence_: number; // Sequence number for issuing session id.

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
		 * @hidden
		 */
		private handle_request(request: websocket.request): void
		{
			//--------
			// Handle request from a client system.
			// 
			// This method "handle_request()" will be called when a client is connected. It will call an abstract method 
			// "addClient()" who handles an accepted client. If the newly connected client doesn't have its own session 
			// id, then a new session id will be issued.
			// 
			// @param request Requested header.
			//--------
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
		 * @hidden
		 */
		private get_session_id(cookies: websocket.ICookie[]): string
		{
			//--------
			// Get session id from a newly connected.
			// 
			// Queries ordinary session id from cookies of a newly connected client. If the client has not, a new session 
			// id will be issued.
			// 
			// @param cookies Cookies from the remote client.
			// @return Session id
			//--------
			for (let i: number = 0; i < cookies.length; i++)
				if (cookies[i].name == "SESSION_ID")
					return cookies[i].value;

			return this.issue_session_id();
		}

		/**
		 * @hidden
		 */
		private issue_session_id(): string
		{
			// Issue a new session id.
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
	/**
	 * A SharedWorker server.
	 *
	 * The {@link DedicatedWorkerServer} is an abstract class is realized to open a DedicatedWorker server and accept 
	 * web-browser client (master). Extends this {@link DedicatedWorkerServer} class and overrides 
	 * {@link addClient addClient()} method to define what to do with a newly connected 
	 * {@link DedicatedWorkerClientDriver remote client}.
	 * 
	 * #### Why DedicatedWorker be a server?
	 * In JavaScript environment, there's no way to implement multi-threading function. Instead, JavaScript supports the
	 * **Worker**, creating a new process. However, the **Worker** does not shares memory addresses. To integrate the
	 * **Worker** with its master, only communication with string or binary data is allowed. Doesn't it seem like a network
	 * communication? Furthermore, there's not any difference between the worker communication and network communication.
	 * It's the reason why Samchon Framework considers the **Worker** as a network node.
	 *
	 * The class {@link DedicatedWorkerCommunicator} is designed make such relationship. From now on, DedicatedWorker is a
	 * {@link DedicatedWorkerServer server} and {@link DedicatedWorkerServerConnector browser} is a client. Integrate the
	 * server and clients with this {@link DedicatedWorkerCommunicator}.
	 * 
	 * #### [Inherited] {@link IServer}
	 * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
	 * {@link IClientDriver accepting clients}.
	 *
	 * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
	 * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
	 * object. Then at last, call {@link open open()} method with specified port number.
	 *
	 * Protocol                | Derived Type                  | Related {@link IClientDriver}
	 * ------------------------|-------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerClientDriver}
	 *
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients.
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service.Server}
	 * - {@link external.ExternalClientArray}
	 * - {@link slave.SlaveServer}
	 *
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link DedicatedWorkerClientDriver}, {@link DedicatedWorkerServerBase}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DedicatedWorkerServer implements IServer
	{
		/**
		 * @inheritdoc
		 */
		public open(): void
		{
			this.addClient(new DedicatedWorkerClientDriver());
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			close();
		}

		/**
		 * @inheritdoc
		 */
		public abstract addClient(driver: DedicatedWorkerClientDriver): void;
	}
}

namespace samchon.protocol
{
	/**
	 * A SharedWorker server.
	 *
	 * The {@link SharedWorker} is an abstract class is realized to open a SharedWorker server and accept web-browser 
	 * clients. Extends this {@link SharedWorkerServer} class and overrides {@link addClient addClient()} method to 
	 * define what to do with newly connected {@link SharedWorkerClientDriver remote clients}.
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
	 * #### [Inherited] {@link IServer}
	 * {@link IServer} is an interfaec for server classes who are providing methods for {@link open opening a server} and
	 * {@link IClientDriver accepting clients}.
	 *
	 * To open a server, extends one of derived class under below considedring which protocol to follow first. At next,
	 * overrides {@link addClient addClient()} method who accepts a newly connected client as an {@link IClientDriver}
	 * object. Then at last, call {@link open open()} method with specified port number.
	 *
	 * Protocol                | Derived Type                  | Related {@link IClientDriver}
	 * ------------------------|-------------------------------|-------------------------------------
	 * Samchon Framework's own | {@link Server}                | {@link ClientDriver}
	 * Web-socket protocol     | {@link WebServer}             | {@link WebClientDriver}
	 * DedicatedWorker         | {@link DedicatedWorkerServer} | {@link DedicatedWorkerClientDriver}
	 * SharedWorker            | {@link SharedWorkerServer}    | {@link SharedWorkerClientDriver}
	 *
	 * Below codes and classes will be good examples for comprehending how to open a server and handle remote clients.
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * - https://github.com/samchon/framework/blob/master/ts/examples/chat-server/server.ts
	 * - {@link service.Server}
	 * - {@link external.ExternalClientArray}
	 * - {@link slave.SlaveServer}
	 *
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link SharedWorkerClientDriver}, {@link SharedWorkerServerBase}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
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
			close();
		}

		/**
		 * @hidden
		 */
		private handle_connect(event: {ports: MessagePort[]}): void
		{
			let port: MessagePort = event.ports[event.ports.length - 1];
			let driver: SharedWorkerClientDriver = new SharedWorkerClientDriver(port);

			this.addClient(driver);
		}
	}
}