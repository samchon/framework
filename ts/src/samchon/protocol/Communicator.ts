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
		close();

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
		protected listener: IProtocol;

		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		// BINARY INVOKE MEMBERS
		/**
		 * @hidden
		 */
		private binary_invoke: Invoke;

		/**
		 * @hidden
		 */
		private binary_parameters: std.Queue<InvokeParameter>;

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

		public constructor(listener: IProtocol);

		public constructor(listener: IProtocol = null)
		{
			// BASIC MEMBERS
			this.listener = listener;
			this.onClose = null;

			// BINARY INVOKE MEMBERS
			this.binary_invoke = null;
			this.binary_parameters = new std.Queue<InvokeParameter>();

			this.unhandled_invokes = new std.Deque<Invoke>();
		}

		/**
		 * @inheritdoc
		 */
		public abstract close(): void;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		protected is_binary_invoke(): boolean
		{
			return (this.binary_invoke != null);
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
			if (this.listener == null)
				this.unhandled_invokes.push_back(invoke);
			else
				this.listener.replyData(invoke);
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

				if (this.binary_invoke == null)
					this.binary_invoke = invoke; // INIT BINARY_INVOKE
				this.binary_parameters.push(parameter); // ENROLL TO PARAMETERS' QUEUE
			}

			// NO BINARY, THEN REPLY DIRECTLY
			if (this.binary_invoke == null)
				this.replyData(invoke);
		}

		protected handle_binary(binary: Uint8Array): void
		{
			// FETCH A PARAMETER
			let parameter: InvokeParameter = this.binary_parameters.front();
			{
				parameter.setValue(binary);
			}
			this.binary_parameters.pop();

			if (this.binary_parameters.empty() == true)
			{
				// NO BINARY PARAMETER LEFT,
				let invoke = this.binary_invoke;
				this.binary_invoke = null;

				// THEN REPLY
				this.replyData(invoke);
			}
		}
	}
}

namespace samchon.protocol
{
	export class Communicator
		extends CommunicatorBase
	{
		// SOCKET AND RECEIVED DATA
		/**
		 * @hidden
		 */
		protected socket: socket.socket = null;

		/**
		 * @hidden
		 */
		private header_bytes: Uint8Array = null;

		/**
		 * @hidden
		 */
		private data: Uint8Array = null;
		
		/**
		 * @hidden
		 */
		private data_index: number = -1;

		/**
		 * @hidden
		 */
		private listening: boolean = false;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.socket.end();
		}

		/**
		 * @hidden
		 */
		protected start_listen(): void
		{
			if (this.listening == true)
				return;
			this.listening = true;

			this.socket.on("data", this.listen_piece.bind(this));

			this.socket.on("error", this.handle_error.bind(this));
			this.socket.on("end", this.handle_close.bind(this));
			this.socket.on("close", this.handle_close.bind(this));
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

			this.socket.write(str_header); // SEND SIZE HEADER
			this.socket.write(str, "binary"); // TEXT IS AFTER

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

				this.socket.write(binary_header); // SEND SIZE HEADER
				this.socket.write(binary); // BINARY IS AFTER
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
			if (this.data == null)
				this.listen_header(piece, 0);
			else
				this.listen_data(piece, 0);
		}

		/**
		 * @hidden
		 */
		private listen_header(piece: Buffer, piece_index: number): void
		{
			if (this.header_bytes != null)
			{
				// ATTACH RESERVED HEADER BYTE TO PIECE
				(this.header_bytes as Buffer).copy
				(
					piece, piece_index, // FRONT OF THE PIECE
					0, this.header_bytes.byteLength // ALL BYTES FROM this.header_bytes
				);
				this.header_bytes = null; // TRUNCATE
			}

			if (piece_index > piece.byteLength - 8)
			{
				// IF LEFT BYTES ARE UNDER 8, THEN RESERVE THE LEFT BYTES
				this.header_bytes = new Buffer(8);

				piece.copy
				(
					this.header_bytes as Buffer, 0, // TO THE NEWLY CREATED HEADER
					piece_index, piece.byteLength - piece_index // LEFT BYTES
				);
				return;
			}

			// READ CONTENT SIZE AND INIT DATA
			let content_size: number = piece.readUInt32BE(piece_index + 4);
			{
				this.data = new Buffer(content_size);
				this.data_index = 0;
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
					this.data.byteLength - this.data_index, // LEFT BYTES TO FILL
					piece.byteLength - piece_index // LEFT BYTES IN THE PIECE
				);

			// INSERT PIECE TO THE DATA
			piece.copy
			(
				this.data as Buffer, this.data_index, // COPY TO THE DATA,
				piece_index, piece_index + inserted_bytes // LEFT BYTES OF THE PIECE OR FILL
			);
			this.data_index += inserted_bytes; // INCREASE OFFSET
			piece_index += inserted_bytes; // INCREASE OFFSET

			if (this.data_index == this.data.byteLength) 
			{
				/////
				// THE DATA IS FULLY FILLED
				/////
				if (this.is_binary_invoke() == false)
					this.handle_string(this.data.toString());
				else
					this.handle_binary(this.data);

				// TRUNCATE DATA
				this.data = null;
				this.data_index = -1;
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
	export class WebCommunicator
		extends CommunicatorBase
	{
		// SOCKET MEMBER
		/**
		 * Connection driver, a socket for web-socket.
		 */
		protected connection: websocket.connection = null;

		// using super::constructor

		/**
		 * Close the connection.
		 */
		public close(): void
		{
			this.connection.close();
		}

		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			this.connection.sendUTF(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					this.connection.sendBytes(invoke.at(i).getValue());
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
			if (this.onClose != null)
				this.onClose();
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerCommunicator
		extends CommunicatorBase
	{
		protected port: MessagePort;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::constructor

		public close(): void
		{
			this.port.close();

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
			this.port.postMessage(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteaArray")
					this.port.postMessage(invoke.at(i).getValue());
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