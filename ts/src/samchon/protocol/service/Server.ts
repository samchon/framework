/// <reference path="../../API.ts" />

namespace samchon.protocol.service
{
	export abstract class Server
		extends protocol.WebServer
		implements IProtocol
	{
		private session_map: std.HashMap<string, User>;
		private account_map: std.HashMap<string, User>;

		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			this.session_map = new std.HashMap<string, User>();
			this.account_map = new std.HashMap<string, User>();
		}

		protected abstract createUser(): User;

		/* ------------------------------------------------------------------
			ACCESSORS
		------------------------------------------------------------------ */
		public has(account: string): boolean
		{
			return this.account_map.has(account);
		}

		public get(account: string): User
		{
			return this.account_map.get(account);
		}

		/* ------------------------------------------------------------------
			MESSAGE CHAIN
		------------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			for (let it = this.session_map.begin(); !it.equal_to(this.session_map.end()); it = it.next())
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

			if (this.session_map.has(driver.getSessionID()) == true)
				user = this.session_map.get(driver.getSessionID());
			else
			{
				user = this.createUser();
				user["server"] = this;
				user["session_id"] = driver.getSessionID();

				this.session_map.insert(std.make_pair(driver.getSessionID(), user));
			}

			/////
			// CLIENT
			/////
			let client: Client = user["createClient"](driver);
			client["user"] = user;
			client["no"] = ++user["sequence"];
			client["driver"] = driver;
			
			user.insert(std.make_pair(client["no"], client));

			/////
			// SERVICE
			/////
			let service: Service = client["createService"](driver.getPath());
			if (service != null)
			{
				service["client"] = client;
				service["path"] = driver.getPath();
			}
			client["service"] = service;
			
			///////
			// START COMMUNICATION
			///////
			if (driver["listening_"] == false)
				driver.listen(client);

			driver.onClose = function (): void
			{
				// WHEN DISCONNECTED, THEN ERASE THE CLIENT.
				// OF COURSE, IT CAN CAUSE DELETION OF THE RELATED USER.
				user.erase(client["no"]);

				// ALSO, DESTRUCTOR OF THE SERVICE IS CALLED.
				if (client["service"] != null)
					client["service"].destructor();
			}
		}

		private erase_user(user: User): void
		{
			// USER DOESN'T BE ERASED AT THAT TIME
			// IT WAITS UNTIL 30 SECONDS TO KEEP SESSION
			setTimeout(function ()
				{
					if (user.empty() == false)
						return;

					this.session_map.erase(user["session_id"]);
					if (user.getAccountID() != "")
						this.account_map.erase(user.getAccountID());
				}.bind(this), 30000);
		}
	}
}