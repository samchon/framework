import { DedicatedWorkerCommunicator } from "../communicator/DedicatedWorkerCommunicator";
import { IServerConnector } from "../IServerConnector";

import { IProtocol } from "../../invoke/IProtocol";
import { Invoke } from "../../invoke/Invoke";

/**
 * A server connector for DedicatedWorker.
 *
 * {@link DedicatedWorkerServerConnector} is a class connecting to SharedWorker and taking full charge of network
 * communication with the SharedWorker. Create an {@link DedicatedWorkerServer} instance from the 
 * {@IProtocol listener} and call the {@link connect connect()} method.
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
 * #### [Inherited] {@link IServerConnector}
 * @copydoc IServerConnector
 */
export class DedicatedWorkerServerConnector
	extends DedicatedWorkerCommunicator
	implements IServerConnector
{
	/**
	 * @hidden
	 */
	private worker_: Worker;

	/**
	 * @inheritdoc
	 */
	public onConnect: Function;

	/* ---------------------------------------------------------
		CONSTRUCTORS
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
		this.worker_ = null;
	}

	/**
	 * @inheritdoc
	 */
	public connect(jsFile: string): void
	{
		// CONSTRUCT WORKER AND START LISTENING
		this.worker_ = new Worker(jsFile);
		this.worker_.onmessage = this._Handle_message.bind(this);

		// NOTIFY THE CONNECTION
		this.connected_ = true;
		if (this.onConnect != null)
			this.onConnect();
	}

	/**
	 * @inheritdoc
	 */
	public close(): void
	{
		this.worker_.terminate();

		if (this.onClose != null)
			this.onClose();
	}

	/* ---------------------------------------------------------
		INVOKE MESSAGE CHAIN
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public sendData(invoke: Invoke): void
	{
		this.worker_.postMessage(invoke.toXML().toString());

		for (let i: number = 0; i < invoke.size(); i++)
			if (invoke.at(i).getType() == "ByteArray")
				this.worker_.postMessage(invoke.at(i).getValue() as Uint8Array);
	}
}