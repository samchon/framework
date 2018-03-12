import { MediatorSystem } from "../MediatorSystem";
import { ISlaveClient } from "../../slave/SlaveClient";

import { ParallelSystemArrayMediator } from "../ParallelSystemArrayMediator";
import { ParallelSystem } from "../ParallelSystem";
import { DistributedSystemArrayMediator } from "../../distributed/DistributedSystemArrayMediator";
import { DistributedSystem } from "../../distributed/DistributedSystem";

import { IServerConnector } from "../../../protocol/communicator/IServerConnector";
import { ServerConnector } from "../../../protocol/communicator/server_connector/ServerConnector";
import { WebServerConnector } from "../../../protocol/communicator/server_connector/WebServerConnector";
import { SharedWorkerServerConnector } from "../../../protocol/communicator/server_connector/SharedWorkerServerConnector";

/**
 * A mediator client, driver for the master server.
 * 
 * The {@link MediatorServer} is a class being a client connecting to the **master** server, following the protocol 
 * of Samchon Framework's own.
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorClient
	extends MediatorSystem
	implements ISlaveClient
{
	/**
	 * @hidden
	 */
	private ip: string;
	
	/**
	 * @hidden
	 */
	private port: number;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	/**
	 * Initializer Constructor.
	 * 
	 * @param systemArray The parent {@link ParallelSystemArrayMediator} object.
	 * @param ip IP address to connect.
	 * @param port Port number to connect.
	 */
	public constructor(systemArray: ParallelSystemArrayMediator<ParallelSystem>, ip: string, port: number);

	/**
	 * Initializer Constructor.
	 * 
	 * @param systemArray The parent {@link DistributedSystemArrayMediator} object.
	 * @param ip IP address to connect.
	 * @param port Port number to connect.
	 */
	public constructor(systemArray: DistributedSystemArrayMediator<DistributedSystem>, ip: string, port: number);

	public constructor
		(
			systemArray: ParallelSystemArrayMediator<ParallelSystem> | DistributedSystemArrayMediator<DistributedSystem>, 
			ip: string, port: number
		)
	{
		super(systemArray as ParallelSystemArrayMediator<ParallelSystem>);

		this.ip = ip;
		this.port = port;
	}

	/**
	 * Factory method creating {@link IServerConnector} object.
	 * 
	 * The {@link createServerConnector createServerConnector()} is an abstract method creating 
	 * {@link IServerConnector} object. Overrides and returns one of them, considering which protocol the **master** 
	 * server follows:
	 * 
	 * - {@link ServerConnector}
	 * - {@link WebServerConnector}
	 * - {@link SharedWorkerServerConnector}
	 * 
	 * @return A newly created {@link IServerConnector} object.
	 */
	protected createServerConnector(): IServerConnector
	{
		return new ServerConnector(this);
	}

	/* ---------------------------------------------------------
		METHOD OF CONNECTOR
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public start(): void
	{
		this.connect();
	}

	/**
	 * @inheritdoc
	 */
	public connect(): void
	{
		if (this.communicator_ != null)
			return;

		this.communicator_ = this.createServerConnector();
		(this.communicator_ as IServerConnector).connect(this.ip, this.port);
	}
}

/**
 * A mediator client, driver for the master server.
 * 
 * The {@link MediatorWebClient} is a class being a client connecting to the **master** server, following the 
 * web-socket 
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorWebClient
	extends MediatorClient
{
	/**
	 * @inheritdoc
	 */
	protected createServerConnector(): IServerConnector
	{
		return new WebServerConnector(this);
	}
}

/**
 * A mediator client, driver for the master server.
 * 
 * The {@link MediatorSharedWorkerClient} is a class being a client connecting to the **master** server, following 
 * the SharedWorker's protocol.
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorSharedWorkerClient
	extends MediatorClient
{
	/**
	 * @inheritdoc
	 */
	protected createServerConnector(): IServerConnector
	{
		return new SharedWorkerServerConnector(this);
	}
}