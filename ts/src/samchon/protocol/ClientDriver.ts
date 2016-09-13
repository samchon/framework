/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface for communicator with connected client. </p>
	 * 
	 * <p> {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with connected client
	 * in a server. It takes full charge of network communication with the connected client. </p>
	 * 
	 * <p> {@link IClientDriver} is created in {@link IServer} and delivered via 
	 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being 
	 * created by matched {@link IServer} object. </p>
	 * 
	 * <table>
	 *	<tr>
	 *		<th> Derived Type </th>
	 *		<th> Created By </th>
	 *	</tr>
	 *	<tr>
	 *		<td> {@link ClientDrvier} </td>
	 *		<td> {@link Server} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> {@link WebClientDrvier} </td>
	 *		<td> {@link WebServer} </td>
	 *	</tr>
	 *	<tr>
	 *		<td> {@link SharedWorkerClientDrvier} </td>
	 *		<td> {@link SharedWorkerServer} </td>
	 *	</tr>
	 * </table>
	 *
	 * <p> <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
	 * 
	 * <p> When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
	 * specify {@link CommunicatorBase.listener listener} with {@link IClient.listen IClient.listen()}. Below codes are 
	 * an example specifying and managing the {@link CommunicatorBase.listener listener} objects. </p>
	 * 
	 * <code>
	/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
	/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

	// IMPORTS
	import std = require("typescript-stl");
	import samchon = require("samchon-framework");

	// SHORTCUTS
	import library = samchon.library;
	import protocol = samchon.protocol;

	class CalculatorServer extends protocol.Server
	{
		private clients: std.HashSet<CalculatorClient>;

		// WHEN A CLIENT HAS CONNECTED
		public addClient(driver: IClientDriver): void
		{
			let client: CalculatorClient = new CalculatorClient(this, driver);
			this.clients.insert(client);
		}
	}

	class CalculatorClient extends protocol.IProtocol
	{
		// PARENT SERVER INSTANCE
		private server: CalculatorServer;

		// COMMUNICATOR, SENDS AND RECEIVES NETWORK MESSAGE WITH CONNECTED CLIENT
		private driver: protocol.IClientDriver;

		/////
		// CONSTRUCTORS
		/////
		public constructor(server: CalculatorServer, driver: protocol.IClientDriver)
		{
			this.server = server;
			this.driver = driver;

			// START LISTENING AND RESPOND CLOSING EVENT
			this.driver.listen(this); // INVOKE MESSAGE WILL COME TO HERE
			this.driver.onClose = this.destructor.bind(this); // DISCONNECTED HANDLER
		}
		public destructor(): void
		{
			// WHEN DISCONNECTED, THEN ERASE THIS OBJECT FROM CalculatorServer.clients.
			this.server["clients"].erase(this);
		}

		/////
		// INVOKE MESSAGE CHAIN
		/////
		public sendData(invoke: protocol.Invoke): void
		{
			// CALL ICommunicator.sendData(), WHO PHYSICALLY SEND NETWORK MESSAGE
			this.driver.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			// FIND MATCHED MEMBER FUNCTION NAMED EQUAL TO THE invoke.getListener()
			invoke.apply(this);
		}
	}
	 * </code>
	 * 
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
	 * @see {@link IServer} 
	 * @handbook <a href="https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver"
	 *			 target="_blank"> Basic Components - IClientDriver </a>
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IClientDriver extends ICommunicator
	{
		/**
		 * <p> Listen message from the newly connected client. </p>
		 * 
		 * <p> Starts listening message from the newly connected client. Replied message from the connected client will
		 * be converted to {@link Invoke} classes and shifted to the <i>listener</i>'s 
		 * {@link IProtocol.replyData replyData()} method. </p>
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in 
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} message.
		 */
		listen(listener: IProtocol): void;
	}
}

namespace samchon.protocol
{
	export class ClientDriver
		extends Communicator
		implements IClientDriver
	{
		public constructor(socket: socket.socket)
		{
			super();

			this.socket_ = socket;
			this.connected_ = true;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;
			
			this.start_listen();
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
		private path_: string;

		/**
		 * Session ID, an identifier of the remote client.
		 */
		private session_id_: string;

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

			this.connection_ = connection;
			this.path_ = path;
			this.session_id_ = session_id;

			this.listening_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;

			if (this.listening_ == true)
				return;
			this.listening_ = true;

			this.connection_.on("message", this.handle_message.bind(this));
			this.connection_.on("close", this.handle_close.bind(this));
			this.connection_.on("error", this.handle_close.bind(this));
		}

		/**
		 * Get requested path.
		 */
		public getPath(): string
		{
			return this.path_;
		}

		/**
		 * Get session ID, an identifier of the remote client.
		 */
		public getSessionID(): string
		{
			return this.session_id_;
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerClientDriver 
		extends SharedWorkerCommunicator
		implements IClientDriver
	{
		private listening_: boolean;

		public constructor(port: MessagePort)
		{
			super();

			this.port_ = port;
			this.connected_ = true;
			this.listening_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;

			if (this.listening_ == true)
				return;
			this.listening_ = true;

			this.port_.onmessage = this.handle_message.bind(this);
		}
	}
}