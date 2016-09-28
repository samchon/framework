/// <reference path="../../APi.ts" />

namespace samchon.protocol.service
{
	/**
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Client implements protocol.IProtocol
	{
		/**
		 * @hidden
		 */
		private user_: User;
		
		/**
		 * @hidden
		 */
		private no_: number;

		/**
		 * @hidden
		 */
		private communicator_: WebClientDriver;
		
		/**
		 * @hidden
		 */
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
			this.no_ = ++user["sequence_"];

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
		 * @return A newly created {@link Service} object or ```null```.
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

		protected changeService(path: string): void
		{
			if (this.service_ != null)
				this.service_.destructor();

			this.service_ = this.createService(path);
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: Invoke): void
		{
			this.communicator_.sendData(invoke);
		}
		
		public replyData(invoke: protocol.Invoke): void
		{
			// SHIFT CHAIN TO USER
			this.user_.replyData(invoke);
			
			// AND SERVICE
			if (this.service_ != null) 
				this.service_.replyData(invoke);
		}
	}
}