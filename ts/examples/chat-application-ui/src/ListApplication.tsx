// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat {
	export class ListApplication
		extends Application {
		private room_list: ChatRoomList;

		private room_name_tabs: JSX.Element[] = [];  /* 채팅방 탭 제목 배열 */
		private room_tabs: JSX.Element[] = [];       /* 채팅방 탭 내용 배열 */

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor() {
			super();

			this.room_list = new ChatRoomList();

			this.communicator = new protocol.WebServerConnector(this);
			this.communicator.connect(SERVER_HOST, SERVER_PORT, "list");
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- REPLY DATA
		============================================================
			SEND DATA
		--------------------------------------------------------- */
		private create_room(event: React.MouseEvent): void {
			let name: string = (document.getElementById("create_room_input") as HTMLInputElement).value;

			this.sendData(new protocol.Invoke("createRoom", name));
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		private setRoomList(xml: library.XML): void {
			this.room_list.construct(xml);

			this.refresh();
		}

		private setRoom(uid: number, xml: library.XML): void {
			let room: ChatRoom;

			if (this.room_list.has(uid) == false) {
				room = new ChatRoom();
				this.room_list.push_back(room);
			}
			else
				room = this.room_list.get(uid);

			room.construct(xml);
			this.refresh();
		}

		/*----------------------------------------------------
			채팅방 탭 추가
		----------------------------------------------------*/
		private enter_chat_room(uid: number, title: string) {

			let chatRoomUrl: string = "chat.html?&uid=" + uid;

			let room_name_link: string = "#" + uid;

			this.room_name_tabs.push(
				<li><a data-toggle="tab" href={room_name_link}>{title}</a></li>
			)

			this.room_tabs.push(
				<div id={uid} className="tab-pane fade">
					<iframe src={chatRoomUrl} height="100%" width="100%" />
				</div>
			)

			this.refresh();
		}

	/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public render(): JSX.Element {
			let room_elements: JSX.Element[] = [];

			for (let i: number = 0; i < this.room_list.size(); i++) {
				let room: ChatRoom = this.room_list.at(i);
				let link_address: string = "chat.html?&uid=" + room.getUID();

				let participant_elements: JSX.Element[] = [];

				for (let j: number = 0; j < room.size(); j++) {
					let participant: Participant = room.at(j);

					participant_elements.push
						(
						<li> {participant.getID() }: {participant.getName() } </li>
						);
				}

				room_elements.push
					(
					<p>
						<table>
							<tr>
								<td> No </td>
								<td> {room.getUID() } </td>
							</tr>
							<tr>
								<td> Title </td>
								<td> {room.getTitle() } </td>
							</tr>
							<tr>
								<td> Participants </td>
								<td>
									<ol>
										{participant_elements}
									</ol>
								</td>
							</tr>
							<tr>
								<td>
									<button onClick={() => this.enter_chat_room(room.getUID(), room.getTitle()) }>참여</button>
								</td>
							</tr>
						</table>
					</p>
					);
			}

			return <div className="container">

				<div class="row">
					<div className="col-sm-3 col-md-2 sidebar">
						<div className="talk-title">
							<h1>✿ 삼촌톡 ✿</h1>
						</div>

						<div className="create-room">
							<h2> Create Room </h2>
							<input id="create_room_input" type="text" />
							<button onClick={this.create_room.bind(this) }>Create</button>
						</div>

						<div className="chat-room-list">
							<h2> List of Chatting Room </h2>
							{room_elements}
						</div>

						<div className="user-info">
							<h2> User Information </h2>
							<ul>
								<li> Account ID: {this.id} </li>
								<li> Name: {this.name} </li>
							</ul>
						</div>
					</div>
					<div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

						<div className="container">
							<ul className="nav nav-tabs">
								<li className="active"><a data-toggle="tab" href="#home">Home</a></li>
								{this.room_name_tabs}
							</ul>
							<div className="tab-content">
								<div id="home" className="tab-pane fade in active">
									<img src="https://avatars2.githubusercontent.com/u/13158709?v=3&s=300"></img>
									<h2>삼촌톡에 오신걸 환영합니다.</h2>
									<p><h3>왼쪽 메뉴에서 채팅방을 만든 후 '참여' 버튼을 눌러 채팅을 즐기세요!</h3></p>
								</div>
								{this.room_tabs}
							</div>
						</div>
					</div>
				</div>
			</div>
				;
		}

		public static main(): void {
			ReactDOM.render(<ListApplication />, document.body);
		}
	}
}