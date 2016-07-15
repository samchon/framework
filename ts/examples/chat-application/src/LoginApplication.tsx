// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace example.chat
{
	export class LoginApplication 
		extends Application
	{
		/* ---------------------------------------------------------
			TRY LOGIN
		--------------------------------------------------------- */
		private handle_login_click(event: React.MouseEvent): void
		{
			// REMEMBER TEMPORARILY
			this.host = (document.getElementById("host_input") as HTMLInputElement).value;
			this.id = (document.getElementById("id_input") as HTMLInputElement).value;
			this.name = (document.getElementById("name_input") as HTMLInputElement).value;

			// CONNECT
			this.communicator = new protocol.WebServerConnector(this);
			this.communicator.onConnect = this.handle_connect.bind(this);
			this.communicator.connect(this.host, SERVER_PORT);
		}

		private handle_connect(): void
		{
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
		private login(): void
		{
			this.sendData(new protocol.Invoke("login", this.id, this.name));
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		protected setAccount(id: string, name: string): void
		{
			// GOT INFORMATION ABOUT ACCOUT -> LOGIN SUCCESS
			location.href = "list.html?host=" + encodeURIComponent(this.host);
		}
		private handleLoginFailed(message: string = "")
		{
			// LOGIN FAILED
			alert(message);
		}

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public render(): JSX.Element
		{
			return <table>
				<tbody>
					<tr>
						<td> Host </td>
						<td> <input id="host_input" type="input" defaultValue="127.0.0.1" /> </td>
						<td rowSpan="3">
							<button onClick={this.handle_login_click.bind(this)} 
									style={{height: 72}}>Log-in</button>
						</td>
					</tr>
					<tr>
						<td> ID </td>
						<td> <input id="id_input" type="input" defaultValue="samchon" /> </td>
					</tr>
					<tr>
						<td> Name </td>
						<td> <input id="name_input" type="input" defaultValue="Jeongho Nam" /> </td>
					</tr>
				</tbody>
			</table>;
		}

		public static main(): void
		{
			ReactDOM.render(<LoginApplication />, document.body);
		}
	}
}