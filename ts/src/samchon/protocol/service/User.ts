/// <reference path="../../API.ts" />

/// <refernece path="../../collection/HashMapCollection.ts" />

namespace samchon.protocol.service
{
	export abstract class User
		extends collection.HashMapCollection<number, Client>
		implements protocol.IProtocol
	{
		// RELATED OBJECTS
		private server: Server;

		// KEY
		private session_id: string;
		private sequence: number;

		// ACCOUNT
		private account: string;
		private authority: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor(server: Server)
		{
			super();

			this.server = server;
			
			this.sequence = 0;
			this.account = "guest";
			this.authority = 1;

			this.addEventListener("erase", this.handle_erase_client, this);
		}

		public abstract createClient(): Client;

		private handle_erase_client(event: collection.CollectionEvent<std.Pair<number, Client>>): void
		{
			for (let it = event.first; !it.equal_to(event.last); it = it.next())
			{
				it.value.second.close();
			}
			if (this.empty() == true)
				this.server["erase_user"](this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getServer(): Server
		{
			return this.server;
		}
		public getAccount(): string
		{
			return this.account;
		}
		public getAuthority(): number
		{
			return this.authority;
		}

		protected setAccount(account: string, authority: number): void
		{
			if (this.account == account) // SAME WITH BEFORE
				return;
			else if (this.account != "") // ACCOUTN IS CHANGED
				this.server["account_map"].erase(this.account); // ERASE FROM ORDINARY ACCOUNT_MAP

			// SET
			this.account = account;
			this.authority = authority;

			// REGISTER TO ACCOUNT_MAP IN ITS SERVER
			this.server["account_map"].set(account, this);
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				it.second.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
			this.server.replyData(invoke);
		}
	}
}