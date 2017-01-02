/// <reference path="../../API.ts" />

namespace samchon.protocol
{
	/**
	 * @hidden
	 */
	declare var http: typeof NodeJS.http;
	
	/**
	 * @hidden
	 */
	declare var websocket: typeof __websocket;

	/**
	 * A web server.
	 *
	 * The {@link WebServer} is an abstract class designed to open a server and accept clients who are following 
	 * web-socket protocol. Extends this {@link WebServer} class and overrides {@link addClient addClient()} method to
	 * define what to do with newly connected {@link WebClientDriver remote clients}.
	 * 
	 * #### [Inherited] {@link IServer}
	 * @copydoc IServer
	 */
	export abstract class WebServer implements IServer
	{
		/**
		 * @hidden
		 */
		private http_server_: socket.http_server;
		
		/**
		 * @hidden
		 */
		private sequence_: number; // Sequence number for issuing session id.

		/**
		 * @hidden
		 */
		private my_port_: number;

        /* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			this.sequence_ = 0;
        }

        /**
		 * @inheritdoc
		 */
        public abstract addClient(driver: WebClientDriver): void;

        /* -------------------------------------------------------------------
			PROCEDURES
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.my_port_ = port;

			this.http_server_ = http.createServer();
			this.http_server_.listen(port);

			let ws_server = new websocket.server({ httpServer: this.http_server_ });
			ws_server.on("request", this._Handle_request.bind(this));
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			this.http_server_.close();
		}
		
		/**
		 * @hidden
		 */
		private _Handle_request(request: websocket.request): void
		{
			//--------
			// Handle request from a client system.
			// 
			// This method "handle_request()" will be called when a client is connected. It will call an abstract method 
			// "addClient()" who handles an accepted client. If the newly connected client doesn't have its own session 
			// id, then a new session id will be issued.
			// 
			// @param request Requested header.
			//--------
			let path: string = request.resource;
            let session_id: string = this._Fetch_session_id(request.cookies);

			let connection = request.accept
			(
				"", request.origin,
				[{ name: "SESSION_ID", value: session_id }]
			);

			let driver = new WebClientDriver(connection, path, session_id);
			this.addClient(driver);
		}

		/**
		 * @hidden
		 */
		private _Fetch_session_id(cookies: websocket.ICookie[]): string
		{
			//--------
			// Fetch session id from a newly connected.
			// 
			// Queries ordinary session id from cookies of a newly connected client. If the client has not, a new session 
			// id will be issued.
			// 
			// @param cookies Cookies from the remote client.
			// @return Session id
			//--------
			for (let i: number = 0; i < cookies.length; i++)
				if (cookies[i].name == "SESSION_ID")
					return cookies[i].value;

			return this._Issue_session_id();
		}

		/**
		 * @hidden
		 */
		private _Issue_session_id(): string
		{
			// Issue a new session id.
			let port: number = this.my_port_;
			let uid: number = ++this.sequence_;
			let linux_time: number = new Date().getTime();
			let rand: number = Math.floor(Math.random() * 0xffffffff);

			return port.toString(16) + uid.toString(16) + linux_time.toString(16) + rand.toString(16);
		}
	}
}