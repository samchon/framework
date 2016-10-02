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
				<div id={String(uid)} className="tab-pane fade">
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

			let imageList: string[] = [
				'https://thumbs.dreamstime.com/x/european-city-illustration-37366790.jpg',
				'http://www.icanbecreative.com/res/2014/12/night-city-illustrations.jpg',
				'https://thumbs.dreamstime.com/t/shopping-city-retro-colors-vector-illustration-center-33767869.jpg',
				'https://s-media-cache-ak0.pinimg.com/originals/5b/35/32/5b35323ed68751c62a328f6e80389159.jpg'
			];



			for (let i: number = 0; i < this.room_list.size(); i++) {
				let room: ChatRoom = this.room_list.at(i);
				let link_address: string = "chat.html?&uid=" + room.getUID();

				let participant_elements: JSX.Element[] = [];

				let imageRandom:number = Math.floor(Math.random()*(3-0+1));


				for (let j: number = 0; j < room.size(); j++) {
					let participant: Participant = room.at(j);

					participant_elements.push
						(
						<li> {participant.getID() }: {participant.getName() } </li>
						);
				}

				room_elements.push
					(

					// <div className="panel panel-default chat-room-item col-sm-4 col-md-3">
					// 	<div className="panel-heading">
					// 		<h3 className="panel-title">No.{room.getUID() }</h3>
					// 		<h3>{room.getTitle() }</h3>
					// 	</div>
					// 	<div className="pane-body">
					// 		<p>{participant_elements}</p>
					// 		<a href={link_address} target="_blank" className="btn btn-primary">참여</a>
					// 	</div>
					// </div>

					<div className="col-sm-6 col-md-4">
					<div className="card-room-container">
						<div className="thumbnail card-room">
							<img src={imageList[(room.getUID()-1)%4]} alt="..."></img>
							<div className="caption">
								<h3>{room.getTitle()}</h3>
								<p>{participant_elements}</p>
								<p><a href={link_address} target="_blank" className="btn btn-default">참여</a></p>
							</div>
						</div>
						</div>
					</div>

					);
			}

			return <div>

				<div id="wrapper">

					<div id="sidebar-wrapper">
						<ul className="sidebar-nav">
							<li className="sidebar-brand">
								<div className="talk-title">
									<h2> SamchonTalk </h2>
								</div>
							</li>
							<br/><br/>

							<li>
								<a href="#">Dashboard</a>
							</li>
							<li>
								<a href="video.html">Video</a>
							</li>
							<li>
								<a href="overview.html">Overview</a>
							</li>
							<li>
								<a href="aboutus.html">About</a>
							</li>
							<li>
								<a href="services.html">Services</a>
							</li>
							<li>
								<a href="contact.html">Contact</a>
							</li>
						</ul>

						<div className="user-info">
							<h3> INFORMATION </h3>
							<h5>Account ID: {this.id}</h5>
							<h5>Name: {this.name}</h5>
						</div>
					</div>

					<div id="page-content-wrapper">
						<div className="container-fluid">

							<div>
								<div className="create-room input-group">
									<h2> Create Room </h2>
									<div className="input-group">
										<input id="create_room_input" type="text" className="form-control" />
										<span className="input-group-btn">
											<button className="btn btn-default" type="button" onClick={this.create_room.bind(this) }>Create</button>
										</span>
									</div>
								</div>
							</div>
							<br/><br/>
							<hr/>
							<br/>
							<div>
								<h2> Room List</h2><br/>
								{room_elements}
							</div>
						</div>
					</div>

				</div>

			</div>;

			// return <div>

			// 	<div class="row">
			// 		<div className="col-sm-3 col-md-2 sidebar">
			// 			<div className="talk-title">
			// 				<h1>✿ 삼촌톡 ✿</h1>
			// 			</div>

			// 			<div className="create-room">
			// 				<h2> Create Room </h2>
			// 				<input id="create_room_input" type="text" />
			// 				<button onClick={this.create_room.bind(this) }>Create</button>
			// 			</div>

			// 			<div className="chat-room-list">
			// 				<h2> List of Chatting Room </h2>
			// 				{room_elements}
			// 			</div>

			// 			<div className="user-info">
			// 				<h2> User Information </h2>
			// 				<ul>
			// 					<li> Account ID: {this.id} </li>
			// 					<li> Name: {this.name} </li>
			// 				</ul>
			// 			</div>
			// 		</div>

			// 		<div className="main">
			// 			<div>
			// 				<ul className="nav nav-tabs">
			// 					<li className="active"><a data-toggle="tab" href="#home">Home</a></li>
			// 					{this.room_name_tabs}
			// 				</ul>
			// 				<div className="tab-content chat-area">
			// 					<div id="home" className="tab-pane fade in active">
			// 						<span className="glyphicon glyphicon-envelope test">
			// 						<h2>WELCOME TO SAMPLE CHAT</h2>
			// 						<p><h3>왼쪽 메뉴에서 채팅방을 만든 후 '참여' 버튼을 눌러 채팅을 즐기세요!</h3></p>
			// 						</span>
			// 					</div>
			// 					{this.room_tabs}
			// 				</div>
			// 			</div>
			// 		</div>

			// 	</div>
			// </div>
			// 	;
		}

		public static main(): void {
			ReactDOM.render(<ListApplication />, document.body);
		}
	}
}