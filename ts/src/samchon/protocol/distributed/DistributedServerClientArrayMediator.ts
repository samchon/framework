/// <reference path="../../API.ts" />

/// <reference path="DistributedClientArrayMediator.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedServerClientArrayMediator
		extends DistributedClientArrayMediator
		implements external.IExternalServerClientArray
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

		public createChild(xml: library.XML): DistributedSystem
		{
			return this.createExternalServer(xml);
		}
		protected abstract createExternalServer(xml: library.XML): IDistributedServer;

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