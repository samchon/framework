import { SlaveSystem } from "./SlaveSystem";
import { IServerConnector } from "../../protocol/communicator/IServerConnector";

export interface ISlaveClient
	extends SlaveSystem
{
	connect(ip: string, port: number): void;
}

export abstract class SlaveClient
	extends SlaveSystem
	implements ISlaveClient
{
	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor()
	{
		super();
	}

	/**
	 * @inheritdoc
	 */
	protected abstract createServerConnector(): IServerConnector;
	
	/* ---------------------------------------------------------
		METHOD OF CONNECTOR
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public connect(ip: string, port: number): void
	{
		if (this.communicator_ != null)
			return;

		this.communicator_ = this.createServerConnector();
		(this.communicator_ as IServerConnector).connect(ip, port);
	}
}