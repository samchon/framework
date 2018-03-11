/// <reference path="../DistributedSystemArray.ts" />

namespace samchon.templates.distributed
{
	/**
	 * Master of Distributed Processing System, a client connecting to slave servers.
	 *
	 * The {@link DistributedServerArray} is an abstract class, derived from the {@link DistributedSystemArray} class,
	 * connecting to {@link IDistributedServer distributed servers}.
	 *
	 * Extends this {@link DistributedServerArray} and overrides {@link createChild createChild()} method creating child
	 * {@link IDistributedServer} object. After the extending and overriding, construct children {@link IDistributedServer}
	 * objects and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link DistributedSystemArray}
	 * @copydoc DistributedSystemArray
	 */
	export abstract class DistributedServerArray<System extends IDistributedServer>
		extends DistributedSystemArray<System>
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
				this.at(i).connect();
		}
	}
}