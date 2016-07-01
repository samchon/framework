/// <reference path="../API.ts" />

/// <reference path="Entity.ts" />

namespace samchon.protocol
{
	export abstract class ExternalSystem
		extends EntityArrayCollection<ExternalSystemRole>
		implements IProtocol
	{
		private systemArray: ExternalSystemArray;
		private communicator: Communicator;

		protected name: string;
		protected ip: string;
		protected port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ExternalSystemArray)
		{
			super();

			this.systemArray = systemArray;
			this.communicator = null;
		}

		protected abstract createServerConnector(): ServerConnector;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key(): string
		{
			return this.name;
		}

		public getSystemArray(): ExternalSystemArray
		{
			return this.systemArray;
		}
		public getName(): string
		{
			return this.name;
		}
		public getIP(): string
		{
			return this.ip;
		}
		public getPort(): number
		{
			return this.port;
		}

		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		public connect(): void
		{
			if (this.communicator == null || this.ip == undefined)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as ServerConnector).connect(this.ip, this.port);
		}

		public sendData(invoke: Invoke): void
		{
			this.communicator.sendData(invoke);
		}
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);

			this.systemArray.replyData(invoke);
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).replyData(invoke);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "system";
		}
		public CHILD_TAG(): string
		{
			return "role";
		}
	}
}