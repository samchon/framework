/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	export interface IExternalServerArray
		extends ExternalSystemArray
	{
		connect(): void;
	}

	export abstract class ExternalServerArray
		extends ExternalSystemArray
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
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}
	}
}