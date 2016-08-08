/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface for a physical server. </p>
	 * 
	 * <p> {@link IServer} provides methods for opening a server. Extends one of them who are derived from this 
	 * {@link IServer} and open the server with method {@link open IServer.open()}. Override 
	 * {@link addClient IServer.addClient()} who accepts a newly connected client with {@link IClientDriver}. 
	 * If you're embarrased because your class already extended another one, then use {@link IServerBase}. </p>
	 * 
	 * <ul>
	 *	<li> {@link Server} </li>
	 *	<li> {@link WebServer} </li>
	 *	<li> {@link SharedWorkerServer} </li>
	 * </ul>
	 * 
	 * <p> <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
	 * 
	 * <h2> Basic Components </h2>
	 * <h4> What Basic Components are </h4>
	 * <p> <b>Basic Components</b> are the smallest unit of network communication in this <i>Samchon Framework</i>. With
	 * <b>Basic Components</b>, you can construct any type of network system, even how the network system is enormously
	 * scaled and complicated, by just combinating the <b>Basic Components</b>. </p>
	 *
	 * <p> All the system templates in this framework are also being implemented by utilization of the
	 * <b>Basic Compoonents</b>. </p>
	 *
	 * <ul>
	 *	<li> {@link service Service} </il>
	 *	<li> {@link external External System} </il>
	 *	<li> {@link parallel Parallel System} </il>
	 *	<li> {@link distributed Distributed System} </il>
	 * </ul>
	 *
	 * <p> Note that, whatever the network system what you've to construct is, just concentrate on role of each system
	 * and attach matched <b>Basic Components</b> to the role, within framework of the <b>Object-Oriented Design</b>.
	 * Then construction of the network system will be much easier. </p>
	 *
	 * <ul>
	 *	<li> A system is a server, then use {@link IServer} or {@link IServerBase}. </li>
	 *	<li> A server wants to handle a client has connected, then use {@link IClientDriver}. </li>
	 *	<li> A system is a client connecting to an external server, then use {@link IServerConnector}. </li>
	 *	<li> </li>
	 * </ul>
	 *
	 * <h4> Example - System Templates </h4>
	 * <p> Learning and understanding <i>Basic Components</i> of Samchon Framework, reading source codes and design of
	 * <b>System Templates</b>' modules will be very helpful. </p>
	 *
	 * <table>
	 *	<tr>
	 *		<th> Name </th>
	 *		<th> Source </th>
	 *		<th> API Documents </th>
	 *	</tr>
	 *	<tr>
	 *		<td> Cloud Service </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/service"
	 *				target="_blank"> protocol/service </a> </td>
	 *		<td> {@link protocol.service} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> External System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/external"
	 *				target="_blank"> protocol/external </a> </td>
	 *		<td> {@link protocol.external} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> Parallel System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/parallel"
	 *				target="_blank"> protocol/parallel </a> </td>
	 *		<td> {@link protocol.parallel} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> Distributed System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/distributed"
	 *				target="_blank"> protocol/distributed </a> </td>
	 *		<td> {@link protocol.distributed} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> Slave System </td>
	 *		<td> <a href="https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/slave"
	 *				target="_blank"> protocol/slave </a> </td>
	 *		<td> {@link protocol.slave} </td>
	 *	</tr>
	 * </table>
	 *
	 * <h4> Example - Projects </h4>
	 * <ul>
	 *	<li>
	 *		<a href="https://github.com/samchon/framework/wiki/Examples-Calculator" target="_blank"> Calculator </a>
	 *	</li>
	 *	<li>
	 *		<a href="https://github.com/samchon/framework/wiki/Examples-Chatting" target="_blank"> Chatting </a>
	 *	</li>
	 *	<li>
	 *		<a href="https://github.com/samchon/framework/wiki/Examples-Interaction" target="_blank"> Interaction </a>
	 *	</li>
	 * </ul>
	 *
	 * @see {@link IClientDriver}
	 * @handbook <a href="https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iserver"
	 *			 target="_blank"> Basic Components - IServer </a>
	 * @author Jeongho Nam <http://samchon.org>
	 */
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