/// <reference path="../API.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface taking full charge of network communication. </p>
	 * 
	 * <p> {@link ICommunicator} is an interface for communicator classes who take full charge of network communication
	 * with external system, without reference to whether the external system is a server or a client. </p>
	 * 
	 * <p> Whenever a replied message comes from the external system, the message will be converted to an
	 * {@link Invoke} class and will be shifted to the {@link WebCommunicator.listener listener}'s 
	 * {@link IProtocol.replyData replyData()} method. </p>
	 * 
	 * <code>
	interface ICommmunicator
	{
		private socket: SomeSocketClass;

		// LISTENER LISTENS INVOKE MESSAGE BY IT'S IProtocol.replyData() METHOD
		protected listener: IProtocol;

		// YOU CAN DETECT DISCONNECTION BY ENROLLING FUNCTION POINTER TO HERE.
		public onClose: Function;

		public sendData(invoke: Invoke): void
		{
			this.socket.write(invoke);
		}
		public replyData(invoke: Invoke): void
		{
			// WHENEVER COMMUNICATOR GETS MESSAGE, THEN SHIFT IT TO LISTENER'S replyData() METHOD.
			this.listener.replyData(invoke);
		}
	}
	 * </code>
	 * 
	 * <p> <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_basic_components.png"
	 *		 style="max-width: 100%" />
	 * </a> </p>
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
	 * @see {@link IClientDriver}, {@link IServerConnector}
	 * @handbook <a href="https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components#icommunicator"
	 *			 target="_blank"> Basic Components - ICommunicator </a>
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

		isConnected(): boolean;

		sendData(invoke: protocol.Invoke): void;

		replyData(invoke: protocol.Invoke): void;
	}
}

namespace samchon.protocol
{
	export abstract class CommunicatorBase implements ICommunicator
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
		 * Construct from <i>listener</i>.
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

		protected is_binary_invoke(): boolean
		{
			return (this.binary_invoke_ != null);
		}

		///**
		// * An IProtocol object who gets Invoke messages to its replyData().
		// */
		//protected get listener(): IProtocol
		//{
		//	return this.listener_;
		//}

		///**
		// * An IProtocol object who gets Invoke messages to its replyData().
		// */
		//protected set listener(val: IProtocol)
		//{
		//	this.listener_ = val;

		//	if (this.unhandled_invokes.empty() == false)
		//	{
		//		for (let it = this.unhandled_invokes.begin(); !it.equal_to(this.unhandled_invokes.end()); it = it.next())
		//			this.listener_.replyData(it.value);

		//		this.unhandled_invokes.clear();
		//	}
		//}

		/* ---------------------------------------------------------
			INVOKE MESSAGE GENERATOR
		--------------------------------------------------------- */
		public abstract sendData(invoke: Invoke): void;
		
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
	export abstract class WebCommunicator
		extends CommunicatorBase
	{
		// SOCKET MEMBER
		/**
		 * Connection driver, a socket for web-socket.
		 */
		protected connection_: websocket.connection = null;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/**
		 * Close the connection.
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
		 * <p> Handle raw-data received from the remote system. </p>
		 * 
		 * <p> Queries raw-data received from the remote system. When the raw-data represents an formal {@link Invoke} 
		 * message, then it will be sent to the {@link replyData}. </p> 
		 * 
		 * @param message A raw-data received from the remote system.
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
	export abstract class SharedWorkerCommunicator
		extends CommunicatorBase
	{
		protected port_: MessagePort;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

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

		protected handle_message(event: MessageEvent): void
		{
			if (this.is_binary_invoke() == false)
				this.handle_string(event.data);
			else
				this.handle_binary(event.data);
		}
	}
}