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
		 * Construct from an User and WebClientDriver.
		 */
		public constructor(user: User, driver: WebClientDriver)
		{
			this.user = user;

			this.driver = driver;
			this.driver.listen(this);

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
			invoke.apply(this);
			this.user.replyData(invoke);

			if (this.service != null)
				this.service.replyData(invoke);
		}

		protected changeService(path: string): void
		{
			if (this.service != null)
				this.service.destructor();

			this.service = this.createService(path);
			if (this.service != null)
			{
				this.service["client"] = this;
				this.service["path"] = path;
			}
		}
	}
}