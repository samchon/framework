/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import samchon = require("samchon-framework");
import scanf = require("scanf");

import room = require("./chat-room");

namespace example.chat
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class ChatApplication implements protocol.IProtocol
	{
		private communicator: protocol.WebServerConnector;
		private id: string;
		private name: string;

		private roomList: room.ChatRoomList;
		private joinedRoom: room.ChatRoom;

		/* ------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------ */
		public constructor(id: string, name: string)
		{
			this.roomList = new room.ChatRoomList();
			this.joinedRoom = null;

			this.communicator = new protocol.WebServerConnector(this);
			this.communicator.connect("127.0.0.1", 11723);
			this.communicator.onConnect = this.handle_connect.bind(this, id, name);
		}

		public static main(): void
		{
			console.log("Insert your ID and NAME:");

			let id: string = scanf("%S");
			let name: string = scanf("%S");

			let application: ChatApplication = new ChatApplication(id, name);
		}

		/* ============================================================
			INOVKE MESSAGE CHAIN
				- SEND_DATA
				- REPLY_DATA
		===============================================================
			SEND_DATA
		------------------------------------------------------------ */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator.sendData(invoke);
		}

		private handle_connect(id: string, name: string): void
		{
			// DO LOGIN
			let invoke: protocol.Invoke = new protocol.Invoke("login", id, name);
			this.sendData(invoke);
		}

		private join_room(uid: number): void
		{
			if (this.roomList.has(uid) == false)
			{
				console.log("unable to find matched room", uid);

				this.print_room_list();
				return;
			}
			else
			{
				let invoke: protocol.Invoke = new protocol.Invoke("changeService", "chat/" + uid);
				this.sendData(invoke);
			}
		}

		private send_message(message: string): void
		{
			let invoke: protocol.Invoke = new protocol.Invoke("talk", message);
			this.sendData(invoke);
		}

		/* ------------------------------------------------------------
			REPLY_DATA
		------------------------------------------------------------ */
		public replyData(invoke: protocol.Invoke): void
		{
			// FIND MATCHED FUNCTION IN THIS OBJECT.
			invoke.apply(this);
		}

		private handleLoginFailed(reason: string): void
		{
			console.log(reason);
			process.exit();
		}

		private setAccount(id: string, name: string): void
		{
			this.id = id;
			this.name = name;

			let invoke: protocol.Invoke = new protocol.Invoke("changeService", "list");
			this.sendData(invoke);

			// LIKE A SCANF
			// ROOM NUMBER OR SOMETING TO TALK
			process.stdin.on("data", this.handle_stdin.bind(this));
		}

		private setRoomList(xml: library.XML): void
		{
			this.roomList.construct(xml);

			this.print_room_list();
		}

		// MESSAGE ON LIST-SERVICE
		private setRoom(uid: number, xml: library.XML): void;
		
		// MESSAGE ON CHAT-SERVICE, IN A CHATTING ROOM
		private setRoom(xml: library.XML): void;

		private setRoom(...args: any[]): void
		{
			if (args.length == 2)
			{
				// ON LIST-SERVICE
				let uid: number = args[0];
				let xml: library.XML = args[1];

				let target_room: room.ChatRoom;
				if (this.roomList.has(uid) == false)
				{
					target_room = new room.ChatRoom();
					this.roomList.push_back(target_room);
				}
				else
					target_room = this.roomList.get(uid);

				target_room.construct(xml);
				this.print_room_list();
			}
			else
			{
				// ON CHAT-SERVICE
				let xml: library.XML = args[0];
				this.joinedRoom = new room.ChatRoom();
				this.joinedRoom.construct(xml);

				this.print_joined_room();
			}
		}

		private printTalk(from_id: string, message: string): void
		{
			let from: room.Participant = this.joinedRoom.get(from_id);

			console.log(library.StringUtil.substitute("{1} ({2}): {3}", 
				from.getName(), from.getID(), message));
		}

		private printWhisper(from_id: string, to_id: string, message: string): void
		{
			let from: room.Participant = this.joinedRoom.get(from_id);
			let to: room.Participant = this.joinedRoom.get(to_id);

			console.log(library.StringUtil.substitute("{1} -> {2}: {3}",
				from.getName(), to.getName(), message));
		}

		/* ------------------------------------------------------------
			HANDLERS
		------------------------------------------------------------ */
		private print_room_list(): void
		{
			if (this.joinedRoom != null)
				return;

			process.stdout.write("\x1B[2J\x1B[0f"); // CLEAR CONSOLE

			console.log(this.roomList.toString());
			console.log("Select room number to join: ");
		}

		private print_joined_room(): void
		{
			console.log("Room Information: " + this.joinedRoom.toString());
			console.log("------------------------------------------------");
		}

		private handle_stdin(input: Buffer): void
		{
			if (this.joinedRoom == null)
			{
				// ON LIST-SERVICE
				let uid: number = Number(input.toString());
				this.join_room(uid);
			}
			else
			{
				// ON CHAT-SERVICE
				let message: string = input.toString();
				this.send_message(message);
			}
		}
	}
}

example.chat.ChatApplication.main();