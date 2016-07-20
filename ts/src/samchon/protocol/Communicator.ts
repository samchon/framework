/// <reference path="../API.ts" />

/// <reference path="NormalCommunicatorBase.ts" />

namespace samchon.protocol
{
	/**
	 * <p> An interface taking full charge of network communication. </p>
	 * 
	 * <p> {@link ICommunicator} is an interface for communicator classes who take full charge of network communication
	 * with external system, without reference to whether the external system is a server or a client. </p>
	 * 
	 * <p> Whenever a replied message comes from the external system has arrived, the message will be converted to an
	 * {@link Invoke} class and will be shifted to the {@link WebCommunicator.listener listener}'s 
	 * {@link IProtoco.replyData replyData()} method. </p>
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
	export class NormalCommunicator
		implements ICommunicator
	{
		private communicator_base: NormalCommunicatorBase;

		protected listener: IProtocol;

		protected socket: socket.socket;

		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		public constructor()
		{
			this.communicator_base = new NormalCommunicatorBase(this);

			this.listener = null;
			this.socket = null;

			this.onClose = null;
		}

		public close(): void
		{
			// HOW TO CLOSE IT?
		}

		protected start_listen(): void
		{
			this.socket.setEncoding("utf8");
			this.socket.on("data", this.communicator_base.listen_piece.bind(this));
		}
		
		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}

		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			let buffer: Buffer = new Buffer(8);
			let str: string = invoke.toXML().toString();

			// WRITE CONTENT SIZE TO HEADER BUFFER
			buffer.writeUInt32BE(0x00000000, 0, true);
			buffer.writeUInt32BE(str.length, 4, true);
			
			this.socket.write(buffer); // SEND SIZE HEADER
			this.socket.write(str); // SEND DATA
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
	export class WebCommunicator implements ICommunicator
	{
		/**
		 * Communicator of web-socket.
		 */
		protected listener: IProtocol;
		
		/**
		 * Connection driver, a socket for web-socket.
		 */
		protected connection: websocket.connection;

		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		/**
		 * Initialization Constructor.
		 * 
		 * @param communicator Communicator of web-socket.
		 * @param connection Connection driver, a socket for web-socket.
		 */
		public constructor()
		{
			this.listener = null;
			this.connection = null;

			this.onClose = null;
		}

		/**
		 * Listen message from remoate system.
		 */
		//public listen(): void
		//{
		//	this.connection.on("message", this.handle_message.bind(this));
		//}

		/**
		 * Close the connection.
		 */
		public close(): void
		{
			this.connection.close();
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
			if (message.type == "utf8")
				this.replyData(new Invoke(new library.XML(message.utf8Data)));
			else
				message.binaryData
		}

		protected handle_close(): void
		{
			if (this.onClose != null)
				this.onClose();
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
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
	}
}