/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

namespace example.chat
{
	// SHORTCUTS
	export import library = samchon.library;
	export import collection = samchon.collection;
	export import protocol = samchon.protocol;
}

/* =================================================================
	SERVER, USER AND CLIENT
================================================================= */
namespace example.chat
{
	export class ChatServer extends protocol.service.Server
	{
		private rooms: ChatRoomList;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.rooms = new ChatRoomList();
		}

		protected createUser(): protocol.service.User
		{
			return new ChatUser(this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getRooms(): ChatRoomList
		{
			return this.rooms;
		}
	}

	export class ChatUser extends protocol.service.User
	{
		private name: string = "";

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(server: ChatServer)
		{
			super(server);
		}

		public createClient(driver: protocol.WebClientDriver): protocol.service.Client
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

	export class ChatClient extends protocol.service.Client
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

		protected createService(path: string): protocol.service.Service
		{
			if (path == "list")
				return new ListService(this, path);
			else if (path.indexOf("chat/") != -1)
				return new ChatService(this, path);
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
			console.log("SENT DATA: " + invoke.getListener());

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
			console.log("REPLIED DATA: " + invoke.getListener());
			
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

/* =================================================================
	SERVICES - LIST & CHAT
================================================================= */
namespace example.chat
{
	export class ListService extends protocol.service.Service
	{
		private get rooms(): ChatRoomList
		{
			return this.getClient().getUser().getServer().getRooms();
		}

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(client: ChatClient, path: string)
		{
			super(client, path);

			// FIRST, SEND THE LIST OF CHATTING ROOMS TO THE NEWLY CONNECTED CLIENT (SERVICE).
			this.send_rooms();

			// ALSO, SEND THE LIST WHENEVENR PARTICIPANTS JOIN OR GO OUT
			this.rooms.addEventListener("insert", ListService.prototype.handle_room_change, this);
			this.rooms.addEventListener("erase", ListService.prototype.handle_room_change, this);
			this.rooms.addEventListener("refresh", ListService.prototype.handle_participant_change, this);
		}

		public destructor(): void
		{
			this.rooms.removeEventListener("insert", ListService.prototype.handle_room_change, this);
			this.rooms.removeEventListener("erase", ListService.prototype.handle_room_change, this);
			this.rooms.removeEventListener("refresh", ListService.prototype.handle_participant_change, this);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getClient(): ChatClient
		{
			return super.getClient() as ChatClient;
		}

		/* ---------------------------------------------------------
			SEND DATA
		--------------------------------------------------------- */
		private handle_room_change(event: collection.CollectionEvent<std.Pair<number, ChatRoom>>): void
		{
			// SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
			this.send_rooms();
		}

		private handle_participant_change(event: collection.CollectionEvent<std.Pair<number, ChatRoom>>): void
		{
			let room: ChatRoom = event.first.value.second;

			let invoke: protocol.Invoke = new protocol.Invoke("setRoom", room["uid"], room.toXML());
			this.sendData(invoke);
		}

		private send_rooms(): void
		{
			let invoke: protocol.Invoke = new protocol.Invoke("setRoomList", this.rooms.toXML());
			this.sendData(invoke);
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		private createRoom(name: string): void
		{
			let rooms: ChatRoomList = this.getClient().getUser().getServer().getRooms();

			rooms.createRoom(name);
		}
	}

	export class ChatService extends protocol.service.Service
	{
		private room: ChatRoom;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(client: ChatClient, path: string)
		{
			super(client, path);

			// FIRST, FIND MATCHED ROOM
			try
			{
				// IDENTIFIER
				let rooms: ChatRoomList = this.getClient().getUser().getServer().getRooms();
				let uid: number = Number(path.split("chat/")[1]);
				let account_id: string = this.getClient().getUser().getAccountID();

				let room: ChatRoom = rooms.get(uid);
				if (room.has(account_id) == true)
				{
					// WHETHER DUPLICATED JOIN
					this.room = null;

					this.sendData(new protocol.Invoke("alert", "You've already joined in this room.", "Error"));
				}
				else
				{
					this.room = room;

					// INFORMATION ABOUT THE ROOM WILL BE SENT AUTOMATICALLY
					// BY ChatRoom.handle_change
					this.room.insert([account_id, this]);
				}
			}
			catch (exception)
			{
				this.room = null;
			}
		}

		public destructor(): void
		{
			if (this.room == null)
				return;

			this.room.erase(this.getClient().getUser().getAccountID());
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getClient(): ChatClient
		{
			return super.getClient() as ChatClient;
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		public replyData(invoke: protocol.Invoke)
		{
			// DON'T ACCEPT ANY MESSAGE WHEN FAILED TO JOIN A ROOM
			if (this.room == null)
				return;
			
			super.replyData(invoke);
		}

		private talk(message: string): void
		{
			let my_account_id: string = this.getClient().getUser().getAccountID();

			let invoke: protocol.Invoke = new protocol.Invoke("printTalk", my_account_id, message);
			this.room.sendData(invoke);
		}
		
		private whisper(to: string, message: string): void
		{
			let from: string = this.getClient().getUser().getAccountID();
			let invoke: protocol.Invoke = new protocol.Invoke("printWhisper", from, to, message);

			this.room.get(to).sendData(invoke); // TO OTHERSIDE
			if (from != to)
				this.sendData(invoke); // AND MYSELF
		}
	}
}

/* =================================================================
	CHATTING ROOMS
================================================================= */
namespace example.chat
{
	export class ChatRoomList 
		extends collection.HashMapCollection<number, ChatRoom>
	{
		private sequence: number = 0; // AUTO_INCREMENT FOR ChatRoom.uid

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		// using super::super

		public createRoom(name: string): void
		{
			let uid: number = ++this.sequence;

			this.insert([uid, new ChatRoom(this, uid, name)]);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public toXML(): library.XML
		{
			// <roomList>
			//     <room ... />
			//     <room ... />
			// </roomList>
			let xml: library.XML = new library.XML();
			xml.setTag("roomList");

			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				xml.push(it.second.toXML());

			return xml;
		}
	}

	export class ChatRoom 
		extends collection.HashMapCollection<string, ChatService>
		// implements protocol.IProtocol
	{
		private rooms: ChatRoomList;
		private uid: number;
		private title: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(rooms: ChatRoomList, uid: number, title: string)
		{
			super();

			this.rooms = rooms;
			this.uid = uid;
			this.title = title;

			this.addEventListener("insert", ChatRoom.prototype.handle_change, this);
			this.addEventListener("erase", ChatRoom.prototype.handle_change, this);
		}

		/* ---------------------------------------------------------
			SEND DATA
		--------------------------------------------------------- */
		private handle_change(event: collection.CollectionEvent<std.Pair<string, ChatService>>): void
		{
			if (event.type == "erase" && this.empty() == true)
			{
				// NO PARTICIPANT LEFT, THEN ERASE THIS ROOM
				this.rooms.erase(this.uid);
				return;
			}
			
			// SEND CHANGE TO PARTICIPANTS
			let invoke: protocol.Invoke = new protocol.Invoke("setRoom", this.toXML());
			this.sendData(invoke);

			// NOTIFY CHANGE TO ITS PARENT ROOM_LIST
			let it = this.rooms.find(this.uid);
			this.rooms.refresh(it);
		}

		public sendData(invoke: protocol.Invoke): void
		{
			// SEND DATA - TO ALL PARTICIPANTS
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				it.second.sendData(invoke);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public toXML(): library.XML
		{
			// <room uid="1" name="Debate Something">
			//     <participant id="samchon" name="Jeongho Nam" />
			//     <participant account="john" name="John Doe" />
			// </room>
			let xml: library.XML = new library.XML();
			xml.setTag("room");
			xml.setProperty("uid", this.uid + "");
			xml.setProperty("title", this.title);

			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
			{
				let participant: library.XML = new library.XML();
				participant.setTag("participant");
				participant.setProperty("id", it.second.getClient().getUser().getAccountID());
				participant.setProperty("name", (it.second.getClient().getUser() as ChatUser).getName());

				xml.push(participant);
			}
			return xml;
		}
	}
}

/* =================================================================
	MAIN
================================================================= */
namespace example.chat
{
	export function main(): void
	{
		let server: ChatServer = new ChatServer();
		server.open(11723);
	}
}

example.chat.main();