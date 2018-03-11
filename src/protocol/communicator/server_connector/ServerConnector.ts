import * as net from "net";

import { Communicator } from "../communicator/Communicator";
import { IServerConnector } from "../IServerConnector";
import { IProtocol } from "../../invoke/IProtocol";

/**
 * Server connnector.
 * 
 * {@link ServerConnector} is a class connecting to remote server who follows Samchon Framework's own protocol and 
 * taking full charge of network communication with the remote server. Create a {@link ServerConnector} instance from 
 * the {@IProtocol listener} and call the {@link connect connect()} method.
 * 
 * #### [Inherited] {@link IServerConnector}
 * @copydoc IServerConnector
 */
export class ServerConnector
	extends Communicator
	implements IServerConnector
{
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

		this.connected_ = false;
	}

	/**
	 * @inheritdoc
	 */
	public connect(ip: string, port: number): void
	{
		this["socket_"] = net.connect({ host: ip, port: port }, this._Handle_connect.bind(this));
	}

	/* ---------------------------------------------------------
		HANDLERS
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	private _Handle_connect(): void
	{
		this.connected_ = true;

		this._Start_listen();
		this._Send_dummy_packet_repeatedly();

		if (this.onConnect != null)
			this.onConnect();
	}

	/**
	 * @hidden
	 */
	private _Send_dummy_packet_repeatedly(): void
	{
		setInterval(function (): void
		{
			// WRITE A HEADER BUFFER WHICH MEANS CONTENT SIZE IS ZERO.
			let packet: Buffer = new Buffer(8);
			packet.writeUInt32BE(0, 0);
			packet.writeUInt32BE(0, 4);

			// SEND
			try
			{
				(this as ServerConnector)["socket_"].write(packet);
			} 
			catch (exception)
			{ // REPEAT IT UNTIL DISCONNECTION
				return;
			}
		}.bind(this), 5000);
	}
}