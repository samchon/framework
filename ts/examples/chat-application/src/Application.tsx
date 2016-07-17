// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

namespace example.chat
{
	export abstract class Application
		extends React.Component<{}, {}>
		implements protocol.IProtocol
	{
		protected id: string;
		protected name: string;

		protected communicator: protocol.WebServerConnector;

		public constructor()
		{
			super();
		}

		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- REPLY DATA
		============================================================
			SEND DATA
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator.sendData(invoke);
		}

		/* ---------------------------------------------------------
			REPLY DATA
		--------------------------------------------------------- */
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		protected setAccount(id: string, name: string): void
		{
			this.id = id;
			this.name = name;

			this.refresh();
		}

		private alert(message: string): void
		{
			alert(message);
		}

		/* ---------------------------------------------------------
			VISUALIZER
		--------------------------------------------------------- */
		public abstract render(): JSX.Element;

		protected refresh(): void
		{
			ReactDOM.render(this.render(), document.body);
		}
	}
}