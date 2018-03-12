/// <reference path="../DistributedSystemArrayMediator.ts" />

import { DistributedSystemArrayMediator } from "../DistributedSystemArrayMediator";
import { IExternalServerArray } from "../../external/interfaces/IExternalServerArray";
import { IDistributedServer } from "../interfaces/IDistributedServer";

/**
 * Mediator of Distributed Processing System, a client connecting to slave servers.
 *
 * The {@link DistributedServerArrayMediator} is an abstract class, derived from {@link DistributedSystemArrayMediator}
 * class, connecting to {@link IDistributedServer distributed servers}.
 *
 * Extends this {@link DistributedServerArrayMediator} and overrides {@link createChild createChild()} method creating
 * child {@link IDistributedServer} object. After the extending and overriding, construct children
 * {@link IDistributedServer} objects and call the {@link connect connect()} method.
 * 
 * #### [Inherited] {@link DistributedSystemArrayMediator}
 * @copydoc DistributedSystemArrayMediator
 */
export abstract class DistributedServerArrayMediator<System extends IDistributedServer>
	extends DistributedSystemArrayMediator<System>
	implements IExternalServerArray<System>
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

	/* ---------------------------------------------------------
		CONNECTOR's METHOD
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public connect(): void
	{
		for (let i: number = 0; i < this.size(); i++)
			this.at(i).connect();
	}
}