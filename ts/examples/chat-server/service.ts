import std = require("typescript-stl");
import samchon = require("samchon-framework");

import collections = samchon.collections;
import library = samchon.library;
import protocol = samchon.protocol;
import templates = samchon.templates;

import server = require("./server");
import room = require("./room");

namespace service
{
	export class ListService extends templates.service.Service
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
		private handle_room_change(event: collections.MapCollectionEvent<number, room.ChatRoom>): void
		{
			// SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
			this.send_rooms();
		}

		private handle_participant_change(event: collections.MapCollectionEvent<number, room.ChatRoom>): void
		{
			let room: room.ChatRoom = event.first.second;

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
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}
		
		private createRoom(name: string): void
		{
			let rooms: room.ChatRoomList = this.getClient().getUser().getServer().getRooms();

			rooms.createRoom(name);
		}
	}

	export class ChatService extends templates.service.Service
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
			
			invoke.apply(this);
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