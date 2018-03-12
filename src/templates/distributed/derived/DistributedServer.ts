import { DistributedSystem } from "../DistributedSystem";
import { IExternalServer } from "../../external/interfaces/IExternalServer";

import { DistributedSystemArray } from "../DistributedSystemArray";
import { IServerConnector } from "../../../protocol/communicator/IServerConnector";

/**
 * A driver for distributed slave server.
 *
 * The {@link DistributedServer} is an abstract class, derived from the {@link DistributedSystem} class, connecting to
 * remote, distributed **slave** server. Extends this {@link DistributedServer} class and overrides the
 * {@link createServerConnector createServerConnector()} method following which protocol the **slave** server uses.
 * 
 * #### [Inheritdoc] {@link DistributedSystem}
 * @copydoc DistributedSystem
 */
export abstract class DistributedServer
	extends DistributedSystem
	implements IExternalServer
{
	/**
	 * IP address of target external system to connect.
	 */
	protected ip: string;

	/**
	 * Port number of target external system to connect.
	 */
	protected port: number;

	/**
	 * Construct from parent {@link DistributedSystemArray}.
	 * 
	 * @param systemArray The parent {@link DistributedSystemArray} object.
	 */
	public constructor(systemArray: DistributedSystemArray<DistributedSystem>)
	{
		super(systemArray);

		this.ip = "";
		this.port = 0;
	}

	/**
	 * Factory method creating {@link IServerConnector} object.
	 * 
	 * The {@link createServerConnector createServerConnector()} is an abstract method creating 
	 * {@link IServerConnector} object. Overrides and returns one of them, considering which protocol the slave server 
	 * follows:
	 * 
	 * - {@link ServerConnector}
	 * - {@link WebServerConnector}
	 * - {@link DedicatedWorkerServerConnector}
	 * - {@link SharedWorkerServerConnector}
	 * 
	 * @return A newly created {@link IServerConnector} object.
	 */
	protected abstract createServerConnector(): IServerConnector;

	/**
	 * @inheritdoc
	 */
	public connect(): void
	{
		if (this.communicator != null)
			return;

		this.communicator = this.createServerConnector();
		(this.communicator as IServerConnector).connect(this.ip, this.port);
	}
}