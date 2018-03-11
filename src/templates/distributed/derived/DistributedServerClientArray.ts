/// <reference path="DistributedClientArray.ts" />

namespace samchon.templates.distributed
{
	/**
	 * Master of Distributed Processing System, be a server and client at the same time.
	 *
	 * The {@link DistributedServerClientArray} is an abstract class, derived from the {@link DistributedSystemArray} 
	 * class, opening a server accepting {@link Distributed distributed clients} and being a client connecting to
	 * {@link IDistributedServer distributed servers} at the same time.
	 *
	 * Extends this {@link DistributedServerClientArray} and overrides below methods. After the overridings, open server
	 * with {@link open open()} method and connect to {@link IDistributedServer distributed servers} through the
	 * {@link connect connect()} method.
	 *
	 * - {@link createServerBase createServerBase()}
	 * - {@link createExternalClient createExternalClient()}
	 * - {@link createExternalServer createExternalServer()}
	 * 
	 * #### [Inherited] {@link DistributedSystemArray}
	 * @copydoc DistributedSystemArray
	 */
	export abstract class DistributedServerClientArray<System extends DistributedSystem>
		extends DistributedClientArray<System>
		implements external.IExternalServerClientArray<System>
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
		public createChild(xml: library.XML): System
		{
			return this.createExternalServer(xml);
		}

		/**
		 * Factory method creating an {@link IDistributedServer} object.
		 *
		 * @param xml An {@link XML} object represents child element, so that can identify the type of child to create.
		 * @return A newly created {@link IDistributedServer} object.
		 */
		protected abstract createExternalServer(xml: library.XML): System;

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
				let system: external.ExternalSystem = this.at(i);
				if ((system as external.IExternalServer).connect == undefined)
					continue;

				(system as external.IExternalServer).connect();
			}
		}
	}
}