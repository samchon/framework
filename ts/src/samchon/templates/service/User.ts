/// <reference path="../../API.ts" />

/// <refernece path="../../collection/HashMapCollection.ts" />

namespace samchon.templates.service
{
	/**
	 * An user.
	 * 
	 * The {@link User} is an abstract class groupping {@link Client} objects, who communicates with remote client, with 
	 * same *session id*. This {@link User} represents a *remote user* literally. Within framework of remote system, 
	 * an {@link User} corresponds to a web-browser and a {@link Client} represents a window in the web-browser.
	 * 
	 * Extends this {@link User} class and override the {@link createClient} method, a factory method creating a child 
	 * {@link Client} object. I repeat, the {@link User} class represents a *remote user*, groupping {@link Client} 
	 * objects with same *session id*. If your cloud server has some processes to be handled in the **user level**, then 
	 * defines method in this {@link User} class. Methods managing **account** under below are some of them:
	 * 
	 * - {@link setAccount setAccount()}
	 * - {@link getAccountID getAccountID()}
	 * - {@link getAuthority getAuthority()}
	 * 
	 * The children {@link Client} objects, they're contained with their key, the {@link Client.getNo sequence number}.
	 * If you {@link User.erase erase} the children {@link Client} object by yourself, then their connection with the 
	 * remote clients will be {@link Client.close closed} and their {@link Client.destructor destruction method} will be 
	 * called. If you remove {@link clear all children}, then this {@link User} object will be also 
	 * {@link destructor destructed} and erased from the parent {@link Server} object.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png" target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_cloud_service.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @handbook [Templates - Cloud Service](https://github.com/samchon/framework/wiki/TypeScript-Templates-Cloud_Service)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class User
		extends collections.HashMapCollection<number, Client>
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
		 * Construct from its parent {@link Server}.
		 * 
		 * @param server The parent {@link Server} object.
		 */
		public constructor(server: Server)
		{
			super();

			this.server_ = server;
			this.account_id_ = "guest";
			this.authority_ = 0;

			this.session_id_ = "";
			this.sequence_ = 0;

			this.addEventListener("erase", this._Handle_erase_client, this);
		}

		/**
		 * Default Destructor.
		 * 
		 * This {@link destructor destructor()} method is called when the {@link User} object is destructed. The 
		 * {@link User} object is destructed when connections with the remote clients are all closed, that is all the 
		 * children {@link Client} objects are all removed, and 30 seconds has left. If some remote client connects 
		 * within the 30 seconds, then the {@link User} object doesn't be destructed.
		 * 
		 * Note that, don't call this {@link destructor destructor()} method by yourself. It must be called automatically
		 * by those *destruction* cases. Also, if your derived {@link User} class has something to do on the
		 * *destruction*, then overrides this {@link destructor destructor()} method and defines the something to do.
		 * Overriding this {@link destructor destructor()}, don't forget to calling ```super.destructor();``` on tail.
		 * 
		 * ```typescript
		 * class MyUser extends protocol.service.User
		 * {
		 *     protected destructor(): void
		 *     {
		 *         // DO SOMETHING
		 *         this.do_something();
		 *
		 *         // CALL SUPER.DESTRUCTOR() ON TAIL. DON'T FORGET THIS
		 *         super.destructor();
		 *     }
		 * }
		 * ```
		 */
		protected destructor(): void
		{
		}

		/**
		 * Factory method creating a {@link Client} object.
		 * 
		 * @param driver A web communicator for remote client.
		 * @return A newly created {@link Client} object.
		 */
		protected abstract createClient(driver: protocol.WebClientDriver): Client;

		/**
		 * @hidden
		 */
		private _Handle_erase_client(event: collections.MapCollectionEvent<number, Client>): void
		{
			for (let it = event.first; !it.equals(event.last); it = it.next())
				it.second.close();
			
			if (this.empty() == true)
				this.server_["_Erase_user"](this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get parent {@lin Server} object.
		 * 
		 * @return Parent {@link Server} object.
		 */
		public getServer(): Server
		{
			return this.server_;
		}

		/**
		 * Get account id.
		 * 
		 * @return Account ID.
		 */
		public getAccountID(): string
		{
			return this.account_id_;
		}

		/**
		 * Get authority.
		 * 
		 * @return Authority
		 */
		public getAuthority(): number
		{
			return this.authority_;
		}

		/**
		 * Set *account id* and *authority*.
		 * 
		 * The {@link setAccount setAccount()} is a method configuring *account id* and *authority* of this {@link User}. 
		 * 
		 * After the configuring, the {@link getAccountID account id} is enrolled into the parent {@link Server} as a 
		 * **key** for this {@link User} object. You can test existence and access this {@link User} object from 
		 * {@link Server.has Server.has()} and {@link Server.get Server.get()} with the {@link getAccountID account id}.
		 * Of course, if ordinary {@link getAccountID account id} had existed, then the ordinary **key** will be 
		 * replaced.
		 * 
		 * As you suggest, this {@link setAccount setAccount()} is something like a **log-in** function. If what you want
		 * is not **logging-in**, but **logging-out**, then configure the *account id* to empty string ``""```` or call 
		 * the {@link lgout logout()} method.
		 * 
		 * @param id To be account id.
		 * @param authority To be authority.
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
			if (id != "")
				this.server_["account_map_"].set(id, this);
		}

		/**
		 * Log-out.
		 * 
		 * This {@link logout logout()} method configures {@link getAccountID account id} to empty string and 
		 * {@link getAuthority authority} to zero. 
		 * 
		 * The ordinary {@link getAccountID account id} will be also erased from the parent {@link Server} object. You 
		 * can't access this {@link User} object from {@link Server.has Server.has()} and {@link Server.get Server.get()}
		 * with the ordinary {@link getAccountID account id} more.
		 */
		public logout(): void
		{
			if (this.account_id_ != "")
				this.server_["account_map_"].erase(this.account_id_);

			this.setAccount("", 0);
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
		 * class protocol.service.User
		 * {
		 *     public sendData(invoke: Invoke): void
		 *     {
		 *         for (let it = this.begin(); !it.equals(this.end()); it = it.next())
		 *             it.second.sendData(invoke);
		 *     }
		 * }
		 * ```
		 * 
		 * @param invoke {@link Invoke} message to send to all remote clients.
		 */
		public sendData(invoke: protocol.Invoke): void
		{
			for (let it = this.begin(); !it.equals(this.end()); it = it.next())
				it.second.sendData(invoke);
		}

		/**
		 * Handle a replied {@link Invoke} message.
		 * 
		 * The default {@link User.replyData User.replyData()} shifts chain to its parent {@link Server} object, by
		 * calling the {@link Server.replyData Server.replyData()} method. If there're some {@link Invoke} message to be 
		 * handled in this {@link User} level, then override this method and defines what to do with the {@link Invoke} 
		 * message in this {@link User} level.
		 * 
		 * ```typescript
		 * class protocol.service.User
		 * {
		 *     public replyData(invoke: protocol.Invoke): void
		 *     {
		 *         this.getServer().replyData(invoke);
		 *     }
		 * }
		 * 
		 * class MyUser extends protocol.service.User
		 * {
		 *     public replyData(invoke: protocol.Invoke): void
		 *     {
		 *          if (invoke.apply(this) == false) // IS TARGET TO BE HANDLED IN THIS USER LEVEL
		 *              super.replyData(invoke); // SHIFT TO SERVER
		 *     }
		 * }
		 * ```
		 * 
		 * @param invoke An {@link Invoke invoke} message to be handled in {@link User} level.
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			this.server_.replyData(invoke);
		}
	}
}