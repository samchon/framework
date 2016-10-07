// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat {
	export class ChatApplication
		extends Application {
		private room: ChatRoom;
		private messages: string = "";

		public constructor(uid: number) {
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
		private send_message(event: React.MouseEvent<EventTarget>): void {

			let to: string = (document.getElementById("whisper") as HTMLButtonElement).innerText;
			console.log(to);
			// let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
			let message: string = (document.getElementById("message_input") as HTMLInputElement).value;

			if (!message) {
				console.log("not messages");
				// alert("메시지를 입력해주세요.");
				return;
			}

			if (to == "To All ")
				this.sendData(new protocol.Invoke("talk", message));
			else
				this.sendData(new protocol.Invoke("whisper", to, message));

			(document.getElementById("message_input") as HTMLInputElement).value = '';
		}

		private send_message2(event: React.KeyboardEvent<EventTarget>): void {
			if (event.charCode == 13) {

				let to: string = (document.getElementById("whisper") as HTMLButtonElement).innerText;
				console.log(to);
				// let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
				let message: string = (document.getElementById("message_input") as HTMLInputElement).value;

				if (!message) {
					console.log("not messages");
					return;
				}

				if (to == "To All ")
					this.sendData(new protocol.Invoke("talk", message));
				else
					this.sendData(new protocol.Invoke("whisper", to, message));

				(document.getElementById("message_input") as HTMLInputElement).value = '';
			}
		}

		private whisper_target_select(id, whisper_target_list): void {


			console.log(id);
			// console.log(whisper_target_list);
			console.log(whisper_target_list[id].props.children.props.children);
			let whisper_taget: string = whisper_target_list[id].props.children.props.children;

			// let to: string = (document.getElementById(whisper_taget) as HTMLLIElement).textContent;
			(document.getElementById("whisper") as HTMLButtonElement).textContent = whisper_taget + ' ';
			var span = document.createElement('span');
			span.setAttribute('class', 'caret');
			(document.getElementById("whisper") as HTMLButtonElement).appendChild(span);
		}

		private whisper_target_all(id): void {
			(document.getElementById("whisper") as HTMLButtonElement).textContent = 'To All ';
			var span = document.createElement('span');
			span.setAttribute('class', 'caret');
			(document.getElementById("whisper") as HTMLButtonElement).appendChild(span);
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		private setRoom(xml: library.XML): void {
			this.room.construct(xml);

			this.refresh();
		}

		private printTalk(senderID: string, message: string): void {
			let sender: Participant = this.room.get(senderID);



			this.messages += library.StringUtil.substitute
				(
					(senderID == this.id) ? "<ol><li class='me'><b>{1}<b>: {2} </li></ol><br>" : "<ol><li class='you'> <b>{1}</b>: {2} </li></ol><br>" ,
				sender.getName(),
				message
				);
			document.getElementById("messages_div").innerHTML = this.messages;
		}

		private printWhisper(from: string, to: string, message: string): void {
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
		public render(): JSX.Element {
			let whisper_target_options: JSX.Element[] = [];
			let participant_elements: JSX.Element[] = [];

			let whisper_target_list: JSX.Element[] = [];

			for (let i: number = 0; i < this.room.size(); i++) {
				let participant: Participant = this.room.at(i);

				// COMBOBOX TO WHISPER
				whisper_target_options.push
					(
					<option value={participant.getID() }> {participant.getName() } </option>
					);

				// LIST OF PARTICIPANTS
				participant_elements.push
					(
					<li> {participant.getName() } ({participant.getID() }) </li>
					);

				whisper_target_list.push
					(
					<li key={i}><a onClick={this.whisper_target_select.bind(this, i, whisper_target_list) } href="#" id={participant.getID() }>{participant.getName() }</a></li>
					)
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
								<a href="list.html">Dashboard</a>
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

							<div className="participant">
								<h2> Participant List </h2>
								<ul>
									{participant_elements}
								</ul>
							</div>

							<div className="conversation">
								<h2> Conversation </h2>
								<div className="chat-canvas">
									<div id="messages_div">
									</div>
								</div>
							</div>

							<br/>

							<div className="row input-message">
								<div className="col-lg-6">
									<div className="input-group">
										<div className="input-group-btn">
											<button id="whisper" type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">To All <span className="caret"></span></button>
											<ul className="dropdown-menu" id="demolist" role="menu">
												<li><a onClick={this.whisper_target_all.bind(this) } href="#" id="To All">To All</a></li>
												{whisper_target_list}
											</ul>
										</div>
										<input type="text" className="form-control" id="message_input" onKeyPress={this.send_message2.bind(this) } placeholder="Type your message."/>
										<div className="input-group-btn">
											<button type="button" className="btn btn-default" onClick={this.send_message.bind(this) }>Send</button>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>

				</div>
			</div>;

			// 			return <div>

			// 				<div className="participant">
			// 					<h2> Participant List </h2>
			// 					<ul>
			// 						{participant_elements}
			// 					</ul>
			// 				</div>

			// 				<div className="conversation">
			// 					<h2> Conversation </h2>
			// 					<div className="chat-canvas">
			// 						<div id="messages_div">
			// 						</div>
			// 					</div>
			// 				</div>
			// 				<div className="chat-input2">
			// 					<select id="whisper_target_combo">
			// 						<option value={""}> To All </option>
			// 						{whisper_target_options}
			// 					</select>
			// 					<input id="message_input" type="text" width="400" onKeyPress={this.send_message2.bind(this) }/>
			// 					<button onClick={this.send_message.bind(this) } >Send</button>
			// 				</div>

			// <br/>
			// 				<div className="row">
			// 					<div className="col-lg-6">
			// 						<div className="input-group">
			// 							<div className="input-group-btn">
			// 								<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">To All <span className="caret"></span></button>
			// 								<ul className="dropdown-menu" id="whisper_target_combo2" role="menu">
			// 									<li><a href="#">Action</a></li>
			// 									<li><a href="#">Another action</a></li>
			// 									<li><a href="#">Something else here</a></li>
			// 									<li><a href="#">Separated link</a></li>
			// 								</ul>
			// 							</div>
			// 							<input type="text" className="form-control" id="message_input" onKeyPress={this.send_message2.bind(this) } placeholder="Type your message."/>
			// 							<div className="input-group-btn">
			// 								<button type="button" className="btn btn-default" onClick={this.send_message.bind(this) }>Send</button>							
			// 							</div>
			// 						</div>
			// 					</div>
			// 				</div>

			// 			</div>;
		}

		protected refresh(): void {
			super.refresh();

			document.getElementById("messages_div").innerHTML = this.messages;
		}

		public static main(): void {
			let url_variables: library.URLVariables = new library.URLVariables(location.href);
			let uid: number = Number(url_variables.get("uid"));

			let application: ChatApplication = new ChatApplication(uid);
			ReactDOM.render(application.render(), document.body);
		}
	}
}