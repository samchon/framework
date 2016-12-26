/// <reference path="../../API.ts" />

namespace samchon.protocol
{
	/**
	 * A DeidcatedWorker server.
	 *
	 * The {@link DedicatedWorkerServer} is an abstract class is realized to open a DedicatedWorker server and accept 
	 * web-browser client (master). Extends this {@link DedicatedWorkerServer} class and overrides 
	 * {@link addClient addClient()} method to define what to do with a newly connected 
	 * {@link DedicatedWorkerClientDriver remote client}.
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
	 * #### [Inherited] {@link IServer}
	 * @copydoc IServer
	 */
	export abstract class DedicatedWorkerServer implements IServer
    {
        /* -------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------- */
        /**
		 * @inheritdoc
		 */
        public abstract addClient(driver: DedicatedWorkerClientDriver): void;

        /* -------------------------------------------------------------------
			PROCEDURES
		------------------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public open(): void
		{
			this.addClient(new DedicatedWorkerClientDriver());
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			close();
		}
	}
}
