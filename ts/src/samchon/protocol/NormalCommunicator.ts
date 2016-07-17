/// <reference path="../API.ts" />

/// <reference path="Server.ts" />

namespace samchon.protocol
{
	export class NormalCommunicator implements ICommunicator
	{
		protected listener: IProtocol;
		protected socket: socket.socket;

		public onClose: Function;

		private data: string;
		private content_size: number;

		public constructor()
		{
			this.listener = null;
			this.socket = null;

			this.onClose = null;

			this.data = "";
			this.content_size = -1;
		}

		public close(): void
		{
			// HOW TO CLOSE IT?
		}

		protected start_listen(): void
		{
			this.socket.setEncoding("utf8");
			this.socket.on("data", this.listen_piece.bind(this));
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

			if (this.data != "")
				this.listen_data();
		}

		private listen_data(): void
		{
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
			this.listener.replyData(invoke);
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
	declare var net: typeof NodeJS.net;

	export abstract class NormalServer extends Server
	{
		private server: socket.server;

		public open(port: number): void
		{
			this.server = net.createServer(this.handle_connect.bind(this));
			this.server.listen(port);
		}

		public close(): void
		{
			this.server.close();
		}

		private handle_connect(socket: socket.server): void
		{
			let clientDriver: NormalClientDriver = new NormalClientDriver(socket);;
			this.addClient(clientDriver);
		}
	}
}

namespace samchon.protocol
{
	export class NormalClientDriver 
		extends NormalCommunicator
		implements IClientDriver
	{
		public constructor(socket: socket.socket)
		{
			super();

			this.socket = socket;
		}

		public listen(listener: IProtocol): void
		{
			this.listener = listener;
			
			this.start_listen();
		}
	}
}

namespace samchon.protocol
{
	declare var net: typeof NodeJS.net;

	export class NormalServerConnector 
		extends NormalCommunicator
		implements IServerConnector
	{
		public onConnect: Function;

		public constructor(listener: IProtocol)
		{
			super();

			this.listener = listener;
		}

		public connect(ip: string, port: number): void
		{
			this.socket = net.connect({ host: ip, port: port }, this.handle_connect.bind(this));
		}

		private handle_connect(...arg: any[]): void
		{
			this.start_listen(); 

			if (this.onConnect != null)
				this.onConnect();
		}
	}
}