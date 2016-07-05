/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />

namespace samchon.protocol
{
	export abstract class DedicatedWorker implements IProtocol
	{
		private communicator: DedicatedWorkerClientDriver;

		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			this.communicator = new DedicatedWorkerClientDriver(this);
		}

		public sendData(invoke: Invoke): void
		{
			this.communicator.sendData(invoke);
		}

		public abstract replyData(invoke: Invoke): void;
	}

	class DedicatedWorkerClientDriver extends Communicator
	{
		public constructor(listener: DedicatedWorker)
		{
			super();
			this.listener = listener;

			self.addEventListener("message", this.listen_message.bind(this));
		}

		public sendData(invoke: Invoke): void
		{
			(postMessage as Function)(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					(postMessage as Function)(invoke.at(i).getValue());
		}

		private listen_message(event: MessageEvent): void
		{
			
		}
	}
}

namespace samchon.protocol
{
	export class DedicatedWorkerConnector 
		extends Communicator
	{
		private worker: Worker;

		public constructor(listener: IProtocol)
		{
			super();

			this.listener = listener;
			this.worker = null;
		}

		public connect(jsFile: string): void
		{
			this.worker = new Worker(jsFile);
			this.worker.addEventListener("message", this.reply_message.bind(this));
		}

		public close(): void
		{
			this.worker.terminate();
		}

		public sendData(invoke: Invoke): void
		{
			this.worker.postMessage(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteaArray")
					this.worker.postMessage(invoke.at(i).getValue());
		}
		
		private reply_message(event: MessageEvent): void
		{
			
		}
	}
}