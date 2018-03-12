import { ExternalSystemArray } from "../ExternalSystemArray";
import { IExternalServerArray } from "../interfaces/IExternalServerArray";

import { IExternalServer } from "../interfaces/IExternalServer";

/**
 * An array and manager of {@link IExternalServer external servers}.
 *
 * The {@link ExternalServerArray} is an abstract class, derived from the {@link ExternalSystemArray} class,
 * connecting to {@link IExternalServer external servers}.
 *
 * Extends this {@link ExternalServerArray} and overrides {@link createChild createChild()} method creating child
 * {@link IExternalServer} object. After the extending and overriding, construct children {@link IExternalServer}
 * objects and call the {@link connect connect()} method.
 * 
 * #### [Inherited] {@link ExternalSystemArray}
 * @copydoc ExternalSystemArray
 */
export abstract class ExternalServerArray<T extends IExternalServer>
	extends ExternalSystemArray<T>
	implements IExternalServerArray<T>
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