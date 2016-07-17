/// <reference path="../API.ts" />

/// <reference path="Server.ts" />

namespace samchon.protocol
{
	export abstract class SharedWorkerServer extends Server
	{
		public open(): void
		{

		}

		public close(): void
		{
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerClientDriver 
		implements IClientDriver
	{
		private listener: IProtocol;

		public onClose: Function;

		public listen(listener: IProtocol): void
		{
			this.listener = listener;
		}

		public close(): void
		{
		}

		public sendData(invoke: Invoke): void
		{
		}
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerConnector
		implements IServerConnector
	{
		private listener: IProtocol;
		private driver: any; //SharedWorker;

		public onConnect: Function;
		public onClose: Function;

		public constructor(listener: IProtocol)
		{
			this.listener = listener;
			this.driver = null;
		}

		public connect(jsFile: string): void;
		public connect(jsFile: string, name: string): void;

		public connect(jsFile: string, name: string = ""): void
		{
			this.driver = new SharedWorker(jsFile, name);
			this.driver.port.addEventListener("message", this.reply_message.bind(this));

			this.driver.port.start();
		}

		public close(): void
		{
			this.driver.port.close();
		}

		public sendData(invoke: Invoke): void
		{
			this.driver.port.postMessage(invoke.toXML().toString());

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteaArray")
					this.driver.port.postMessage(invoke.at(i).getValue());
		}
		public replyData(invoke: Invoke): void
		{
			this.listener.replyData(invoke);
		}

		private reply_message(event: MessageEvent): void
		{
			
		}
	}
}