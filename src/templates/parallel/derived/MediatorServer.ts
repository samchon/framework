import { MediatorSystem } from "../MediatorSystem";
import { ISlaveServer } from "../../slave/SlaveServer";
import { IServer } from "../../../protocol/server/IServer";

import { ParallelSystemArrayMediator } from "../ParallelSystemArrayMediator";
import { ParallelSystem } from "../ParallelSystem";
import { DistributedSystemArrayMediator } from "../../distributed/DistributedSystemArrayMediator";
import { DistributedSystem } from "../../distributed/DistributedSystem";

import { IClientDriver } from "../../../protocol/communicator/IClientDriver";
import { ServerBase } from "../../../protocol/server/base/ServerBase";
import { WebServerBase } from "../../../protocol/server/base/WebServerBase";
import { DedicatedWorkerServerBase } from "../../../protocol/server/base/DedicatedWorkerServerBase";
import { SharedWorkerServerBase } from "../../../protocol/server/base/SharedWorkerServerBase";

/**
 * A mediator server, driver for the master client.
 * 
 * The {@link MediatorServer} is a class opening a server accepting the **master** client, following the protocol of 
 * Samchon Framework's own.
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorServer
	extends MediatorSystem
	implements ISlaveServer
{
	/**
	 * @hidden
	 */
	private server_base_: IServer;
	
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
	 * @param port Port number of server to open.
	 */
	public constructor(systemArray: ParallelSystemArrayMediator<ParallelSystem>, port: number);

	/**
	 * Initializer Constructor.
	 * 
	 * @param systemArray The parent {@link DistributedSystemArrayMediator} object.
	 * @param port Port number of server to open.
	 */
	public constructor(systemArray: DistributedSystemArrayMediator<DistributedSystem>, port: number);

	public constructor
		(
			systemArray: ParallelSystemArrayMediator<ParallelSystem> | DistributedSystemArrayMediator<DistributedSystem>, 
			port: number
		)
	{
		super(systemArray as ParallelSystemArrayMediator<ParallelSystem>);
		this.port = port;
	}

	/**
	 * Factory method creating {@link IServer} object.
	 * 
	 * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
	 * {@link MediatorServer}. Note that, **slave** (this {@link MediatorServer} object) must follow the **master**'s 
	 * 
	 *
	 * Overrides and return one of them considering the which protocol to follow:
	 *
	 * - {@link ServerBase}
	 * - {@link WebServerBase}
	 * - {@link SharedWorkerServerBase}
	 */
	protected createServerBase(): IServer
	{
		return new ServerBase(this);
	}

	/**
	 * Add a newly connected remote client.
	 * 
	 * {@link MediatorServer} represents a **slave** dedicating to its **master**. In that reason, the
	 * {@link MediatorServer} does not accept multiple **master** clients. It accepts only one. Thus, *listener* of
	 * the *communicator* is {@link MediatorSystem} object, itself.
	 * 
	 * @param driver A communicator with remote client.
	 */
	public addClient(driver: IClientDriver): void
	{
		this.communicator_ = driver;
		driver.listen(this);
	}

	/* ---------------------------------------------------------
		SERVER's METHOD
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public start(): void
	{
		this.open(this.port);
	}

	/**
	 * @inheritdoc
	 */
	public open(port: number): void
	{
		this.server_base_ = this.createServerBase();
		if (this.server_base_ == null)
			return;

		this.server_base_.open(port);
	}

	/**
	 * @inheritdoc
	 */
	public close(): void
	{
		if (this.server_base_ != null)
			this.server_base_.close();
	}
}

/**
 * A mediator server, driver for the master client.
 * 
 * The {@link MediatorWebServer} is a class opening a server accepting the **master** client, following the 
 * web-socket 
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorWebServer extends MediatorServer
{
	/**
	 * @inheritdoc
	 */
	protected createServerBase(): IServer
	{
		return new WebServerBase(this);
	}
}

/**
 * A mediator server, driver for the master client.
 * 
 * The {@link MediatorDedicatedWorkerServer} is a class opening a server accepting the **master** client, following 
 * the DedicatedWorker's 
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorDedicatedWorkerServer extends MediatorServer
{
	/**
	 * @inheritdoc
	 */
	protected createServerBase(): IServer
	{
		return new DedicatedWorkerServerBase(this);
	}
}

/**
 * A mediator server, driver for the master client.
 * 
 * The {@link MediatorSharedWorkerServer} is a class opening a server accepting the **master** client, following the
 * SharedWorker's 
 * 
 * #### [Inherited] {@link MediatorSystem}
 * @copydoc MediatorSystem
 */
export class MediatorSharedWorkerServer extends MediatorServer
{
	/**
	 * @inheritdoc
	 */
	protected createServerBase(): IServer
	{
		return new SharedWorkerServerBase(this);
	}
}