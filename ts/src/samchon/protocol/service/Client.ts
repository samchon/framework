/// <reference path="../../APi.ts" />

namespace samchon.protocol.service
{
	export abstract class Client implements protocol.IProtocol
	{
		private user_: User;
		private service_: Service;
		private communicator_: WebClientDriver;

		private no_: number;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Construct from an User and WebClientDriver.
		 */
		public constructor(user: User, driver: WebClientDriver)
		{
			this.user_ = user;

			this.communicator_ = driver;
			this.communicator_.listen(this);

			this.service_ = null;
		}

		protected abstract createService(path: string): Service;

		public close(): void
		{
			this.user_.erase(this.no_);
		}

		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		public getUser(): User
		{
			return this.user_;
		}
		public getService(): Service
		{
			return this.service_;
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator_.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
			this.user_.replyData(invoke);

			if (this.service_ != null)
				this.service_.replyData(invoke);
		}

		protected changeService(path: string): void
		{
			if (this.service_ != null)
				this.service_.destructor();

			this.service_ = this.createService(path);
			if (this.service_ != null)
			{
				this.service_["client_"] = this;
				this.service_["path_"] = path;
			}
		}
	}
}