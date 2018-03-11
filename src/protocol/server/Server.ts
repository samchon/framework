import * as net from "net";

import { IServer } from "./IServer";
import { ClientDriver } from "../communicator/client_driver/ClientDriver";

/**
 * A server.
 * 
 * The {@link Server} is an abstract class designed to open a server and accept clients who are following Samchon
 * Framework's own protocol. Extends this {@link Server} class and overrides {@link addClient addClient()} method to
 * define what to do with newly connected {@link ClientDriver remote clients}.
 *
 * #### [Inherited] {@link IServer}
 * @copydoc Server
 */
export abstract class Server implements IServer
{
	/**
	 * @hidden
	 */
	private net_driver_: net.Server = null;

	/* -------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------- */
	// public constructor = default;

	/**
	 * @inheritdoc
	 */
	public abstract addClient(driver: ClientDriver): void;

	/* -------------------------------------------------------------------
		PROCEDURES
	------------------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public open(port: number): void
	{
		this.net_driver_ = net.createServer(this._Handle_connect.bind(this));
		this.net_driver_.listen(port);
	}

	/**
	 * @inheritdoc
	 */
	public close(): void
	{
		this.net_driver_.close();
		this.net_driver_ = null;
	}

	/**
	 * @hidden
	 */
	private _Handle_connect(socket: net.Socket): void
	{
		let clientDriver: ClientDriver = new ClientDriver(socket);
		this.addClient(clientDriver);
	}
}