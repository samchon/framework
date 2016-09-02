/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	export abstract class DedicatedWorker implements IProtocol
	{
		private communicator_: DedicatedWorkerCommunicator;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			this.communicator_ = new DedicatedWorkerCommunicator(this);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public abstract replyData(invoke: protocol.Invoke): void;

		public sendData(invoke: Invoke): void
		{
			postMessage(invoke.toXML().toString(), "");
			
			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					postMessage(invoke.at(i).getValue() as Uint8Array, "");
		}
	}

	/**
	 * @hidden
	 */
	class DedicatedWorkerCommunicator extends CommunicatorBase
	{
		/**
		 * @hidden
		 */
		protected connected_: boolean;

		public constructor(listener: IProtocol)
		{
			super(listener);
			
			onmessage = this.handle_message.bind(this);
			this.connected_ = true;
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			// IMPOSSIBLE, DEDICATED WORKER ONLY CAN BE CLOSED BY ITS PARENT BROWSER
		}

		/**
		 * @inheritdoc
		 */
		public isConnected(): boolean
		{
			return this.connected_;
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

		private handle_message(event: MessageEvent): void
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
	export class DedicatedWorkerConnector extends CommunicatorBase implements IServerConnector
	{
		private worker: Worker;

		/**
		 * @inheritdoc
		 */
		public onConnect: Function;
		
		/**
		 * @inheritdoc
		 */
		public onClose: Function;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(listener: IProtocol)
		{
			super(listener);
			this.worker = null;

			this.onConnect = null;
			this.onClose = null;

			this.connected_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public connect(jsFile: string): void
		{
			this.worker = new Worker(jsFile);
			this.worker.onmessage = this.handle_message.bind(this);

			this.connected_ = true;
			if (this.onConnect != null)
				this.onConnect();
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			// NOT CONNECTED
			if (this.worker == null)
				return;

			// TERMINATE CONNECTED DEDICATE WORKER
			this.worker.terminate();

			// AND NOTIFY THE CLOSING
			this.connected_ = false;
			if (this.onClose != null)
				this.onClose();
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE I/O
		--------------------------------------------------------- */
		public sendData(invoke: Invoke): void
		{
			this.worker.postMessage(invoke.toXML().toString(), "");

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					this.worker.postMessage(invoke.at(i).getValue() as Uint8Array, "");
		}

		public replyData(invoke: Invoke): void
		{
			this.listener_.replyData(invoke);
		}

		private handle_message(event: MessageEvent): void
		{
			if (this.is_binary_invoke() == false)
				this.handle_string(event.data);
			else
				this.handle_binary(event.data);
		}
	}
}