// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat
{
	export class ListApplication
		extends Application
	{
		private room_list: ChatRoomList;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(host: string)
		{
			super();

			this.host = host;
			this.room_list = new ChatRoomList();

			this.communicator = new protocol.WebServerConnector(this);
			this.communicator.connect(this.host, SERVER_PORT, "list");
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- REPLY DATA
		============================================================
			SEND DATA
		--------------------------------------------------------- */
		private create_room(event: React.MouseEvent): void
		{
			let name: string = (document.getElementById("create_room_input") as HTMLInputElement).value;

			this.sendData(new protocol.Invoke("createRoom", name));
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		private setRoomList(xml: library.XML): void
		{
			this.room_list.construct(xml);

			this.refresh();
		}

		private setRoom(uid: number, xml: library.XML): void
		{
			let room: ChatRoom;

			if (this.room_list.has(uid) == false)
				room = new ChatRoom();
			else
				room = this.room_list.get(uid);

			room.construct(xml);
			this.refresh();
		}

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public render(): JSX.Element
		{
			let room_elements: JSX.Element[] = [];

			for (let i: number = 0; i < this.room_list.size(); i++)
			{
				let room: ChatRoom = this.room_list.at(i);
				let link_address: string = "chat.html?host=" + this.host + "&uid=" + room.getUID();

				let participant_elements: JSX.Element[] = [];

				for (let j: number = 0; j < room.size(); j++)
				{
					let participant: Participant = room.at(j);

					participant_elements.push
					(
						<li> {participant.getID()}: {participant.getName()} </li>
					);
				}

				room_elements.push
				(
					<p><a href={link_address} target="_blank">
						<table>
							<tr>
								<td> No </td>
								<td> {room.getUID()} </td>
							</tr>
							<tr>
								<td> Title </td>
								<td> {room.getTitle()} </td>
							</tr>
							<tr>
								<td> Participants </td>
								<td>
									<ol>
										{participant_elements}
									</ol>
								</td>
							</tr>
						</table>
					</a></p>
				);
			}

			return <div>
				<h2> User Information </h2>
				<ul>
					<li> Account ID: {this.id} </li>
					<li> Name: {this.name} </li>
				</ul>
				<h2> List of Chatting Room </h2>
				{room_elements}

				<h2> Create Room </h2>
				<input id="create_room_input" type="text" />
				<button onClick={this.create_room.bind(this)}>Create</button>
			</div>;
		}

		public static main(): void
		{
			let url_variables: library.URLVariables = new library.URLVariables(location.href);
			if (url_variables.has("host") == false)
			{
				alert("You're not logged-in.");
				location.href = "login.html";

				return;
			}

			let host: string = url_variables.get("host");
			let application: ListApplication = new ListApplication(host);

			ReactDOM.render(application.render(), document.body);
		}
	}
}