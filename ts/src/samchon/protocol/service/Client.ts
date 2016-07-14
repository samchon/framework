/// <reference path="../../APi.ts" />

namespace samchon.protocol.service
{
	export abstract class Client implements protocol.IProtocol
	{
		private user: User;
		private service: Service;
		private driver: WebClientDriver;

		private no: number;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor(user: User)
		{
			this.user = user;
			this.service = null;
		}

		protected abstract createService(path: string): Service;

		public close(): void
		{
			this.user.erase(this.no);
		}

		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		public getUser(): User
		{
			return this.user;
		}
		public getService(): Service
		{
			return this.service;
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			this.driver.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			this.service.replyData(invoke);
			this.user.replyData(invoke);
		}
	}
}