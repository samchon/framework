import std = require("typescript-stl");
import samchon = require("samchon-framework");

import collections = samchon.collections;
import library = samchon.library;
import protocol = samchon.protocol;
import templates = samchon.templates;

import room = require("./room");
import service = require("./service");

/* =================================================================
	SERVER, USER AND CLIENT
================================================================= */
namespace server
{
	export class ChatServer extends templates.service.Server
	{
		private rooms: room.ChatRoomList;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.rooms = new room.ChatRoomList();
		}

		protected createUser(): templates.service.User
		{
			return new ChatUser(this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getRooms(): room.ChatRoomList
		{
			return this.rooms;
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}
	}

	export class ChatUser extends templates.service.User
	{
		private name: string = "";

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(server: ChatServer)
		{
			super(server);
		}

		public createClient(driver: protocol.WebClientDriver): templates.service.Client
		{
			return new ChatClient(this, driver);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getServer(): ChatServer
		{
			return super.getServer() as ChatServer;
		}

		public setName(val: string): void
		{
			this.name = val;
		}
		public getName(): string
		{
			return this.name;
		}
	}

	export class ChatClient extends templates.service.Client
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(user: ChatUser, driver: protocol.WebClientDriver)
		{
			super(user, driver);

			if (user.getAuthority() != 0)
				this.send_account_info();
		}

		protected createService(path: string): templates.service.Service
		{
			if (path == "list")
				return new service.ListService(this, path);
			else if (path.indexOf("chat/") != -1)
				return new service.ChatService(this, path);
			else
				return null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getUser(): ChatUser
		{
			return super.getUser() as ChatUser;
		}

		/* ---------------------------------------------------------
			SEND DATA
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			console.log("SENT DATA: " + invoke.toXML().toString());

			super.sendData(invoke);
		}

		private send_account_info(): void
		{
			let id: string = this.getUser().getAccountID();
			let name: string = this.getUser().getName();

			this.sendData(new protocol.Invoke("setAccount", id, name)); 
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		public replyData(invoke: protocol.Invoke): void
		{
			console.log("REPLIED DATA: " + invoke.toXML().toString());
			
			if (invoke.apply(this) == false)
				super.replyData(invoke);
		}

		private login(id: string, name: string): void
		{
			if (this.getUser().getAccountID() != "guest")
				this.sendData(new protocol.Invoke("handleLoginFailed", "You're already being logged-in."));
			else if (this.getUser().getServer().has(id) == true)
				this.sendData(new protocol.Invoke("handleLoginFailed", "Another one is using the account."));
			else
			{
				this.getUser().setAccount(id, 1);
				this.getUser().setName(name);

				this.send_account_info();
			}
		}
	}
}

export = server;