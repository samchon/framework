// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat {
	export class LoginApplication
		extends Application {
		/* ---------------------------------------------------------
			TRY LOGIN
		--------------------------------------------------------- */
		private handle_login_click(event: React.MouseEvent<EventTarget>): void {

			// REMEMBER TEMPORARILY
			this.id = (document.getElementById("id") as HTMLInputElement).value;
			this.name = (document.getElementById("name") as HTMLInputElement).value;

			if(!this.id || !this.name)
			{
				alert("ID 또는 NAME을 정확히 입력해주세요.");
				return;
			}

			// CONNECT
			this.communicator = new protocol.WebServerConnector(this);
			this.communicator.onConnect = this.handle_connect.bind(this);
			this.communicator.connect(SERVER_HOST, SERVER_PORT);
		}
			
		private handle_login_click2(event: React.KeyboardEvent<EventTarget>): void {
			if (event.charCode == 13) {
				// REMEMBER TEMPORARILY
				this.id = (document.getElementById("id") as HTMLInputElement).value;
				this.name = (document.getElementById("name") as HTMLInputElement).value;

				if(!this.id || !this.name)
				{
					alert("ID 또는 NAME을 정확히 입력해주세요.");
					return;
				}

				// CONNECT
				this.communicator = new protocol.WebServerConnector(this);
				this.communicator.onConnect = this.handle_connect.bind(this);
				this.communicator.connect(SERVER_HOST, SERVER_PORT);
			}
		}

		private handle_connect(): void {
			// AFTER CONNECTION, DO LOGIN IMMEDIATELY
			this.login();
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- REPLY DATA
		============================================================
			SEND DATA
		--------------------------------------------------------- */
		// DO LOGIN
		private login(): void {
			this.sendData(new protocol.Invoke("login", this.id, this.name));
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		protected setAccount(id: string, name: string): void {
			// GOT INFORMATION ABOUT ACCOUT -> LOGIN SUCCESS
			location.href = "list.html";
		}
		private handleLoginFailed(message: string = "") {
			// LOGIN FAILED
			alert(message);
		}

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public render(): JSX.Element {

			return <div className="login-box">
				<div className="lb-header">
					<a href="#" className="active" id="login-box-link">Samchon Talk</a>
				</div>

				<div className="email-login">
					<div className="u-form-group">
						<input type="text" id="id" name="id" placeholder="ID"onKeyPress={this.handle_login_click2.bind(this)}/>
					</div>
					<div className="u-form-group">
						<input type="text" id="name" name="name" placeholder="NAME" onKeyPress={this.handle_login_click2.bind(this)}/>
					</div>
					<div className="u-form-group">
						<button id="quickstart-sign-in" onClick={this.handle_login_click.bind(this)}>Log In</button>
					</div>
					<div className="u-form-group">
						<a href="#" className="forgot-password">Forgot password?</a>
					</div>
				</div>

				<div className="social-login">
					<a href="#">
						<i className="fa fa-facebook fa-lg"></i>
						login with facebook
					</a>
					<a href="#">
						<i className="fa fa-google-plus fa-lg"></i>
						login with Google
					</a>
				</div>

			</div>

			// return <table>
			// 	<tbody>
			// 		<tr>
			// 			<td> ID </td>
			// 			<td> <input id="id_input" type="input" defaultValue="samchon" /> </td>
			// 			<td rowSpan="2">
			// 				<button onClick={this.handle_login_click.bind(this) }
			// 					style={{ height: 50 }}>Log-in</button>
			// 			</td>
			// 		</tr>
			// 		<tr>
			// 			<td> Name </td>
			// 			<td> <input id="name_input" type="input" defaultValue="Samchon" /> </td>
			// 		</tr>
			// 	</tbody>
			// </table>;
		}

		public static main(): void {
			ReactDOM.render(<LoginApplication />, document.body);
		}
	}
}