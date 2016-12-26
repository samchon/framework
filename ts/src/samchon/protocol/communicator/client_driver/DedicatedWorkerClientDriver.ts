/// <reference path="../../../API.ts" />

/// <reference path="../communicator/DedicatedWorkerCommunicator.ts" />

namespace samchon.protocol
{
	/**
	 * Communicator with master web-browser.
	 * 
	 * {@link DedicatedWorkerClientDriver} is a class taking full charge of network communication with web browsers. This 
	 * {@link DedicatedWorkerClientDriver} object is always created by {@link DedicatedWorkerServer} class. When you got 
	 * this {@link DedicatedWorkerClientDriver} object from 
	 * {@link DedicatedWorkerServer.addClient DedicatedWorkerServer.addClient()}, then specify {@link IProtocol listener} 
	 * with the {@link DedicatedWorkerClientDriver.listen DedicatedWorkerClientDriver.listen()} method.
	 * 
	 * #### Why DedicatedWorker be a server?
	 * In JavaScript environment, there's no way to implement multi-threading function. Instead, JavaScript supports the
	 * **Worker**, creating a new process. However, the **Worker** does not shares memory addresses. To integrate the
	 * **Worker** with its master, only communication with string or binary data is allowed. Doesn't it seem like a network
	 * communication? Furthermore, there's not any difference between the worker communication and network communication.
	 * It's the reason why Samchon Framework considers the **Worker** as a network node.
	 *
	 * The class {@link DedicatedWorkerCommunicator} is designed make such relationship. From now on, DedicatedWorker is a
	 * {@link DedicatedWorkerServer server} and {@link DedicatedWorkerServerConnector browser} is a client. Integrate the
	 * server and clients with this {@link DedicatedWorkerCommunicator}.
	 * 
	 * #### [Inherited] {@link IClientDriver}
	 * @copydoc IClientDriver
	 */
	export class DedicatedWorkerClientDriver
		extends DedicatedWorkerCommunicator
		implements IClientDriver
    {
        /* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();

			onmessage = this._Handle_message.bind(this);
			this.connected_ = true;
		}

		/**
		 * @inheritdoc
		 */
		public listen(listener: IProtocol): void
		{
			this.listener_ = listener;
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			close();
		}

        /* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public sendData(invoke: Invoke): void
		{
			postMessage(invoke.toXML().toString(), "");

			for (let i: number = 0; i < invoke.size(); i++)
				if (invoke.at(i).getType() == "ByteArray")
					postMessage(invoke.at(i).getValue() as Uint8Array, "");
		}
	}
}