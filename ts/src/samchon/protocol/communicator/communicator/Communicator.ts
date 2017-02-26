/// <reference path="../../../API.ts" />

/// <reference path="_CommunicatorBase.ts" />

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
	 * @copydoc ICommunicator
	 */
	export abstract class Communicator
		extends _CommunicatorBase
	{
		// SOCKET AND RECEIVED DATA
		/**
		 * @hidden
		 */
		private socket_: net.Socket = null;

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
		// using super.constructor

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
		protected _Start_listen(): void
		{
			if (this.listening_ == true)
				return;
			this.listening_ = true;

			this.socket_.on("data", this._Listen_piece.bind(this));

			this.socket_.on("error", this._Handle_error.bind(this));
			this.socket_.on("end", this._Handle_close.bind(this));
			this.socket_.on("close", this._Handle_close.bind(this));
		}

		/**
		 * @hidden
		 */
		private _Handle_error(): void
		{
			// WHEN ERROR EXISTS, CLOSE EVENT ALSO BEING DISPATCHED
			// THUS, ANYTHING NEED TO DO
		}

		/**
		 * @hidden
		 */
		private _Handle_close(): void
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
			str_header.writeUInt32BE(Buffer.byteLength(str, "utf8"), 4);

			this.socket_.write(str_header); // SEND SIZE HEADER
			this.socket_.write(str, "utf8"); // TEXT IS AFTER

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
		private _Listen_piece(piece: Buffer): void
		{
			// DETERMINE WHICH TO LISTEN
			if (this.data_ == null)
				this._Listen_header(piece, 0);
			else
				this._Listen_data(piece, 0);
		}

		/**
		 * @hidden
		 */
		private _Listen_header(piece: Buffer, piece_index: number): void
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
			piece_index += 8;

			if (content_size != 0)
			{
				this.data_ = new Buffer(content_size);
				this.data_index_ = 0;
			}

			// IF LEFT BYTES ARE, THEN LISTEN DATA
			if (piece_index < piece.byteLength)
				if (content_size != 0)
					this._Listen_data(piece, piece_index);
				else
					this._Listen_header(piece, piece_index);
		}

		/**
		 * @hidden
		 */
		private _Listen_data(piece: Buffer, piece_index: number): void
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
				if (this._Is_binary_invoke() == false)
					this._Handle_string(this.data_.toString());
				else
					this._Handle_binary(this.data_);

				// TRUNCATE DATA
				this.data_ = null;
				this.data_index_ = -1;
			}

			// THE PIECE IS NOT EXHAUSTED, THEN CONTINUE READING
			if (piece_index < piece.byteLength)
				this._Listen_header(piece, piece_index);
		}
	}
}