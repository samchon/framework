import std = require("typescript-stl");
import samchon = require("samchon-framework");

import collections = samchon.collections;
import library = samchon.library;
import protocol = samchon.protocol;

import server = require("./server");
import service = require("./service");

namespace room
{
	export class ChatRoomList 
		extends collections.HashMapCollection<number, ChatRoom>
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

			for (let it = this.begin(); !it.equals(this.end()); it = it.next())
				xml.push(it.second.toXML());

			return xml;
		}
	}

	export class ChatRoom 
		extends collections.HashMapCollection<string, service.ChatService>
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
		private handle_change(event: collections.MapCollectionEvent<string, service.ChatService>): void
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
			for (let it = this.begin(); !it.equals(this.end()); it = it.next())
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

			for (let it = this.begin(); !it.equals(this.end()); it = it.next())
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