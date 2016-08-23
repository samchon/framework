/// <reference path="API.ts" />

namespace example.chat
{
	export class ChatRoomList extends protocol.EntityArray<ChatRoom>
	{
		public constructor()
		{
			super();
		}
		public createChild(xml: library.XML): ChatRoom
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
		public createChild(xml: library.XML): Participant
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