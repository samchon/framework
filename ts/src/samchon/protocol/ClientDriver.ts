/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	/**
	 * An interface for communicator with remote client. 
	 * 
	 * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
	 * connected in a {@link IServer server}. It takes full charge of network communication with the remote client. 
	 * 
	 * The {@link IClientDriver} object is created and delivered from {@link IServer} and 
	 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being 
	 * created by the matched {@link IServer} object.
	 * 
	 * Protocol                | Derived Type                        | Created By
	 * ------------------------|-------------------------------------|----------------------------
	 * Samchon Framework's own | {@link ClientDriver}                | {@link Server}
	 * Web-socket protocol     | {@link WebClientDriver}             | {@link WebServer}
	 * DedicatedWorker         | {@link DedicatedWorkerClinetDriver} | {@link DedicatedWorkerServer}
	 * SharedWorker            | {@link SharedWorkerClientDriver}    | {@link SharedWorkerServer}
	 * 
	 * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then 
	 * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes 
	 * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object 
	 * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method. 
	 * Below code is an example specifying and managing the {@link IProtocol listener} objects.
	 * 
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link IServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface IClientDriver extends ICommunicator
	{
		/**
		 * Listen message from the newly connected client.
		 * 
		 * Starts listening message from the newly connected client. Replied message from the connected client will be 
		 * converted to {@link Invoke} classes and shifted to the *listener*'s {@link IProtocol.replyData replyData()} 
		 * method. 
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in 
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
		 */
		listen(listener: IProtocol): void;
	}
}

namespace samchon.protocol
{
	/**
	 * Communicator with remote client.
	 * 
	 * {@link ClientDriver} is a class taking full charge of network communication with remote client who follows Samchon
	 * Framework's own protocol. This {@link ClientDriver} object is always created by {@link Server} class. When you got 
	 * this {@link ClientDriver} object from the {@link Server.addClient Server.addClient()}, then specify 
	 * {@link IProtocol listener} with the {@link ClientDriver.listen ClientDriver.listen()} method.
	 * 
	 * #### [Inherited] {@link IClientDriver}
	 * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
	 * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
	 *
	 * The {@link IClientDriver} object is created and delivered from {@link IServer} and
	 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
	 * created by the matched {@link IServer} object.
	 *
	 * Protocol                | Derived Type                        | Created By
	 * ------------------------|-------------------------------------|----------------------------
	 * Samchon Framework's own | {@link ClientDriver}                | {@link Server}
	 * Web-socket protocol     | {@link WebClientDriver}             | {@link WebServer}
	 * DedicatedWorker         | {@link DedicatedWorkerClinetDriver} | {@link DedicatedWorkerServer}
	 * SharedWorker            | {@link SharedWorkerClientDriver}    | {@link SharedWorkerServer}
	 *
	 * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
	 * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
	 * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
	 * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 * Below code is an example specifying and managing the {@link IProtocol listener} objects.
	 *
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link Server}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class ClientDriver
		extends Communicator
		implements IClientDriver
	{
		/**
		 * Construct from a socket.
		 */
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
	/**
	 * Communicator with remote web-client.
	 * 
	 * {@link WebClientDriver} is a class taking full charge of network communication with remote client who follows 
	 * Web-socket protocol. This {@link WebClientDriver} object is always created by {@link WebServer} class. When you 
	 * got this {@link WebClientDriver} object from the {@link WebServer.addClient WebServer.addClient()}, then specify
	 * {@link IProtocol listener} with the {@link WebClientDriver.listen WebClientDriver.listen()} method.
	 * 
	 * Unlike other protocol, Web-socket protocol's clients notify two parameters on their connection; 
	 * {@link getSessionID session-id} and {@link getPath path}. The {@link getSessionID session-id} can be used to 
	 * identify *user* of each client, and the {@link getPath path} can be used which type of *service* that client wants.
	 * In {@link service} module, you can see the best utilization case of them.
	 * - {@link service.User}: utlization of the {@link getSessionID session-id}.
	 * - {@link service.Service}: utilization of the {@link getPath path}.
	 * 
	 * #### [Inherited] {@link IClientDriver}
	 * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
	 * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
	 *
	 * The {@link IClientDriver} object is created and delivered from {@link IServer} and
	 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
	 * created by the matched {@link IServer} object.
	 *
	 * Protocol                | Derived Type                        | Created By
	 * ------------------------|-------------------------------------|----------------------------
	 * Samchon Framework's own | {@link ClientDriver}                | {@link Server}
	 * Web-socket protocol     | {@link WebClientDriver}             | {@link WebServer}
	 * DedicatedWorker         | {@link DedicatedWorkerClinetDriver} | {@link DedicatedWorkerServer}
	 * SharedWorker            | {@link SharedWorkerClientDriver}    | {@link SharedWorkerServer}
	 *
	 * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
	 * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
	 * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
	 * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 * Below code is an example specifying and managing the {@link IProtocol listener} objects.
	 *
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link WebServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class WebClientDriver
		extends WebCommunicator
		implements IClientDriver
	{
		/**
		 * @hidden
		 */
		private path_: string;

		/**
		 * @hidden
		 */
		private session_id_: string;

		/**
		 * @hidden
		 */
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
	/**
	 * Communicator with master web-browser.
	 * 
	 * {@link DedicatedWorkerClientDriver} is a class taking full charge of network communication with web browsers. This 
	 * {@link DedicatedWorkerClientDriver} object is always created by {@link DedicatedWorkerServer} class. When you got 
	 * this {@link DedicatedWorkerClientDriver} object from 
	 * {@link DedicatedWorkerServer.addClient DedicatedWorkerServer.addClient()}, then specify {@link IProtocol listener} 
	 * with the {@link DedicatedWorkerClientDriver.listen DedicatedWorkerClientDriver.listen()} method.
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
	 * #### [Inherited] {@link IClientDriver}
	 * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
	 * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
	 *
	 * The {@link IClientDriver} object is created and delivered from {@link IServer} and
	 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
	 * created by the matched {@link IServer} object.
	 *
	 * Protocol                | Derived Type                        | Created By
	 * ------------------------|-------------------------------------|----------------------------
	 * Samchon Framework's own | {@link ClientDriver}                | {@link Server}
	 * Web-socket protocol     | {@link WebClientDriver}             | {@link WebServer}
	 * DedicatedWorker         | {@link DedicatedWorkerClinetDriver} | {@link DedicatedWorkerServer}
	 * SharedWorker            | {@link SharedWorkerClientDriver}    | {@link SharedWorkerServer}
	 *
	 * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
	 * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
	 * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
	 * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 * Below code is an example specifying and managing the {@link IProtocol listener} objects.
	 *
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link DedicatedWorkerServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class DedicatedWorkerClientDriver
		extends DedicatedWorkerCommunicator
		implements IClientDriver
	{
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			onmessage = this.handle_message.bind(this);
			this.connected_ = true;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;
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
		public sendData(invoke: Invoke): void
		{
			postMessage(invoke.toXML().toString(), "");

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					postMessage(invoke.at(i).getValue() as Uint8Array, "");
		}
	}
}

namespace samchon.protocol
{
	/**
	 * Communicator with remote web-browser.
	 * 
	 * {@link SharedWorkerClientDriver} is a class taking full charge of network communication with web browsers. This 
	 * {@link SharedWorkerClientDriver} object is always created by {@link SharedWorkerServer} class. When you got this 
	 * {@link SharedWorkerClientDriver} object from {@link SharedWorkerServer.addClient SharedWorkerServer.addClient()}, 
	 * then specify {@link IProtocol listener} with the 
	 * {@link SharedWorkerClientDriver.listen SharedWorkerClientDriver.listen()} method.
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
	 * #### [Inherited] {@link IClientDriver}
	 * {@link IClientDriver} is a type of {@link ICommunicator}, specified for communication with remote client who has
	 * connected in a {@link IServer server}. It takes full charge of network communication with the remote client.
	 *
	 * The {@link IClientDriver} object is created and delivered from {@link IServer} and
	 * {@link IServer.addClient IServer.addClient()}. Those are derived types from this {@link IClientDriver}, being
	 * created by the matched {@link IServer} object.
	 *
	 * Protocol                | Derived Type                        | Created By
	 * ------------------------|-------------------------------------|----------------------------
	 * Samchon Framework's own | {@link ClientDriver}                | {@link Server}
	 * Web-socket protocol     | {@link WebClientDriver}             | {@link WebServer}
	 * DedicatedWorker         | {@link DedicatedWorkerClinetDriver} | {@link DedicatedWorkerServer}
	 * SharedWorker            | {@link SharedWorkerClientDriver}    | {@link SharedWorkerServer}
	 *
	 * When you've got an {@link IClientDriver} object from the {@link IServer.addClient IServer.addClient()}, then
	 * specify {@link IProtocol listener} with {@link IClient.listen IClient.listen()}. Whenever a replied message comes
	 * from the remote system, the message will be converted to an {@link Invoke} class and the {@link Invoke} object
	 * will be shifted to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} method.
	 * Below code is an example specifying and managing the {@link IProtocol listener} objects.
	 *
	 * - https://github.com/samchon/framework/blob/master/ts/examples/calculator/calculator-server.ts
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link SharedWorkerServer}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#iclientdriver)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class SharedWorkerClientDriver 
		extends SharedWorkerCommunicator
		implements IClientDriver
	{
		private listening_: boolean;

		/** 
		 * Construct from a MessagePort object.
		 */
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