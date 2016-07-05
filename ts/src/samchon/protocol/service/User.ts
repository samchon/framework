/// <reference path="../../API.ts" />

namespace samchon.protocol.service
{
	export abstract class User 
		implements protocol.IProtocol
	{
		// RELATED OBJECTS
		private server: Server;
		private client_map: std.TreeMap<number, Client>;

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
			this.server = server;
			this.client_map = new std.TreeMap<number, Client>();
			
			this.sequence = 0;
			this.account = "guest";
			this.authority = 1;
		}

		public abstract createClient(): Client;

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
			for (let it = this.client_map.begin(); !it.equal_to(this.client_map.end()); it = it.next())
				it.second.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
			this.server.replyData(invoke);
		}
	}
}