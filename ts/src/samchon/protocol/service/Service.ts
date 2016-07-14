/// <reference path="../../API.ts" />

namespace samchon.protocol.service
{
	export abstract class Service 
		implements protocol.IProtocol
	{
		private client: Client;
		private path: string;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor(client: Client, path: string)
		{
			this.client = client;
			this.path = path;
		}

		public destructor(): void
		{
		}
		
		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		/**
		 * Get client.
		 */
		public getClient(): Client
		{
			return this.client;
		}

		/**
		 * Get path.
		 */
		public getPath(): string
		{
			return this.path;
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			return this.client.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}
	}
}