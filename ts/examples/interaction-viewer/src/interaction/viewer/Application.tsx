// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="API.ts" />

namespace interaction.viewer
{
	export class Application extends React.Component<{}, {}> implements protocol.IProtocol
	{
		private system_tree_: SystemTree;
		private message_array_: std.Deque<Message>;

		private connector_: protocol.WebServerConnector;

		/* ---------------------------------------------------------
			CONSTRUCTOR
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.system_tree_ = new SystemTree();
			this.message_array_ = new std.Deque<Message>();

			this.connector_ = new protocol.WebServerConnector(this);
			this.connector_.connect("127.0.0.1", 37950);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public get systemTreeViewer(): SystemTreeViewer
		{
			return this.refs["systemTreeViewer"] as SystemTreeViewer;
		}
		public get messageArrayViewer(): MessageArrayViewer
		{
			return this.refs["messageArrayViewer"] as MessageArrayViewer;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE HANDLERS
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			this.connector_.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		private setSystems(xml: library.XML): void
		{
			// CONSTRUCT SYSTEM_TREE
			this.system_tree_.construct(xml);
			
			// PRINT ON SCREEN
			this.systemTreeViewer.setState({});
		}
		private printSendData(from: number, to: number, listener: string): void
		{
			// CREATE MESSAGE
			let message: Message = new Message(this.system_tree_, from, to, listener);
			this.message_array_.push_back(message);
			
			// PRINT ON SCREEN
			this.systemTreeViewer.printMessage(message);
			this.messageArrayViewer.setState({}); // REFRESH
		}

		/* ---------------------------------------------------------
			RENDERER
		--------------------------------------------------------- */
		public render(): JSX.Element
		{
			return <div id="main_div" width="100%" height="100%">
				<MessageArrayViewer ref="messageArrayViewer"
					application={this}
					messageArray={this.message_array_} 
					style={{ width: 450, height: "100%", 
						position: "absolute", left: 15, top: 15 }} />
				<SystemTreeViewer ref="systemTreeViewer"
					application={this}
					systemTree={this.system_tree_}
					style={{ position: "absolute", left: 500, top: 15 }} />
			</div>;
		}

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			ReactDOM.render(<Application />, document.body);
		}
	}
}