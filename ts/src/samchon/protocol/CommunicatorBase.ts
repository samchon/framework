/// <reference path="../API.ts" />

namespace samchon.protocol
{
	export class CommunicatorBase
	{
		protected communicator: IProtocol;

		private data: string;
		private content_size: number;

		public constructor(communicator: IProtocol)
		{
			this.communicator = communicator;
			
			this.data = "";
			this.content_size = -1;
		}
		
		public listen_piece(piece: string): void
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

			// LEFT BYTES NOT READ YET
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

			// SHIFT INVOKE MESSAGE TO COMMUNICATOR
			this.communicator.replyData(invoke);

			// LEFT BYTES NOT READ YET
			if (this.data != "")
				this.listen_header();
		}
	}
}