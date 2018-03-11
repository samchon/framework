import { _CommunicatorBase } from "./_CommunicatorBase";

import { Invoke } from "../../invoke/Invoke";

/**
 * A communicator for shared worker.
 * 
 * {@link SharedWorkerCommunicator} is an abstract class for communication between SharedWorker and Web-browser. This
 * {@link SharedWorkerCommunicator} is specified to {@link SharedWorkerServerConnector} and 
 * {@link SharedWorkerClientDriver} whether the remote system is a server (that my system is connecting to) or a client 
 * (a client conneting to to my server).
 * 
 * Note that, SharedWorker is a conception only existed in web-browser. This {@link SharedWorkerCommunicator} is not
 * supported in NodeJS. Only web-browser environment can utilize this {@link SharedWorkerCommunicator}.
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
 * #### [Inherited] {@link ICommunicator}
 * @copydoc ICommunicator
 */
export abstract class SharedWorkerCommunicator
	extends _CommunicatorBase
{
	/**
	 * @hidden
	 */
	protected port_: MessagePort;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	// using super::constructor

	/**
	 * @inheritdoc
	 */
	public close(): void
	{
		this.connected_ = false;

		this.port_.close();
		if (this.onClose != null)
			this.onClose();
	}

	/* ---------------------------------------------------------
		INVOKE MESSAGE I/O
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public sendData(invoke: Invoke): void
	{
		this.port_.postMessage(invoke.toXML().toString());

		for (let i: number = 0; i < invoke.size(); i++)
			if (invoke.at(i).getType() == "ByteaArray")
				this.port_.postMessage(invoke.at(i).getValue());
	}

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