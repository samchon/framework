import { ExternalClientArray } from "./ExternalClientArray";
import { IExternalServerClientArray } from "../interfaces/IExternalServerClientArray";

import { ExternalSystem } from "../ExternalSystem";
import { IExternalServer } from "../interfaces/IExternalServer";
import { XML } from "sxml";

/**
 * An array and manager of {@link IExternalServer external servers} and {@link ExternalSystem external clients}.
 * 
 * The {@link ExternalServerClientArray} is an abstract class, derived from the {@link ExternalSystemArray} class,
 * opening a server accepting {@link ExternalSystem external clients} and being a client connecting to
 * {@link IExternalServer external servers} at the same time.
 *
 * Extends this {@link ExternalServerClientArray} and overrides below methods. After the overridings, open server
 * with {@link open open()} method and connect to {@link IExternalServer external servers} through the
 * {@link connect connect()} method.
 *
 * - {@link createServerBase createServerBase()}
 * - {@link createExternalClient createExternalClient()}
 * - {@link createExternalServer createExternalServer()}
 * 
 * #### [Inherited] {@link ExternalSystemArray}
 * @copydoc ExternalSystemArray
 */
export abstract class ExternalServerClientArray<T extends ExternalSystem>
	extends ExternalClientArray<T>
	implements IExternalServerClientArray<T>
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
	public createChild(xml: XML): T
	{
		return this.createExternalServer(xml);
	}

	/**
	 * Factory method creating an {@link IExternalServer} object.
	 *
	 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
	 * @return A newly created {@link IExternalServer} object.
	 */
	protected abstract createExternalServer(xml: XML): T;

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