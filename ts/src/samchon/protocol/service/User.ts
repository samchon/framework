/// <reference path="../../API.ts" />

/// <refernece path="../../collection/HashMapCollection.ts" />

namespace samchon.protocol.service
{
	export abstract class User
		extends collection.HashMapCollection<number, Client>
		implements protocol.IProtocol
	{
		// RELATED OBJECTS
		private server_: Server;

		// KEY
		private session_id_: string;
		private sequence_: number;

		// ACCOUNT
		private account_id_: string;
		private authority_: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from a Server.
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

		public destructor(): void
		{
		}

		protected abstract createClient(driver: WebClientDriver): Client;

		/**
		 * @hidden
		 */
		public _Create_client(driver: WebClientDriver): Client
		{
			return this.createClient(driver);
		}

		/**
		 * @hidden
		 */
		private handle_erase_client(event: collection.MapCollectionEvent<number, Client>): void
		{
			for (let it = event.first; !it.equal_to(event.last); it = it.next())
				it.second.close();
			
			if (this.empty() == true)
				this.server_._Erase_user(this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getServer(): Server
		{
			return this.server_;
		}

		public getAccountID(): string
		{
			return this.account_id_;
		}
		public getAuthority(): number
		{
			return this.authority_;
		}

		public setAccount(id: string, authority: number): void
		{
			if (this.account_id_ == id) // SAME WITH BEFORE
				return;
			else if (this.account_id_ != "") // ACCOUTN IS CHANGED
				this.server_._Get_account_map().erase(this.account_id_); // ERASE FROM ORDINARY ACCOUNT_MAP

			// SET
			this.account_id_ = id;
			this.authority_ = authority;

			// REGISTER TO ACCOUNT_MAP IN ITS SERVER
			this.server_._Get_account_map().set(id, this);
		}

		/**
		 * @hidden
		 */
		public _Get_session_id(): string
		{
			return this.session_id_;
		}

		/**
		 * @hidden
		 */
		public _Fetch_sequence(): number
		{
			return ++this.sequence_;
		}

		/**
		 * @hidden
		 */
		public _Set_session_id(val: string): void
		{
			if (this.session_id_ != "")
				return;

			this.session_id_ = val;
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
			this.server_.replyData(invoke);
		}
	}
}