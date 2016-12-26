/// <reference path="../../../API.ts" />

/// <reference path="../communicator/SharedWorkerCommunicator.ts" />

namespace samchon.protocol
{
	/**
	 * A server connector for SharedWorker.
	 *
	 * {@link SharedWorkerServerConnector} is a class connecting to SharedWorker and taking full charge of network 
	 * communication with the SharedWorker. Create an {@link SharedWorkerServerConnector} instance from the
	 * {@IProtocol listener} and call the {@link connect connect()} method.
	 * 
	 * #### Why SharedWorker be a server?
	 * SharedWorker, it allows only an instance (process) to be created whether the SharedWorker is declared in a browser
	 * or multiple browsers. To integrate them, messages are being sent and received. Doesn't it seem like a relationship
	 * between a server and clients? Thus, Samchon Framework consider the SharedWorker as a server and browsers as
	 * clients.
	 *
	 * The class {@link SharedWorkerCommunicator} is designed make such relationship. From now on, SharedWorker is a
	 * {@link SharedWorkerServer server} and {@link SharedWorkerServerConnector browsers} are clients. Integrate the
	 * server and clients with this {@link SharedWorkerCommunicator}.
	 * 
	 * #### [Inherited] {@link IServerConnector}
	 * @copydoc IServerConnector
	 */
	export class SharedWorkerServerConnector
		extends SharedWorkerCommunicator
		implements IServerConnector
	{
		/**
		 * @inheritdoc
		 */
		public onConnect: Function;

		/* ---------------------------------------------------------
			CONSTRUCTORS AND CONNECTORS
		--------------------------------------------------------- */
		/**
		 * Construct from *listener*.
		 * 
		 * @param listener A listener object to listen replied message from newly connected client in
		 *				   {@link IProtocol.replyData replyData()} as an {@link Invoke} object.
		 */
		public constructor(listener: IProtocol)
		{
			super(listener);

			this.connected_ = false;
			this.onConnect = null;
		}
		
		/**
		 * Connect to a SharedWorker.
		 * 
		 * Connects to a server with specified *jstFile* path. If a SharedWorker instance of the *jsFile* is not 
		 * constructed yet, then the SharedWorker will be newly constructed. Otherwise the SharedWorker already exists,
		 * then connect to the SharedWorker. After those processes, callback function {@link onConnect} is called. 
		 * Listening data from the connected server also begins. Replied messages from the connected server will be 
		 * converted to {@link Invoke} classes and will be shifted to the {@link WebCommunicator.listener listener}'s 
		 * {@link IProtocol.replyData replyData()} method.
		 * 
		 * If the connection fails immediately, either an event is dispatched or an exception is thrown: an error 
		 * event is dispatched if a host was specified, and an exception is thrown if no host was specified. Otherwise, 
		 * the status of the connection is reported by an event. If the socket is already connected, the existing 
		 * connection is closed first.
		 * 
		 * @param jsFile Path of JavaScript file to execute who defines SharedWorker.
		 */
		public connect(jsFile: string): void
		{
			// CONSTRUCT AND START SHARED-WORKER-SERVER
			let worker: SharedWorker = new SharedWorker(jsFile);
			
			// LISTEN MESSAGE
			this.port_ = worker.port;
			this.port_.onmessage = this._Handle_message.bind(this);

			// NOTIFY THE CONNECTION
			this.connected_ = true;
			if (this.onConnect != null)
				this.onConnect();
		}
	}
}