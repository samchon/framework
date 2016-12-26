/// <reference path="../ParallelSystemArrayMediator.ts" />

namespace samchon.templates.parallel
{
	/**
	 * Mediator of Parallel Processing System, a client connecting to slave servers.
	 *
	 * The {@link ParallelServerArrayMediator} is an abstract class, derived from the {@link ParallelSystemArrayMediator} 
	 * class, connecting to {@link IParallelServer parallel servers}.
	 *
	 * Extends this {@link ParallelServerArrayMediator} and overrides {@link createChild createChild()} method creating 
	 * child {@link IParallelServer} object. After the extending and overriding, construct children
	 * {@link IParallelServer} objects and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link ParallelSystemArrayMediator}
	 * @copydoc ParallelSystemArrayMediator
	 */
	export abstract class ParallelServerArrayMediator<System extends IParallelServer>
		extends ParallelSystemArrayMediator<System>
		implements external.IExternalServerArray<System>
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
			{
				this.at(i).connect();
			}
		}
	}
}