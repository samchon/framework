import { SlaveSystem } from "./SlaveSystem";

import { IServer } from "../../protocol/server/IServer";
import { IClientDriver } from "../../protocol/communicator/IClientDriver";

export interface ISlaveServer
	extends SlaveSystem, IServer
{
}

export abstract class SlaveServer
	extends SlaveSystem
	implements ISlaveServer
{
	/**
	 * @hidden
	 */
	private server_base_: IServer;

	/* =========================================================
		CONSTRUCTORS
			- MEMBER
			- FACTORY METHOD FOR CHILDREN
	============================================================
		MEMBER 
	--------------------------------------------------------- */
	/**
	 * Default Constructor.
	 */
	public constructor()
	{
		super();

		this.server_base_ = null;
	}

	/**
	 * @inheritdoc
	 */
	protected abstract createServerBase(): IServer;

	/* ---------------------------------------------------------
		SERVER's METHOD
	--------------------------------------------------------- */
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

	/* ---------------------------------------------------------
		OVERRIDINGS
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public addClient(driver: IClientDriver): void
	{
		this.communicator_ = driver;
		driver.listen(this);
	}
}