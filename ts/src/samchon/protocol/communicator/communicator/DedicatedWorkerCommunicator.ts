/// <reference path="../../../API.ts" />

/// <reference path="_CommunicatorBase.ts" />

namespace samchon.protocol
{
	/**
	 * A communicator for shared worker.
	 * 
	 * {@link DedicatedWorkerCommunicator} is an abstract class for communication between DedicatedWorker and Web-browser. 
	 * This {@link DedicatedWorkerCommunicator} is specified to {@link DedicatedWorkerServerConnector} and 
	 * {@link DedicatedWorkerClientDriver} whether the remote system is a server (that my system is connecting to) or a 
	 * client (a client conneting to to my server).
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
	 * #### [Inherited] {@link ICommunicator}
	 * @copydoc ICommunicator
	 */
    export abstract class DedicatedWorkerCommunicator
        extends _CommunicatorBase
    {
		/**
		 * @hidden
		 */
        protected _Handle_message(event: MessageEvent): void
        {
            if (this._Is_binary_invoke() == false)
                this._Handle_string(event.data);
            else
                this._Handle_binary(event.data);
        }
    }
}