/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export abstract class DedicatedWorker
		implements IProtocol
	{
		private communicator_base: CommunicatorBase;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			this.communicator_base = new CommunicatorBase(this);
			onmessage = this.handle_message.bind(this);
		}

		public sendData(invoke: Invoke): void
		{
			let buffer: Buffer = new Buffer(8);
			let str: string = invoke.toXML().toString();

			// WRITE CONTENT SIZE TO HEADER BUFFER
			buffer.writeUInt32BE(0x00000000, 0, true);
			buffer.writeUInt32BE(str.length, 4, true);

			postMessage(buffer, ""); // SEND SIZE HEADER
			postMessage(str, ""); // SEND DATA
		}

		private handle_message(event: MessageEvent): void
		{
			this.communicator_base.listen_piece(event.data);
		}

		public abstract replyData(invoke: Invoke): void;
	}
}

namespace samchon.protocol
{
	export class DedicatedWorkerConnector
		implements IServerConnector
	{
		private listener: IProtocol;

		private worker: Worker;
		private communicator_base: CommunicatorBase;

		/**
		 * @inheritdoc
		 */
		public onConnect: Function;
		
		/**
		 * @inheritdoc
		 */
		public onClose: Function;
		
		public constructor(listener: IProtocol)
		{
			this.listener = listener;
			this.communicator_base = new CommunicatorBase(this);

			this.worker = null;
			this.onConnect = null;
			this.onClose = null;
		}

		/**
		 * <p> Connect to dedicated worker. </p>
		 * 
		 * <p> Creates a dedictaed worker with specified <i>jsFile (JavaScript file name)</i> and connect to it. After 
		 * the creation and connection, callback function {@link onConnect} is called. Listening data from the connected 
		 * dedicated worker also begins. Replied messages from the dedicated worker will be converted to {@link Invoke} 
		 * classes and will be shifted to the {@link listener listener}'s {@link IProtocol.replyData replyData()} method. 
		 * </p>
		 * 
		 * <p> If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
		 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
		 * the status of the connection is reported by an event. If the socket is already connected, the existing 
		 * connection is closed first. </p>
		 * 
		 * @param jsFile File name of JavaScript. The JavaScript file must have {@link DedicatedWorker} and constructs
		 *				 the class immediately on execution.
		 */
		public connect(jsFile: string): void
		{
			this.worker = new Worker(jsFile);
			this.worker.addEventListener("message", this.handle_message.bind(this));
			
			if (this.onConnect != null)
				this.onConnect();
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.worker == null)
				return;

			this.worker.terminate();
			if (this.onClose != null)
				this.onClose();
		}

		private handle_message(event: MessageEvent): void
		{
			this.communicator_base.listen_piece(event.data);
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

			this.worker.postMessage(buffer); // SEND SIZE HEADER
			this.worker.postMessage(str); // SEND DATA
		}
	}
}