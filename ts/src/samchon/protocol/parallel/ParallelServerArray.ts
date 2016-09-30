/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArray.ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelServerArray
		extends ParallelSystemArray
		implements external.IExternalServerArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();
		}

		/* ---------------------------------------------------------
			CONNECTOR's METHOD
		--------------------------------------------------------- */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: IParallelServer = this.at(i) as IParallelServer;
				if (system.connect == undefined)
					continue;

				system.connect();
			}
		}
	}
}