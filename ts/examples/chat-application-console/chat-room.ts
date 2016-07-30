/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");

module room
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

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

		public toString(): string
		{
			let str: string = "";
			for (let i: number = 0; i < this.size(); i++)
				str += this.at(i).toString() + "\n";

			return str;
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

		public toString(): string
		{
			let str: string = library.StringUtil.substitute("{1}: {2}\n", this.uid, this.title);
			for (let i: number = 0; i < this.size(); i++)
				str += this.at(i).toString() + "\n";

			return str;
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

		public toString(): string
		{
			return library.StringUtil.substitute("\t{1}: {2}", this.id, this.name);
		}
	}
}

export = room;