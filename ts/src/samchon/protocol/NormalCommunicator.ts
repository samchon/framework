/// <reference path="../API.ts" />

/// <reference path="Server.ts" />
/// <reference path="ClientDriver.ts" />
/// <reference path="ServerConnector.ts" />

namespace samchon.protocol
{
	export class NormalCommunicatorBase implements IProtocol
	{
		private communicator: IProtocol;
		private socket: NodeJS.net.Socket;

		private data: string;
		private content_size: number;

		public constructor(clientDriver: NormalClientDriver, socket: NodeJS.net.Socket);
		public constructor(serverConnector: NormalServerConnector, socket: NodeJS.net.Socket);

		public constructor(communicator: IProtocol, socket: NodeJS.net.Socket)
		{
			this.communicator = communicator;
			this.socket = socket;

			this.data = "";
			this.content_size = -1;
		}

		public listen(): void
		{
			this.socket.setEncoding("utf8");
			this.socket.on("data", this.listen.bind(this));
		}

		private listen_piece(piece: string): void
		{
			this.data += piece;

			if (this.content_size == -1)
				this.listen_header();
			else
				this.listen_data();
		}

		private listen_header(): void
		{
			if (this.data.length < 8)
				return;

			let buffer: Buffer = new Buffer(this.data);
			this.data = this.data.substr(8);

			this.content_size = buffer.readUInt32BE(0, true) * Math.pow(2, 32);
			this.content_size += buffer.readUInt32BE(4, true);

			console.log("content size: #" + this.content_size);

			if (this.data != "")
				this.listen_data();
		}

		private listen_data(): void
		{
			console.log(this.data.length, this.content_size);
			if (this.data.length < this.content_size)
				return;

			let invoke: Invoke = new Invoke(new library.XML(this.data.substr(0, this.content_size)));
			this.data = this.data.substr(this.content_size);
			this.content_size = -1;

			this.replyData(invoke);

			if (this.data != "")
				this.listen_header();
		}

		public replyData(invoke: Invoke): void
		{
			this.communicator.replyData(invoke);
		}

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
	export abstract class NormalServer extends Server
	{
		private server: NodeJS.net.Server;

		public open(port: number): void
		{
			this.server = net.createServer(this.handle_connect.bind(this));
			this.server.listen(port);
		}

		private handle_connect(socket: NodeJS.net.Socket): void
		{
			let clientDriver: ClientDriver;

			this.addClient(clientDriver);
		}
	}
}

namespace samchon.protocol
{
	export class NormalClientDriver extends ClientDriver
	{
		private base: NormalCommunicatorBase;

		public constructor(socket: NodeJS.net.Socket)
		{
			super();

			this.base = new NormalCommunicatorBase(this, socket);
		}

		public listen(listener: IProtocol): void
		{
			this.listener = listener;
			this.base.listen();
		}

		public sendData(invoke: Invoke): void
		{
			this.base.sendData(invoke);
		}
	}
}

namespace samchon.protocol
{
	export class NormalServerConnector extends ServerConnector
	{
		private socket: NodeJS.net.Socket;
		private base: NormalCommunicatorBase;

		public constructor(listener: IProtocol)
		{
			super(listener);

			this.socket = null;
		}

		public connect(ip: string, port: number): void
		{
			this.socket = net.connect({ host: ip, port: port }, this.handle_connect.bind(this));
		}
		private handle_connect(...arg: any[]): void
		{
			this.base = new NormalCommunicatorBase(this, this.socket);
			this.base.listen();

			if (this.onopen != null)
				this.onopen();
		}

		public sendData(invoke: Invoke): void
		{
			this.base.sendData(invoke);
		}
	}
}