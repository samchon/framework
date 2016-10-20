/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * An interface taking full charge of network communication.
	 * 
	 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with 
	 * remote system, without reference to whether the remote system is a server or a client. Type of the 
	 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system 
	 * is a server (that I've to connect) or a client (a client connected to my server).
	 * 
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class 
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s 
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link IClientDriver}, {@link IServerConnector}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICommunicator extends IProtocol
	{
		/**
		 * Callback function for connection closed.
		 */
		onClose: Function;

		/**
		 * Close connection.
		 */
		close(): void;

		/**
		 * Test connection.
		 * 
		 * Test whether this {@link ICommunicator communicator} object is connected with the remote system. If the 
		 * connection is alive, then returns ```true```. Otherwise, the connection is not alive or this 
		 * {@link ICommunicator communicator has not connected with the remote system yet, then returns ```false```.
		 * 
		 * @return true if connected, otherwise false.
		 */
		isConnected(): boolean;

		/**
		 * Send message.
		 * 
		 * Send {@link Invoke} message to remote system.
		 *
		 * @param invoke An {@link Invoke} message to send.
		 */
		sendData(invoke: protocol.Invoke): void;

		/** 
		 * Handle replied message.
		 * 
		 * Handles replied {@link Invoke} message recived from remove system. The {@link Invoke} message will be shifted
		 * to the {@link IProtocol listener}'s {@link IProtocol.replyData IProtocol.replyData()} by this method.
		 *
		 * @param invoke An {@link Invoke} message received from remote system.
		 */
		replyData(invoke: protocol.Invoke): void;
	}
}

namespace samchon.protocol
{
	/**
	 * An abstract, basic class for communicators.
	 * 
	 * {@link CommunicatorBase} is an abstract class implemented from the {@link ICommunicator}. Mechanism of converting
	 * raw data to {@link Invoke} messag has realized in this abstract class. Type of this {@link CommunicatorBase} class 
	 * is specified to as below following which protocol is used.
	 * 
	 * - {@link Communicator}: Samchon Framework's own protocool.
	 * - {@link WebCommunicator}: Web-socket protocol
	 * - {@link SharedWorkerCommunicator}: SharedWorker's message protocol.
	 * 
	 * #### [Inherited] {@link ICommunicator}
	 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
	 * remote system, without reference to whether the remote system is a server or a client. Type of the
	 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
	 * is a server (that I've to connect) or a client (a client connected to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link IClientDriver}, {@link IServerConnector}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class CommunicatorBase 
		implements ICommunicator
	{
		// BASIC MEMBERS
		/**
		 * @hidden
		 */
		protected listener_: IProtocol;

		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		/**
		 * @hidden
		 */
		protected connected_: boolean;

		// BINARY INVOKE MEMBERS
		/**
		 * @hidden
		 */
		private binary_invoke_: Invoke;

		/**
		 * @hidden
		 */
		private binary_parameters_: std.Queue<InvokeParameter>;

		/**
		 * @hidden
		 */
		private unhandled_invokes: std.Deque<Invoke>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from *listener*.
		 * 
		 * @param listener An {@link IProtocol} object to listen {@link Invoke} messages.
		 */
		public constructor(listener: IProtocol);

		public constructor(listener: IProtocol = null)
		{
			// BASIC MEMBERS
			this.listener_ = listener;
			this.onClose = null;

			// BINARY INVOKE MEMBERS
			this.binary_invoke_ = null;
			this.binary_parameters_ = new std.Queue<InvokeParameter>();

			this.unhandled_invokes = new std.Deque<Invoke>();
		}

		/**
		 * @inheritdoc
		 */
		public abstract close(): void;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public isConnected(): boolean
		{
			return this.connected_;
		}

		/**
		 * @hidden
		 */
		protected is_binary_invoke(): boolean
		{
			return (this.binary_invoke_ != null);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE GENERATOR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public abstract sendData(invoke: Invoke): void;
		
		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			if (this.listener_ == null)
				this.unhandled_invokes.push_back(invoke);
			else
			{
				if ((this.listener_ as any)["_replyData"] instanceof Function)
					(this.listener_ as any)["_replyData"](invoke);
				else
					this.listener_.replyData(invoke);
			}
		}

		/**
		 * @hidden
		 */
		protected handle_string(str: string): void
		{
			// REPLIED DATA IS CLEARY BE AN INVOKE MESSAGE
			let invoke: Invoke = new Invoke();
			invoke.construct(new library.XML(str));

			for (let i: number = 0; i < invoke.size(); i++)
			{
				let parameter: InvokeParameter = invoke.at(i);
				if (parameter.getType() != "ByteArray")
					continue;

				if (this.binary_invoke_ == null)
					this.binary_invoke_ = invoke; // INIT BINARY_INVOKE
				this.binary_parameters_.push(parameter); // ENROLL TO PARAMETERS' QUEUE
			}

			// NO BINARY, THEN REPLY DIRECTLY
			if (this.binary_invoke_ == null)
				this.replyData(invoke);
		}

		/**
		 * @hidden
		 */
		protected handle_binary(binary: Uint8Array): void
		{
			// FETCH A PARAMETER
			let parameter: InvokeParameter = this.binary_parameters_.front();
			{
				parameter.setValue(binary);
			}
			this.binary_parameters_.pop();

			if (this.binary_parameters_.empty() == true)
			{
				// NO BINARY PARAMETER LEFT,
				let invoke = this.binary_invoke_;
				this.binary_invoke_ = null;

				// THEN REPLY
				this.replyData(invoke);
			}
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A communicator following Samchon Framework's own protocol.
	 * 
	 * {@link Communicator} is an abstract class following Samchon Framework's own protocol. This {@link Communicator}
	 * class is specified to {@link ServerConnector} and {@link ClientDriver} whether the remote system is a server (that 
	 * my system is connecting to) or a client (a client conneting to to my server).
	 * 
	 * Note that, if one of this or remote system is web-browser based, then you don't have to use this 
	 * {@link Communicator} class who follows Samchon Framework's own protocol. Web-browser supports only Web-socket
	 * protocol. Thus in that case, you have to use {@link WebCommunicator} instead.
	 * 
	 * #### [Inherited] {@link ICommunicator}
	 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
	 * remote system, without reference to whether the remote system is a server or a client. Type of the
	 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
	 * is a server (that I've to connect) or a client (a client connected to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link ClientDriver}, {@link ServerConnector}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Communicator
		extends CommunicatorBase
	{
		// SOCKET AND RECEIVED DATA
		/**
		 * @hidden
		 */
		protected socket_: socket.socket = null;

		/**
		 * @hidden
		 */
		private header_bytes_: Uint8Array = null;

		/**
		 * @hidden
		 */
		private data_: Uint8Array = null;
		
		/**
		 * @hidden
		 */
		private data_index_: number = -1;

		/**
		 * @hidden
		 */
		private listening_: boolean = false;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.socket_.end();
		}

		/**
		 * @hidden
		 */
		protected start_listen(): void
		{
			if (this.listening_ == true)
				return;
			this.listening_ = true;

			this.socket_.on("data", this.listen_piece.bind(this));

			this.socket_.on("error", this.handle_error.bind(this));
			this.socket_.on("end", this.handle_close.bind(this));
			this.socket_.on("close", this.handle_close.bind(this));
		}

		/**
		 * @hidden
		 */
		private handle_error(): void
		{
			// WHEN ERROR EXISTS, CLOSE EVENT ALSO BEING DISPATCHED
			// THUS, ANYTHING NEED TO DO
		}

		/**
		 * @hidden
		 */
		private handle_close(): void
		{
			this.connected_ = false;

			if (this.onClose != null)
				this.onClose();
		}

		/* =========================================================
			SEND & REPLY DATA
				- INVOKE MESSAGE CHAIN
				- LISTENERS
		============================================================
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			////////
			// SEND STRING
			////////
			let str_header: Buffer = new Buffer(8);
			let str: string = invoke.toXML().toString();

			// WRITE CONTENT SIZE TO HEADER BUFFER
			str_header.writeUInt32BE(0, 0);
			str_header.writeUInt32BE(str.length, 4);

			this.socket_.write(str_header); // SEND SIZE HEADER
			this.socket_.write(str, "binary"); // TEXT IS AFTER

			for (let i: number = 0; i < invoke.size(); i++)
			{
				let parameter: InvokeParameter = invoke.at(i);
				if (parameter.getType() != "ByteArray")
					continue;

				////////
				// SEND BINARY
				////////
				let binary_header: Buffer = new Buffer(8);
				let binary: Uint8Array = parameter.getValue() as Uint8Array;

				binary_header.writeUInt32BE(0, 0);
				binary_header.writeUInt32BE(binary.byteLength, 4);

				this.socket_.write(binary_header); // SEND SIZE HEADER
				this.socket_.write(binary); // BINARY IS AFTER
			}
		}

		/* ---------------------------------------------------------
			LISTENERS
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private listen_piece(piece: Buffer): void
		{
			// DETERMINE WHICH TO LISTEN
			if (this.data_ == null)
				this.listen_header(piece, 0);
			else
				this.listen_data(piece, 0);
		}

		/**
		 * @hidden
		 */
		private listen_header(piece: Buffer, piece_index: number): void
		{
			if (this.header_bytes_ != null)
			{
				// ATTACH RESERVED HEADER BYTE TO PIECE
				(this.header_bytes_ as Buffer).copy
				(
					piece, piece_index, // FRONT OF THE PIECE
					0, this.header_bytes_.byteLength // ALL BYTES FROM this.header_bytes
				);
				this.header_bytes_ = null; // TRUNCATE
			}

			if (piece_index > piece.byteLength - 8)
			{
				// IF LEFT BYTES ARE UNDER 8, THEN RESERVE THE LEFT BYTES
				this.header_bytes_ = new Buffer(8);

				piece.copy
				(
					this.header_bytes_ as Buffer, 0, // TO THE NEWLY CREATED HEADER
					piece_index, piece.byteLength - piece_index // LEFT BYTES
				);
				return;
			}

			// READ CONTENT SIZE AND INIT DATA
			let content_size: number = piece.readUInt32BE(piece_index + 4);
			{
				this.data_ = new Buffer(content_size);
				this.data_index_ = 0;
				piece_index += 8;
			}

			// IF LEFT BYTES ARE, THEN LISTEN DATA
			if (piece_index < piece.byteLength)
				this.listen_data(piece, piece_index);
		}

		/**
		 * @hidden
		 */
		private listen_data(piece: Buffer, piece_index: number): void
		{
			// BYTES TO INSERT
			let inserted_bytes: number = Math.min
				(
					this.data_.byteLength - this.data_index_, // LEFT BYTES TO FILL
					piece.byteLength - piece_index // LEFT BYTES IN THE PIECE
				);

			// INSERT PIECE TO THE DATA
			piece.copy
			(
				this.data_ as Buffer, this.data_index_, // COPY TO THE DATA,
				piece_index, piece_index + inserted_bytes // LEFT BYTES OF THE PIECE OR FILL
			);
			this.data_index_ += inserted_bytes; // INCREASE OFFSET
			piece_index += inserted_bytes; // INCREASE OFFSET

			if (this.data_index_ == this.data_.byteLength) 
			{
				/////
				// THE DATA IS FULLY FILLED
				/////
				if (this.is_binary_invoke() == false)
					this.handle_string(this.data_.toString());
				else
					this.handle_binary(this.data_);

				// TRUNCATE DATA
				this.data_ = null;
				this.data_index_ = -1;
			}

			// THE PIECE IS NOT EXHAUSTED, THEN CONTINUE READING
			if (piece_index < piece.byteLength)
				this.listen_header(piece, piece_index);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A communicator following Web-socket protocol.
	 * 
	 * {@link WebCommunicator} is an abstract class following Web-socket protocol. This {@link WebCommunicator} class is
	 * specified to {@link WebServerConnector} and {@link WebClientDriver} whether the remote system is a server (that my
	 * system is connecting to) or a client (a client conneting to to my server).
	 * 
	 * Note that, one of this or remote system is web-browser based, then there's not any alternative choice. Web browser
	 * supports only Web-socket protocol. In that case, you've use this {@link WebCommunicator} class.
	 * 
	 * #### [Inherited] {@link ICommunicator}
	 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
	 * remote system, without reference to whether the remote system is a server or a client. Type of the
	 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
	 * is a server (that I've to connect) or a client (a client connected to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @see {@link WebClientDriver}, {@link WebServerConnector}, {@link IProtocol}
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class WebCommunicator
		extends CommunicatorBase
	{
		// SOCKET MEMBER
		/**
		 * @hidden
		 */
		protected connection_: websocket.connection = null;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.connection_.close();
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE I/O
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			this.connection_.sendUTF(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					this.connection_.sendBytes(invoke.at(i).getValue());
		}

		/**
		 * @hidden
		 */
		protected handle_message(message: websocket.IMessage)
		{
			// EXCEPTION HANDLING IS REQUIRED
			//	- BINARY_INVOKE EXISTS, BUT TEXT MESSAGE HAS COME
			//	- BINARY_INVOKE IS NOT, BUT BINARY MESSAGE HAS COME

			if (message.type == "utf8")
				this.handle_string(message.utf8Data);
			else
				this.handle_binary(message.binaryData);
		}

		/**
		 * @hidden
		 */
		protected handle_close(): void
		{
			this.connected_ = false;

			if (this.onClose != null)
				this.onClose();
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A communicator for shared worker.
	 * 
	 * {@link DedicatedWorkerCommunicator} is an abstract class for communication between DedicatedWorker and Web-browser. 
	 * This {@link DedicatedWorkerCommunicator} is specified to {@link DedicatedWorkerServerConnector} and 
	 * {@link DedicatedWorkerClientDriver} whether the remote system is a server (that my system is connecting to) or a 
	 * client (a client conneting to to my server).
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
	 * #### [Inherited] {@link ICommunicator}
	 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
	 * remote system, without reference to whether the remote system is a server or a client. Type of the
	 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
	 * is a server (that I've to connect) or a client (a client connected to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link DedicatedWorkerClientDriver}, {@link DedicatedWorkerServerConnector}, {@link IProtocol}
	 * @reference https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorker
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class DedicatedWorkerCommunicator
		extends CommunicatorBase
	{
		/**
		 * @hidden
		 */
		protected handle_message(event: MessageEvent): void
		{
			if (this.is_binary_invoke() == false)
				this.handle_string(event.data);
			else
				this.handle_binary(event.data);
		}
	}
}

namespace samchon.protocol
{
	/**
	 * A communicator for shared worker.
	 * 
	 * {@link SharedWorkerCommunicator} is an abstract class for communication between SharedWorker and Web-browser. This
	 * {@link SharedWorkerCommunicator} is specified to {@link SharedWorkerServerConnector} and 
	 * {@link SharedWorkerClientDriver} whether the remote system is a server (that my system is connecting to) or a client 
	 * (a client conneting to to my server).
	 * 
	 * Note that, SharedWorker is a conception only existed in web-browser. This {@link SharedWorkerCommunicator} is not
	 * supported in NodeJS. Only web-browser environment can utilize this {@link SharedWorkerCommunicator}.
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
	 * #### [Inherited] {@link ICommunicator}
	 * {@link ICommunicator} is an interface for communicator classes who take full charge of network communication with
	 * remote system, without reference to whether the remote system is a server or a client. Type of the
	 * {@link ICommunicator} is specified to {@link IServerConnector} and {@link IClientDriver} whether the remote system
	 * is a server (that I've to connect) or a client (a client connected to my server).
	 *
	 * Whenever a replied message comes from the remote system, the message will be converted to an {@link Invoke} class
	 * and the {@link Invoke} object will be shifted to the {@link IProtocol listener}'s
	 * {@link IProtocol.replyData IProtocol.replyData()} method.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @see {@link SharedWorkerClientDriver}, {@link SharedWorkerServerConnector}, {@link IProtocol}
	 * @reference https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
	 * @handbook [Protocol - Basic Components](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class SharedWorkerCommunicator
		extends CommunicatorBase
	{
		/**
		 * @hidden
		 */
		protected port_: MessagePort;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.connected_ = false;

			this.port_.close();
			if (this.onClose != null)
				this.onClose();
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE I/O
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			this.port_.postMessage(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteaArray")
					this.port_.postMessage(invoke.at(i).getValue());
		}

		/**
		 * @hidden
		 */
		protected handle_message(event: MessageEvent): void
		{
			if (this.is_binary_invoke() == false)
				this.handle_string(event.data);
			else
				this.handle_binary(event.data);
		}
	}
}