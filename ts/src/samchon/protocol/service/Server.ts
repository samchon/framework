﻿/// <reference path="../../API.ts" />

/// <reference path="../Server.ts" />

namespace samchon.protocol.service
{
	/** 
	 * A cloud server.
	 * 
	 * The {@link Server} is an abstract class, who can build a real-time cloud server, that is following the web-socket 
	 * protocol. Extends this {@link Server} and related classes and overrides abstract methods under below. After the 
	 * overridings, open this {@link Server cloud server} by using the {@link open open()} method.
	 * 
	 * - Factory methods
	 *   - {@link Server.createUser Server.createUser()}
	 *   - {@link User.createClient User.createClient()}
	 *   - {@liok Client.createService Client.createService()}
	 * - {@link Invoke} message chains; {@link IProtocol.replyData replyData}
	 *   - {@link Server.replyData}
	 *   - {@link User.replyData}
	 *   - {@link Client.replyData}
	 *   - {@link Service.replyData}
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class Server
		extends protocol.WebServer
		implements IProtocol
	{
		/**
		 * @hidden
		 */
		private session_map_: std.HashMap<string, User>;
		
		/**
		 * @hidden
		 */
		private account_map_: std.HashMap<string, User>;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			// INITIALIZE USER MAPS
			this.session_map_ = new std.HashMap<string, User>();
			this.account_map_ = new std.HashMap<string, User>();
		}

		/**
		 * Factory method creating {@link User} object.
		 * 
		 * @return A newly created {@link User} object.
		 */
		protected abstract createUser(): User;

		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		/**
		 * Test wheter an {@link User} exists with the *accountID*.
		 * 
		 * @param accountID Account id of {@link User} to find.
		 * @return Exists or not.
		 */
		public has(accountID: string): boolean
		{
			return this.account_map_.has(accountID);
		}

		/**
		 * Get an {@link User} object by its *accountID*.
		 * 
		 * @param accountID Account id of {@link User} to get.
		 * @return An {@link User} object.
		 */
		public get(accountID: string): User
		{
			return this.account_map_.get(accountID);
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		/**
		 * Send an {@link Invoke} message.
		 * 
		 * Sends an {@link Invoke} message to all remote clients through the belonged {@link User} and {@link Client} 
		 * objects. Sending the {@link Invoke} message to all remote clients, it's came true by passing through 
		 * {@link User.sendData User.sendData()}. And the {@link User.sendData} also pass through the 
		 * {@link Client.sendData Client.sendData()}.
		 * 
		 * ```typescript
		 * class Server
		 * {
		 *     public sendData(invoke: Invoke): void
		 *     {
		 *         for (user: User in this)
		 *             for (client: Client in user)
		 *                 client.sendData(invoke);
		 *     }
		 * }
		 * ```
		 * 
		 * @param invoke {@link Invoke} message to send to all remote clients.
		 */
		public sendData(invoke: Invoke): void
		{
			for (let it = this.session_map_.begin(); !it.equal_to(this.session_map_.end()); it = it.next())
				it.second.sendData(invoke);
		}

		/**
		 * Handle a replied {@link Invoke} message.
		 * 
		 * The {@link Server.replyData Server.replyData()} is an abstract method that handling {@link Invoke} message 
		 * that should be handled in the {@link Server} level. Overrides this {@link replyData replyData()} method and 
		 * defines what to do with the {@link Invoke} message in this {@link Server} level.
		 * 
		 * @param invoke An {@link Invoke invoke} message to be handled in {@link Server} level.
		 */
		public abstract replyData(invoke: Invoke): void;

		/* ------------------------------------------------------------------
			CLIENT I/O
		------------------------------------------------------------------ */
		/**
		 * Add a newly connected remote client.
		 * 
		 * When a {@link WebClientDriver remote client} connects to this cloud server, then {@link Server} queries the
		 * {WebClientDriver.getSessionID session id} of the {@link WebClientDriver remote client}. If the 
		 * {WebClientDriver.getSessionID session id} is new one, then creates a new {@link User} object.
		 * 
		 * At next, creates a {@link Client} object who represents the newly connected remote client and insert the 
		 * {@link Client} object to the matched {@link User} object which is new or ordinary one following the 
		 * {WebClientDriver.getSessionID session id}. At last, a {@link Service} object can be created with referencing 
		 * the {@link WebClientDriver.getPath path}.
		 * 
		 * List of objects can be created by this method.
		 * - {@link User} by {@link createUser createUser()}.
		 * - {@link Client} by {@link User.createClient User.createClient()}.
		 * - {@link Service} by {@link Client.createService Client.createService()}.
		 * 
		 * @param driver A web communicator for remote client.
		 */
		public addClient(driver: WebClientDriver): void
		{
			//--------
			// CREATE CHILDREN OBJECTS
			//--------
			// USER
			/////
			let user: User;

			if (this.session_map_.has(driver.getSessionID()) == true)
				user = this.session_map_.get(driver.getSessionID());
			else
			{
				user = this.createUser();
				user["session_id_"] = (driver.getSessionID());

				this.session_map_.insert(std.make_pair(driver.getSessionID(), user));
			}

			//--------
			// CLIENT
			//--------
			// SERVICE IS CREEATED IN CLIENT'S CONSTRUCTOR
			let client: Client = user["createClient"](driver);
			user.insert(std.make_pair(client.getNo(), client));
			
			// CLOSE HANDLER
			driver.onClose = function (): void
			{
				// WHEN DISCONNECTED, THEN ERASE THE CLIENT.
				// OF COURSE, IT CAN CAUSE DELETION OF THE RELATED USER.
				user.erase(client.getNo());

				// ALSO, DESTRUCTORS OF THE SERVICE ARE CALLED.
				if (client.getService() != null)
					client.getService().destructor(); // SERVICE

				client.destructor(); // AND CLIENT
			}
		}

		/**
		 * @hidden
		 */
		private erase_user(user: User): void
		{
			// USER DOESN'T BE ERASED AT THAT TIME
			// IT WAITS UNTIL 30 SECONDS TO KEEP SESSION
			setTimeout
			(
				function ()
				{
					let server: Server = this;
					if (user.empty() == false)
						return; // USER IS NOT EMPTY, THEN RETURNS
						
					// ERASE USER FROM
					server.session_map_.erase(user["session_id_"]); // SESSION-ID MAP
					if (user.getAccountID() != "") // AND ACCOUNT-ID MAP
						server.account_map_.erase(user.getAccountID()); 

					// CALL DESTRUCTOR
					user.destructor();
				}.bind(this),
				30000 // KEEP USER 30 SECONDS
			);
		}
	}
}