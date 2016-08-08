# Chatting
## ChatServer
#### Class Diagram
![ChatServer Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/example_chat_server.png)

#### room.ts
``` typescript
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import collection = samchon.collection;
import library = samchon.library;
import protocol = samchon.protocol;

import server = require("./server");
import service = require("./service");

namespace room
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
		extends collection.HashMapCollection<string, service.ChatService>
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
		private handle_change(event: collection.CollectionEvent<std.Pair<string, service.ChatService>>): void
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
				participant.setProperty("name", (it.second.getClient().getUser() as server.ChatUser).getName());

				xml.push(participant);
			}
			return xml;
		}
	}
}

export = room;
```

#### server.ts
``` typescript
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import collection = samchon.collection;
import library = samchon.library;
import protocol = samchon.protocol;

import room = require("./room");
import service = require("./service");

/* =================================================================
	SERVER, USER AND CLIENT
================================================================= */
namespace server
{
	export class ChatServer extends protocol.service.Server
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

		protected createUser(): protocol.service.User
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

export = server;
```

#### service.ts
``` typescript
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import collection = samchon.collection;
import library = samchon.library;
import protocol = samchon.protocol;

import server = require("./server");
import room = require("./room");

namespace service
{
	export class ListService extends protocol.service.Service
	{
		private get rooms(): room.ChatRoomList
		{
			return this.getClient().getUser().getServer().getRooms();
		}

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(client: server.ChatClient, path: string)
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
		public getClient(): server.ChatClient
		{
			return super.getClient() as server.ChatClient;
		}

		/* ---------------------------------------------------------
			SEND DATA
		--------------------------------------------------------- */
		private handle_room_change(event: collection.CollectionEvent<std.Pair<number, room.ChatRoom>>): void
		{
			// SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
			this.send_rooms();
		}

		private handle_participant_change(event: collection.CollectionEvent<std.Pair<number, room.ChatRoom>>): void
		{
			let room: room.ChatRoom = event.first.value.second;

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
			let rooms: room.ChatRoomList = this.getClient().getUser().getServer().getRooms();

			rooms.createRoom(name);
		}
	}

	export class ChatService extends protocol.service.Service
	{
		private room: room.ChatRoom;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(client: server.ChatClient, path: string)
		{
			super(client, path);

			// FIRST, FIND MATCHED ROOM
			try
			{
				// IDENTIFIER
				let rooms: room.ChatRoomList = this.getClient().getUser().getServer().getRooms();
				let uid: number = Number(path.split("chat/")[1]);
				let account_id: string = this.getClient().getUser().getAccountID();

				let room: room.ChatRoom = rooms.get(uid);
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
		public getClient(): server.ChatClient
		{
			return super.getClient() as server.ChatClient;
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

export = service;
```

###### ListSerivce
  - ListService.constructor
  - ListService.destructor
  - ListService.handle_room_change
  - ListService.handle_participant_change
  - ListService.send_rooms
  - ListService.createRoom

###### ChatService
  - ChatService.constructor
  - ChatService.destructor
  - ChatService.talk
  - ChatService.whisper

## ChatApplication
#### Class Diagram
![ChatApplication Class Diagram](http://samchon.github.io/framework/images/design/ts_class_diagram/example_chat_application.png)

#### API.ts
``` typescript
namespace example.chat
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export const SERVER_HOST: string = "127.0.0.1"; //"115.71.237.198";
	export const SERVER_PORT: number = 11723;
}
```

#### Application.tsx
``` typescript
/// <reference path="API.ts" />

namespace example.chat
{
	export abstract class Application
		extends React.Component<{}, {}>
		implements protocol.IProtocol
	{
		protected id: string;
		protected name: string;

		protected communicator: protocol.WebServerConnector;

		public constructor()
		{
			super();
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- REPLY DATA
		============================================================
			SEND DATA
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator.sendData(invoke);
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		protected setAccount(id: string, name: string): void
		{
			this.id = id;
			this.name = name;

			this.refresh();
		}

		private alert(message: string): void
		{
			alert(message);
		}

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public abstract render(): JSX.Element;

		protected refresh(): void
		{
			ReactDOM.render(this.render(), document.body);
		}
	}
}
```

#### LoginApplication.tsx
``` typescript
```

#### ListApplication.tsx
``` typescript
```

#### ChatApplication.tsx
``` typescript
/// <reference path="API.ts" />

namespace example.chat
{
	export class ChatApplication
		extends Application
	{
		private room: ChatRoom;
		private messages: string = "";

		public constructor(uid: number)
		{
			super();
			
			this.room = new ChatRoom();

			this.communicator = new protocol.WebServerConnector(this);
			this.communicator.connect(SERVER_HOST, SERVER_PORT, "chat/" + uid);
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- REPLY DATA
		============================================================
			SEND DATA
		--------------------------------------------------------- */
		private send_message(event: React.MouseEvent): void
		{
			let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
			let message: string = (document.getElementById("message_input") as HTMLInputElement).value;

			if (to == "")
				this.sendData(new protocol.Invoke("talk", message));
			else
				this.sendData(new protocol.Invoke("whisper", to, message));
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		private setRoom(xml: library.XML): void
		{
			this.room.construct(xml);

			this.refresh();
		}

		private printTalk(senderID: string, message: string): void
		{
			let sender: Participant = this.room.get(senderID);

			this.messages += library.StringUtil.substitute
				(
					"<p> <b>{1}</b>: {2} </p>", 
					sender.getName(), 
					message
				);
			document.getElementById("messages_div").innerHTML = this.messages;
		}

		private printWhisper(from: string, to: string, message: string): void
		{
			let sender: Participant = this.room.get(from);
			let receiver: Participant = this.room.get(to);

			this.messages += library.StringUtil.substitute
				(
					"<p style='color:gray'> (Whisper) <b>{1}</b> to <b>{2}</b> : {3} </p>", 
					sender.getName(), 
					receiver.getName(),
					message
				);
			document.getElementById("messages_div").innerHTML = this.messages;
		}

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public render(): JSX.Element
		{
			let whisper_target_options: JSX.Element[] = [];
			let participant_elements: JSX.Element[] = [];

			for (let i: number = 0; i < this.room.size(); i++)
			{
				let participant: Participant = this.room.at(i);

				// COMBOBOX TO WHISPER
				whisper_target_options.push
				(
					<option value={participant.getID()}> {participant.getName()} </option>
				);

				// LIST OF PARTICIPANTS
				participant_elements.push
				(
					<li> {participant.getName()} ({participant.getID()}) </li>
				);
			}

			return <div>
				<div>
					<h2> User Information </h2>
					<ul>
						<li> ID: {this.id} </li>
						<li> NAME: {this.name} </li>
					</ul>

					<h2> Participants </h2>
					<ul>
						{participant_elements}
					</ul>
				</div>
				<div>
					<h2> Conversation </h2>
					<div id="messages_div">
					</div>
					<div>
						<select id="whisper_target_combo">
							<option value={""}> To All </option>
							{whisper_target_options}
						</select>
						<input id="message_input" type="text" width="400" />
						<button onClick={this.send_message.bind(this) }>Send</button>
					</div>
				</div>
			</div>;
		}

		protected refresh(): void
		{
			super.refresh();

			document.getElementById("messages_div").innerHTML = this.messages;
		}

		public static main(): void
		{
			let url_variables: library.URLVariables = new library.URLVariables(location.href);
			let uid: number = Number(url_variables.get("uid"));

			let application: ChatApplication = new ChatApplication(uid);
			ReactDOM.render(application.render(), document.body);
		}
	}
}
```

#### ChatRoom_entities.ts
``` typescript
/// <reference path="API.ts" />

namespace example.chat
{
	export class ChatRoomList extends protocol.EntityArray<ChatRoom>
	{
		public constructor()
		{
			super();
		}
		protected createChild(xml: library.XML): ChatRoom
		{
			return new ChatRoom();
		}

		public TAG(): string
		{
			return "roomList";
		}
		public CHILD_TAG(): string
		{
			return "room";
		}
	}

	export class ChatRoom extends protocol.EntityArray<Participant>
	{
		private uid: number = 0;
		private title: string = "";

		public constructor()
		{
			super();
		}
		protected createChild(xml: library.XML): Participant
		{
			return new Participant();
		}

		public key(): number
		{
			return this.uid;
		}
		public getUID(): number
		{
			return this.uid;
		}
		public getTitle(): string
		{
			return this.title;
		}

		public TAG(): string
		{
			return "room";
		}
		public CHILD_TAG(): string
		{
			return "participant";
		}
	}

	export class Participant extends protocol.Entity
	{
		private id: string = "";
		private name: string = "";

		public constructor()
		{
			super();
		}

		public key(): string
		{
			return this.id;
		}
		public getID(): string
		{
			return this.id;
		}
		public getName(): string
		{
			return this.name;
		}

		public TAG(): string
		{
			return "participant";
		}
	}
}
```