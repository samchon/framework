/// <reference path="../../API.ts" />

/// <reference path="DistributedSystemArray.ts" />

namespace samchon.protocol.distributed
{
	export abstract class DistributedServerArray
		extends DistributedSystemArray
		implements external.IExternalServerArray
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
				let system: DistributedSystem = this.at(i);
				if ((system as IDistributedServer).connect == undefined)
					continue;

				(system as IDistributedServer).connect();
			}
		}
	}
}