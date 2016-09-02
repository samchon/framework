/// <reference path="../../API.ts" />

/// <reference path="../Server.ts" />

namespace samchon.protocol.service
{
	export abstract class Server
		extends protocol.WebServer
		implements IProtocol
	{
		private session_map_: std.HashMap<string, User>;
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
		public has(account: string): boolean
		{
			return this.account_map_.has(account);
		}

		public get(account: string): User
		{
			return this.account_map_.get(account);
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			for (let it = this.session_map_.begin(); !it.equal_to(this.session_map_.end()); it = it.next())
				it.second.sendData(invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		/* ------------------------------------------------------------------
			CLIENT I/O
		------------------------------------------------------------------ */
		public addClient(driver: WebClientDriver): void
		{
			/////////////////////////////////////////////
			// CREATE CHILDREN OBJECTS
			/////////////////////////////////////////////
			// USER
			/////
			let user: User;

			if (this.session_map_.has(driver.getSessionID()) == true)
				user = this.session_map_.get(driver.getSessionID());
			else
			{
				user = this.createUser();
				user["server_"] = this;
				user["session_id_"] = driver.getSessionID();

				this.session_map_.insert(std.make_pair(driver.getSessionID(), user));
			}

			/////
			// CLIENT
			/////
			let client: Client = user["createClient"](driver);
			client["user_"] = user;
			client["no_"] = ++user["sequence_"];
			client["communicator_"] = driver;
			
			user.insert(std.make_pair(client["no_"], client));

			/////
			// SERVICE
			/////
			let service: Service = client["createService"](driver.getPath());
			if (service != null)
			{
				service["client_"] = client;
				service["path_"] = driver.getPath();
			}
			client["service_"] = service;
			
			///////
			// START COMMUNICATION
			///////
			// CLOSE HANDLER
			driver.onClose = function (): void
			{
				// WHEN DISCONNECTED, THEN ERASE THE CLIENT.
				// OF COURSE, IT CAN CAUSE DELETION OF THE RELATED USER.
				user.erase(client["no_"]);

				// ALSO, DESTRUCTOR OF THE SERVICE IS CALLED.
				if (client["service_"] != null)
					client["service_"].destructor();
			}

			// PRECAUTION FOR IDIOTS
			client["communicator_"] = driver;
			if (driver["listening_"] == false)
				driver.listen(client);
		}

		private erase_user(user: User): void
		{
			// USER DOESN'T BE ERASED AT THAT TIME
			// IT WAITS UNTIL 30 SECONDS TO KEEP SESSION
			setTimeout(function (user: User)
				{
					let server: Server = this;
					if (user.empty() == false)
						return;

					server.session_map_.erase(user["session_id_"]);
					if (user.getAccountID() != "")
						server.account_map_.erase(user.getAccountID());
				}.bind(this, [user]), 30000);
		}
	}
}