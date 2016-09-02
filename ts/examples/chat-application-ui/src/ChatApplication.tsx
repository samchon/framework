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
		private send_message(event: React.MouseEvent): void {
			let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
			let message: string = (document.getElementById("message_input") as HTMLInputElement).value;

			if (!message) {
				console.log("not messages");
				// alert("메시지를 입력해주세요.");
				return;
			}

			if (to == "")
				this.sendData(new protocol.Invoke("talk", message));
			else
				this.sendData(new protocol.Invoke("whisper", to, message));

			(document.getElementById("message_input") as HTMLInputElement).value = '';
		}

		private send_message2(event: React.KeyboardEvent): void {
			if (event.charCode == 13) {
				let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
				let message: string = (document.getElementById("message_input") as HTMLInputElement).value;

				if (!message) {
					console.log("not messages");
					return;
				}

				if (to == "")
					this.sendData(new protocol.Invoke("talk", message));
				else
					this.sendData(new protocol.Invoke("whisper", to, message));

				(document.getElementById("message_input") as HTMLInputElement).value = '';
			}
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
				"<p> <b>{1}</b>: {2} </p>",
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
			}

			return <div>
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
				<div className="chat-input2">
					<select id="whisper_target_combo">
						<option value={""}> To All </option>
						{whisper_target_options}
					</select>
					<input id="message_input" type="text" width="400" onKeyPress={this.send_message2.bind(this) }/>
					<button onClick={this.send_message.bind(this) } >Send</button>
				</div>

<div className="row">
  <div className="col-lg-6">
    <div className="input-group">
      <div className="input-group-btn">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span className="caret"></span></button>
        <ul className="dropdown-menu" role="menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li className="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
      <input type="text" className="form-control" aria-label="..." />
    </div>
  </div>
  <div className="col-lg-6">
    <div className="input-group">
      <input type="text" className="form-control" aria-label="..." />
      <div className="input-group-btn">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span className="caret"></span></button>
        <ul className="dropdown-menu dropdown-menu-right" role="menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li className="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
			</div>;
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