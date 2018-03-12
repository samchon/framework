import { DistributedClientArrayMediator } from "./DistributedClientArrayMediator";
import { IExternalServerClientArray } from "../../external/interfaces/IExternalServerClientArray";

import { DistributedSystem } from "../DistributedSystem";
import { ExternalSystem } from "../../external/ExternalSystem";
import { IExternalServer } from "../../external/interfaces/IExternalServer";

import { XML } from "sxml";

/**
 * Mediator of Distributed Processing System, be a server and client at the same time as a **master**.
 *
 * The {@link DistributedServerClientArrayMediator} is an abstract class, derived from the
 * {@link DistributedSystemArrayMediator} class, opening a server accepting {@link DistributedSystem distributed 
 * clients} and being a client connecting to {@link IDistributedServer distributed servers} at the same time.
 *
 * Extends this {@link DistributedServerClientArrayMediator} and overrides below methods. After the overridings, open
 * server with {@link open open()} method and connect to {@link IDistributedServer distributed servers} through the
 * {@link connect connect()} method.
 *
 * - {@link createServerBase createServerBase()}
 * - {@link createExternalClient createExternalClient()}
 * - {@link createExternalServer createExternalServer()}
 * 
 * #### [Inherited] {@link DistributedSystemArrayMediator}
 * @copydoc DistributedSystemArrayMediator
 */
export abstract class DistributedServerClientArrayMediator<System extends DistributedSystem>
	extends DistributedClientArrayMediator<System>
	implements IExternalServerClientArray<System>
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
	 * Factory method of a child Entity.
	 *
	 * This method is migrated to {@link createExternalServer}. Override the {@link createExternalServer} method.
	 *
	 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
	 * @return A new child Entity via {@link createExternalServer createExternalServer()}.
	 */
	public createChild(xml: XML): System
	{
		return this.createExternalServer(xml);
	}

	/**
	 * Factory method creating an {@link IDistributedServer} object.
	 *
	 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
	 * @return A newly created {@link IDistributedServer} object.
	 */
	protected abstract createExternalServer(xml: XML): System;

	/* ---------------------------------------------------------
		METHOD OF CLIENT
	--------------------------------------------------------- */
	/**
	 * @inheritdoc
	 */
	public connect(): void
	{
		for (let i: number = 0; i < this.size(); i++)
		{
			let system: ExternalSystem = this.at(i);
			if ((system as IExternalServer).connect == undefined)
				continue;

			(system as IExternalServer).connect();
		}
	}
}