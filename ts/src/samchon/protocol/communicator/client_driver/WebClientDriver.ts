/// <reference path="../../../API.ts" />

/// <reference path="../communicator/WebCommunicator.ts" />

namespace samchon.protocol
{
	/**
	 * Communicator with remote web-client.
	 * 
	 * {@link WebClientDriver} is a class taking full charge of network communication with remote client who follows 
	 * Web-socket protocol. This {@link WebClientDriver} object is always created by {@link WebServer} class. When you 
	 * got this {@link WebClientDriver} object from the {@link WebServer.addClient WebServer.addClient()}, then specify
	 * {@link IProtocol listener} with the {@link WebClientDriver.listen WebClientDriver.listen()} method.
	 * 
	 * Unlike other protocol, Web-socket protocol's clients notify two parameters on their connection; 
	 * {@link getSessionID session-id} and {@link getPath path}. The {@link getSessionID session-id} can be used to 
	 * identify *user* of each client, and the {@link getPath path} can be used which type of *service* that client wants.
	 * In {@link service} module, you can see the best utilization case of them.
	 * - {@link service.User}: utlization of the {@link getSessionID session-id}.
	 * - {@link service.Service}: utilization of the {@link getPath path}.
	 * 
	 * #### [Inherited] {@link IClientDriver}
	 * @copydoc IClientDriver
	 */
	export class WebClientDriver
		extends WebCommunicator
		implements IClientDriver
	{
		/**
		 * @hidden
		 */
		private path_: string;

		/**
		 * @hidden
		 */
		private session_id_: string;

		/**
		 * @hidden
		 */
		private listening_: boolean;

        /* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Initialization Constructor.
		 * 
		 * @param connection Connection driver, a socket for web-socket.
		 * @param path Requested path.
		 * @param session_id Session ID, an identifier of the remote client.
		 */
		public constructor(connection: websocket.connection, path: string, session_id: string)
		{
			super();

			this.connection_ = connection;
			this.path_ = path;
			this.session_id_ = session_id;

			this.listening_ = false;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;

			if (this.listening_ == true)
				return;
			this.listening_ = true;

			this.connection_.on("message", this._Handle_message.bind(this));
			this.connection_.on("close", this._Handle_close.bind(this));
			this.connection_.on("error", this._Handle_close.bind(this));
		}

        /* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get requested path.
		 */
		public getPath(): string
		{
			return this.path_;
		}

		/**
		 * Get session ID, an identifier of the remote client.
		 */
		public getSessionID(): string
		{
			return this.session_id_;
		}
	}
}