/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import sf = require("samchon-framework");

namespace example.chat
{
	// SHORTCUTS
	export import library = sf.library;
	export import collection = sf.collection;
	export import protocol = sf.protocol;
}

/* =================================================================
	SERVER, USER AND CLIENT
================================================================= */
namespace example.chat
{
	export class ChatServer extends protocol.service.Server
	{
		private rooms: ChatRoomList;

		public constructor()
		{
			super();

			this.rooms = new ChatRoomList();
		}

		protected createUser(): protocol.service.User
		{
			return new ChatUser(this);
		}

		public getRooms(): ChatRoomList
		{
			return this.rooms;
		}
	}

	export class ChatUser extends protocol.service.User
	{
		private name: string = "";

		public createClient(): protocol.service.Client
		{
			return new ChatClient(this);
		}

		public getName(): string
		{
			return this.name;
		}
	}

	export class ChatClient extends protocol.service.Client
	{
		protected createService(path: string): protocol.service.Service
		{
			if (path == "list")
				return new ListService(this, path);
			else if (path.indexOf("chat/") != -1)
				return new ChatService(this, path);
			else
				return null;
		}

		public sendAccountInfo(): void
		{
			let id: string = this.getUser().getAccount();
			let name: string = (this.getUser() as ChatUser).getName();

			this.sendData(new protocol.Invoke("handleAccountInfo", id, name)); 
		}

		private login(id: string, name: string): void
		{
			if (this.getUser().getAccount() != "guest")
				this.sendData(new protocol.Invoke("handleLogin", false, "You're already being logged-in."));
			else if (this.getUser().getServer().has(id) == true)
				this.sendData(new protocol.Invoke("handleLogin", false, "Another one is using the account."));
			else
			{
				this.getUser()["account"] = id;
				(this.getUser() as ChatUser)["name"] = name;

				this.sendData(new protocol.Invoke("handleLogin", true));
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
		public constructor(client: ChatClient, path: string)
		{
			super(client, path);

			// FIRST, SEND ACCOUNT INFO
			(this.getClient() as ChatClient).sendAccountInfo();

			// SECOND, SEND THE LIST OF CHATTING ROOMS TO THE NEWLY CONNECTED CLIENT (SERVICE).
			this.send_rooms();

			// ALSO, SEND THE LIST WHENEVENR PARTICIPANTS JOIN OR GO OUT
			let rooms: ChatRoomList = (this.getClient().getUser().getServer() as ChatServer).getRooms();

			rooms.addEventListener("insert", ListService.prototype.handle_change, this);
			rooms.addEventListener("erase", ListService.prototype.handle_change, this);
		}

		public destructor(): void
		{
			let rooms: ChatRoomList = (this.getClient().getUser().getServer() as ChatServer).getRooms();

			rooms.removeEventListener("insert", ListService.prototype.handle_change, this);
			rooms.removeEventListener("erase", ListService.prototype.handle_change, this);
		}

		private handle_change(event: collection.CollectionEvent<std.Pair<string, ChatService>>): void
		{
			// SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
			this.send_rooms();
		}

		private send_rooms(): void
		{
			let rooms: ChatRoomList = (this.getClient().getUser().getServer() as ChatServer).getRooms();

			let invoke: protocol.Invoke = new protocol.Invoke("setRoomList", rooms.toXML());
			this.sendData(invoke);
		}

		private createRoom(name: string): void
		{
			let rooms: ChatRoomList = (this.getClient().getUser().getServer() as ChatServer).getRooms();

			rooms.createRoom(name);
		}
	}

	export class ChatService extends protocol.service.Service
	{
		private room: ChatRoom;

		public constructor(client: ChatClient, path: string)
		{
			super(client, path);

			// FIRST, SEND ACCOUNT INFO
			(this.getClient() as ChatClient).sendAccountInfo();

			// SECOND, FIND MATCHED ROOM
			try
			{
				// IDENTIFIER
				let rooms: ChatRoomList = (this.getClient().getUser().getServer() as ChatServer).getRooms();
				let uid: number = Number(path.split("chat/")[1]);
				let account_id: string = this.getClient().getUser().getAccount();
				
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

			this.room.erase(this.getClient().getUser().getAccount());
		}

		public replyData(invoke: protocol.Invoke)
		{
			// DON'T ACCEPT ANY MESSAGE WHEN FAILED TO JOIN A ROOM
			if (this.room == null)
				return;
			
			super.replyData(invoke);
		}

		private talk(message: string): void
		{
			let my_account_id: string = this.getClient().getUser().getAccount();

			let invoke: protocol.Invoke = new protocol.Invoke("printTalk", my_account_id, message);
			this.room.sendData(invoke);
		}

		private whisper(to: string, message: string): void
		{
			let my_account_id: string = this.getClient().getUser().getAccount();

			let invoke: protocol.Invoke = new protocol.Invoke("printWhisper", my_account_id, to, message);
			this.room.sendData(invoke);
		}
	}
}

/* =================================================================
	CHATTING ROOMS
================================================================= */
namespace example.chat
{
	export class ChatRoomList extends collection.HashMapCollection<number, ChatRoom>
	{
		private sequence: number = 0; // AUTO_INCREMENT FOR ChatRoom.uid

		// using super::super

		public createRoom(name: string): void
		{
			let uid: number = ++this.sequence;

			this.insert(std.make_pair(uid, new ChatRoom(this, uid, name)));
		}

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
		private name: string;

		public constructor(rooms: ChatRoomList, uid: number, name: string)
		{
			super();

			this.rooms = rooms;
			this.uid = uid;
			this.name = name;

			this.addEventListener("insert", ChatRoom.prototype.handle_change, this);
			this.addEventListener("erase", ChatRoom.prototype.handle_change, this);
		}

		private handle_change(event: collection.CollectionEvent<std.Pair<string, ChatService>>): void
		{
			if (event.type == "erase" && this.empty() == true)
			{
				// NO PARTICIPANT LEFT, THEN ERASE THIS ROOM
				this.rooms.erase(this.uid);
				return;
			}
			
			let invoke: protocol.Invoke = new protocol.Invoke("setRoom", this.toXML());
			this.sendData(invoke);
		}

		public sendData(invoke: protocol.Invoke): void
		{
			// SEND DATA - TO ALL PARTICIPANTS
			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
				it.second.sendData(invoke);
		}

		public toXML(): library.XML
		{
			// <room uid="1" name="Debate Something">
			//     <participant id="samchon" name="Jeongho Nam" />
			//     <participant account="john" name="John Doe" />
			// </room>
			let xml: library.XML = new library.XML();
			xml.setTag("room");
			xml.setProperty("uid", this.uid + "");
			xml.setProperty("name", this.name);

			for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
			{
				let participant: library.XML = new library.XML();
				participant.setTag("participant");
				participant.setProperty("id", it.second.getClient().getUser().getAccount());
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
		server.open(37755);
	}
}

example.chat.main();