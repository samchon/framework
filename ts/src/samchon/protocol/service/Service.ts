/// <reference path="../../API.ts" />

namespace samchon.protocol.service
{
	/**
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Service 
		implements protocol.IProtocol
	{
		/**
		 * @hidden
		 */
		private client_: Client;
		
		/**
		 * @hidden
		 */
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

		/**
		 * Default Destructor.
		 */
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
		public sendData(invoke: Invoke): void
		{
			return this.client_.sendData(invoke);
		}

		public abstract replyData(invoke: Invoke): void;
	}
}