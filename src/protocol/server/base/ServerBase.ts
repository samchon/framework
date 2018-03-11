import { Server } from "../Server";

import { IServer } from "../IServer";
import { IClientDriver } from "../../communicator/IClientDriver";

/**
 * A substitute {@link Server}.
 * 
 * The {@link ServerBase} is a substitute class who subrogates {@link Server}'s responsibility.
 * 
 * #### [Inherited] {@link IServerBase}
 * @copydoc IServerBase
 */
export class ServerBase
	extends Server
	implements IServer
{
	/**
	 * @hidden
	 */
	private hooker_: IServer;

	/* -------------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------------- */
	/**
	 * Construct from a *hooker*.
	 * 
	 * @param hooker A hooker throwing responsibility of server's role.
	 */
	public constructor(hooker: IServer)
	{
		super();
		this.hooker_ = hooker;
	}

	/**
	 * @inheritdoc
	 */
	public addClient(driver: IClientDriver): void
	{
		this.hooker_.addClient(driver);
	}
}