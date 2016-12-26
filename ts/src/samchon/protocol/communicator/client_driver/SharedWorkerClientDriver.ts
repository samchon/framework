/// <reference path="../../../API.ts" />

/// <reference path="../communicator/SharedWorkerCommunicator.ts" />

namespace samchon.protocol
{
	/**
	 * Communicator with remote web-browser.
	 * 
	 * {@link SharedWorkerClientDriver} is a class taking full charge of network communication with web browsers. This 
	 * {@link SharedWorkerClientDriver} object is always created by {@link SharedWorkerServer} class. When you got this 
	 * {@link SharedWorkerClientDriver} object from {@link SharedWorkerServer.addClient SharedWorkerServer.addClient()}, 
	 * then specify {@link IProtocol listener} with the 
	 * {@link SharedWorkerClientDriver.listen SharedWorkerClientDriver.listen()} method.
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
	 * #### [Inherited] {@link IClientDriver}
	 * @copydoc IClientDriver
	 */
	export class SharedWorkerClientDriver 
		extends SharedWorkerCommunicator
		implements IClientDriver
    {
        /**
         * @hidden
         */
		private listening_: boolean;

        /* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/** 
		 * Construct from a MessagePort object.
		 */
		public constructor(port: MessagePort)
		{
			super();

			this.port_ = port;
			this.connected_ = true;
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

			this.port_.onmessage = this._Handle_message.bind(this);
		}
	}
}