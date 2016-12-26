/// <reference path="../../API.ts" />

namespace samchon.protocol
{
	/**
	 * A SharedWorker server.
	 *
	 * The {@link SharedWorker} is an abstract class is realized to open a SharedWorker server and accept web-browser 
	 * clients. Extends this {@link SharedWorkerServer} class and overrides {@link addClient addClient()} method to 
	 * define what to do with newly connected {@link SharedWorkerClientDriver remote clients}.
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
	 * #### [Inherited] {@link IServer}
	 * @copydoc IServer
	 */
	export abstract class SharedWorkerServer implements IServer
    {
        /* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
        // public constructor = default;

		/**
		 * @inheritdoc
		 */
		public abstract addClient(driver: SharedWorkerClientDriver): void;

        /* -------------------------------------------------------------------
			PROCEDURES
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(): void
		{
			self.addEventListener("connect", this._Handle_connect.bind(this));
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			// MAY IMPOSSIBLE
			close();
		}

		/**
		 * @hidden
		 */
		private _Handle_connect(event: {ports: MessagePort[]}): void
		{
			let port: MessagePort = event.ports[event.ports.length - 1];
			let driver: SharedWorkerClientDriver = new SharedWorkerClientDriver(port);

			this.addClient(driver);
		}
	}
}