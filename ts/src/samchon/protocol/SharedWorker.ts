/// <reference path="../API.ts" />

/// <reference path="Communicator.ts" />
/// <reference path="Server.ts" />

namespace samchon.protocol
{
	export abstract class SharedWorkerServer extends Server
	{
		public open(): void
		{

		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerClientDriver 
		extends ClientDriver
	{
		public listen(listener: IProtocol): void
		{
		}

		public sendData(invoke: Invoke): void
		{
		}
	}
}

namespace samchon.protocol
{
	export class SharedWorkerConnector
		extends Communicator
	{
		private driver: any; //SharedWorker;

		public onopen = Function;

		public constructor(listener: IProtocol)
		{
			super();

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

		private reply_message(event: MessageEvent): void
		{
			
		}
	}
}