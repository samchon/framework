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
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as external.IExternalServer).connect();
		}
	}
}