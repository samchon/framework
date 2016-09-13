/// <reference path="../../APi.ts" />

namespace samchon.protocol.service
{
	export abstract class Client implements protocol.IProtocol
	{
		private user_: User;
		private no_: number;

		private communicator_: WebClientDriver;

		private service_: Service;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Construct from an User and WebClientDriver.
		 */
		public constructor(user: User, driver: WebClientDriver)
		{
			this.user_ = user;
			this.no_ = -1;

			// ENROLL COMMUNICATOR
			this.communicator_ = driver;
			this.communicator_.listen(this);
			
			// CREATE SERVICE DIRECLTY
			this.service_ = this.createService(driver.getPath());
		}

		/**
		 * Default Destructor.
		 */
		public destructor(): void
		{
		}

		/**
		 * Factory method creating {@link Service} object.
		 * 
		 * @param path Requested path.
		 * @return A new {@link Service} typed object or ```null```.
		 */
		protected abstract createService(path: string): Service;

		/**
		 * Close connection.
		 */
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

		public getNo(): number
		{
			return this.no_;
		}

		public _Set_no(val: number): void
		{
			if (this.no_ != -1)
				return;

			this.no_ = val;
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator_.sendData(invoke);
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			// THIS CLIENT OBJECT HAS THE MATCHED LISTENER?
			if (invoke.apply(this) == true)
				return;

			// SHIFT CHAIN TO USER
			this.user_.replyData(invoke);
			if (this.service_ != null) // AND SERVICE
				this.service_.replyData(invoke);
		}

		protected changeService(path: string): void
		{
			if (this.service_ != null)
				this.service_.destructor();

			this.service_ = this.createService(path);
		}
	}
}