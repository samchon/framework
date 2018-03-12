/// <reference path="../ParallelSystemArray.ts" />

import { ParallelSystemArray } from "../ParallelSystemArray";
import { IExternalServerArray } from "../../external/interfaces/IExternalServerArray";
import { IParallelServer } from "../interfaces/IParallelServer";

/**
 * Master of Parallel Processing System, a client connecting to slave servers.
 * 
 * The {@link ParallelServerArray} is an abstract class, derived from the {@link ParallelSystemArray} class, 
 * connecting to {@link IParallelServer parallel servers}.
 * 
 * Extends this {@link ParallelServerArray} and overrides {@link createChild createChild()} method creating child 
 * {@link IParallelServer} object. After the extending and overriding, construct children {@link IParallelServer}
 * objects and call the {@link connect connect()} method.
 * 
 * #### [Inherited] {@link ParallelSystemArray}
 * @copydoc ParallelSystemArray
 */
export abstract class ParallelServerArray<System extends IParallelServer>
	extends ParallelSystemArray<System>
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