/// <reference path="../../API.ts" />

namespace samchon.protocol.service
{
	export abstract class Service 
		implements protocol.IProtocol
	{
		private client_: Client;
		private path_: string;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor(client: Client, path: string)
		{
			this.client_ = client;
			this.path_ = path;
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
			return this.client_;
		}

		/**
		 * Get path.
		 */
		public getPath(): string
		{
			return this.path_;
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			return this.client_.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}
	}
}