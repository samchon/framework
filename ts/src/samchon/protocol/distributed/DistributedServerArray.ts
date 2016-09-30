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
				let system: IDistributedServer = this.at(i) as IDistributedServer;
				if (system.connect == undefined)
					continue;

				system.connect();
			}
		}
	}
}