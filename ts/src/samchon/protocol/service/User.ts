/// <reference path="../../API.ts" />

/// <refernece path="../../collection/HashMapCollection.ts" />

namespace samchon.protocol.service
{
	/**
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class User
		extends collection.HashMapCollection<number, Client>
		implements protocol.IProtocol
	{
		// RELATED OBJECTS
		/**
		 * @hidden
		 */
		private server_: Server;

		// KEY
		/**
		 * @hidden
		 */
		private session_id_: string;
		
		/**
		 * @hidden
		 */
		private sequence_: number;

		// ACCOUNT
		/**
		 * @hidden
		 */
		private account_id_: string;
		
		/**
		 * @hidden
		 */
		private authority_: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from a {@link Server}.
		 */
		public constructor(server: Server)
		{
			super();

			this.server_ = server;
			this.account_id_ = "guest";
			this.authority_ = 0;

			this.session_id_ = "";
			this.sequence_ = 0;

			this.addEventListener("erase", this.handle_erase_client, this);
		}

		/**
		 * Default Destructor.
		 */
		public destructor(): void
		{
		}

		/**
		 * Factory method creating a {@link Client} object.
		 * 
		 * @param driver A web communicator for remote client.
		 * @return A newly created {@link Client} object.
		 */
		protected abstract createClient(driver: WebClientDriver): Client;

		/**
		 * @hidden
		 */
		private handle_erase_client(event: collection.MapCollectionEvent<number, Client>): void
		{
			for (let it = event.first; !it.equal_to(event.last); it = it.next())
				it.second.close();
			
			if (this.empty() == true)
				this.server_["erase_user"](this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get server.
		 */
		public getServer(): Server
		{
			return this.server_;
		}

		/**
		 * Get account id.
		 */
		public getAccountID(): string
		{
			return this.account_id_;
		}

		/**
		 * Get authority.
		 */
		public getAuthority(): number
		{
			return this.authority_;
		}

		/**
		 * Set account.
		 * 
		 * @param id Account id of this {@link User}.
		 * @param authority Authority of this {@link User}.
		 */
		public setAccount(id: string, authority: number): void
		{
			if (this.account_id_ == id) // SAME WITH BEFORE
				return;
			else if (this.account_id_ != "") // ACCOUTN IS CHANGED
				this.server_["account_map_"].erase(this.account_id_); // ERASE FROM ORDINARY ACCOUNT_MAP

			// SET
			this.account_id_ = id;
			this.authority_ = authority;

			// REGISTER TO ACCOUNT_MAP IN ITS SERVER
			this.server_["account_map_"].set(id, this);
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * Send an {@link Invoke} message.
		 * 
		 * Sends an {@link Invoke} message to all remote clients through the belonged {@link Client} objects. Sending the
		 * {@link Invoke} message to all remote clients, it's came true by passing through the 
		 * {@link Client.sendData Client.sendData()} methods.
		 * 
		 * ```typescript
		 * class User
		 * {
		 *     public sendData(invoke: Invoke): void
		 *     {
		 *         for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
		 *             it.second.sendData(invoke);
		 *     }
		 * }
		 * ```
		 * 
		 * @param invoke {@link Invoke} message to send to all remote clients.
		 */
		public sendData(invoke: Invoke): void
		{
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				it.second.sendData(invoke);
		}

		/**
		 * Handle a replied {@link Invoke} message.
		 * 
		 * @param invoke 
		 */
		public replyData(invoke: Invoke): void
		{
			this.server_.replyData(invoke);
		}
	}
}